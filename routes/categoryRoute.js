const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const {
  createCategoryValidator,
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../validators/categoryValidator");
const authController = require("../Controller/authController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "seller"),
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("admin", "seller"),
    updateCategoryValidator,
    updateCategory
  );

module.exports = router;
