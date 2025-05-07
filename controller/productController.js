const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getProducts = asyncHandler(async (req, res, nxt) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .search();

  const countDocuments = await Product.countDocuments();

  await apiFeature.paginate(countDocuments);

  const { mongooseQuery, paginationResult } = apiFeature;

  const products = await mongooseQuery;

  res.status(200).json({
    status: "Success",
    results: products.length,
    paginationResult,
    data: products,
  });
});

exports.createProduct = asyncHandler(async (req, res, nxt) => {
  const {
    title,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    colors,
    imageCover,
    images,
    category,
    ratingsAverage,
    ratingsQuantity,
    currency,
  } = req.body;

  const product = await Product.create({
    title,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    colors,
    imageCover,
    images,
    category,
    ratingsAverage,
    ratingsQuantity,
    currency,
  });

  res.status(201).json({ data: product });
});

exports.getProduct = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return nxt(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const {
    title,
    description,
    quantity,
    sold,
    price,
    colors,
    imageCover,
    images,
    category,
    ratingsAverage,
    ratingsQuantity,
    currency,
  } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    {
      title,
      description,
      quantity,
      sold,
      price,
      colors,
      imageCover,
      images,
      category,
      ratingsAverage,
      ratingsQuantity,
      currency,
    },
    { new: true }
  );
  if (!product) {
    return nxt(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return nxt(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(204).send();
});
