'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: {
        type: DataTypes.STRING
      },
      tags: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  );

  Product.associate = function(models) {
    Product.hasMany(models.ProductVariant, {
      foreignKey: 'productId',
      constraints: false,
      as: 'ProductVariant',
      onDelete: 'CASCADE'
    });
  };
  return Product;
};
