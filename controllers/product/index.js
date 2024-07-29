import axios from "axios";
import db from "../../models";

require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export async function getProducts(req, res) {
  const productsApi = await axios
    .get("https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/get")
    .then((res) => {
      return res?.data?.products ?? [];
    })
    .catch((res) => {
      return [];
    });
  productsApi.forEach(async (v) => {
    await db.Product.upsert({
      id: v.id,
      title: v.title,
      tags: v.tags,
    });

    const variants = v.variants;
    variants.forEach(async (v2) => {
      await db.ProductVariant.upsert({
        id: v2.id,
        productId: v.id,
        sku: v2.sku,
        title: v2.title,
      });
    });
  });

  const productsModel = await db.Product.findAll({
    attributes: ["id", "title", "tags"],
    include: [
      {
        model: db.ProductVariant,
        attributes: ["id", "title", "sku"],
        as: "ProductVariant",
      },
    ],
  });

  return res.status(200).json({
    products: productsModel,
  });
}

export async function getProductsPost(req, res) {
  const productsApi = await axios
    .get(
      "https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/getProducts"
    )
    .then((res) => {
      return res?.data?.products ?? [];
    })
    .catch((res) => {
      return [];
    });

  productsApi.forEach((v) => {
    const variants = v.variants;
    variants.forEach(async (v2) => {
      await db.ProductVariant.upsert({
        id: v2.id,
        productId: v.id,
        sku: v2.sku,
        title: v2.title,
      });
    });
  });

  const ProductVariantModel = await db.ProductVariant.findAll({
    attributes: ["id", "title", "sku"],
  });

  return res.status(200).json({
    productVariants: ProductVariantModel,
  });
}

export async function deleteProduct(req, res) {
  const id = req.params.product_id;
  const productModel = await db.Product.findOne(
    {
      where: { id },
    }
  );

  if (!productModel) {
    res.status(404).json({
      message: "Product not found"
    });

    return;
  }

  await db.Product.destroy({ where: { id } });

  res.status(200).json({ data: productModel, message: "Product successfully deleted" });
}

export async function updateProducts(req, res) {
  const productsApi = await axios
    .get("https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/get")
    .then((res) => {
      return res?.data?.products ?? [];
    })
    .catch((res) => {
      return [];
    });
  productsApi.forEach(async (v) => {
    const variants = v.variants;

    let productTitle = v.title;

    variants.forEach((v2) => {
      productTitle = `${productTitle} ${v2.sku}`;
    });

    await db.Product.update({
      title: productTitle,
    }, {
      where: { id: v.id }
    });
  });

  const productsModel = await db.Product.findAll({
    attributes: ["id", "title", "tags"],
    include: [
      {
        model: db.ProductVariant,
        attributes: ["id", "title", "sku"],
        as: "ProductVariant",
      },
    ],
  });

  res.status(200).json({ data: productsModel, message: "Products successfully updated" });
}
