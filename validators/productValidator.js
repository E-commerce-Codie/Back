const { check } = require("express-validator");
const Category = require("../models/categoryModel");
const validatorMiddleware = require("../middleWares/validatorMiddleware");
const slugify = require("slugify");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format...!!!"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product Title is required..!!")
    .isLength({ min: 3 })
    .withMessage("Product Title must be at least 3 characters..!!")
    .isLength({ max: 100 })
    .withMessage("Product title must not exceed 100 characters...!!")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  check("description")
    .notEmpty()
    .withMessage("Product Description is required..!!")
    .isLength({ min: 20 })
    .withMessage("Product Description must be at least 20 characters..!!"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required..!!")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((val, { req }) => {
      if (req.body.price <= val) {
        throw new Error("PriceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID Format..!!")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isFloat({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isFloat({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  check("currency")
    .notEmpty()
    .withMessage("Product currency is required")
    .isIn(["USD", "EGP"])
    .withMessage("Currency must be one of EGP or USD ."),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format...!!!"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format...!!!"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product Title must be at least 3 characters..!!")
    .isLength({ max: 100 })
    .withMessage("Product title must not exceed 100 characters...!!")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Product Description must be at least 20 characters..!!"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID Format..!!")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isFloat({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isFloat({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  check("currency")
    .optional()
    .isIn(["USD", "EGP"])
    .withMessage("Currency must be one of EGP or USD ."),
  validatorMiddleware,
];
