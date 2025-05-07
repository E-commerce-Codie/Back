const { check } = require("express-validator");
const validatorMiddleware = require("../middleWares/validatorMiddleware");
const slugify = require("slugify");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Category name must be less than 32 characters")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  check("image").optional(),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  check("name")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Category name must be less than 32 characters")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  check("image").optional(),
  validatorMiddleware,
];
