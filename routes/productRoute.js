const express = require("express");
const {
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");
const authController = require("../Controller/authController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "seller"),
    createProductValidator,
    createProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authController.protect,
    authController.allowedTo("admin", "seller"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
