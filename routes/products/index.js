import express from "express";

import {
  getProducts,
  getProductsPost,
  deleteProduct,
  updateProducts
} from "../../controllers/product";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", getProductsPost);
router.delete("/products/:product_id", deleteProduct);
router.put("/products/", updateProducts);

export default router;
