'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define(
    'ProductVariant',
    {
      productId: {
        type: DataTypes.BIGINT
      },
      title: {
        type: DataTypes.STRING
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  );

  ProductVariant.associate = function(models) {
    ProductVariant.belongsTo(models.Product, {
      foreignKey: 'productId',
      constraints: false,
      as: 'Product',
    });
  };

  return ProductVariant;
};
