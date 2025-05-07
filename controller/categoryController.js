const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.createCategory = asyncHandler(async (req, res, nxt) => {
  const category = await Category.create(req.body);
  res.status(201).json({ data: category });
});

exports.getCategories = asyncHandler(async (req, res, nxt) => {
  const categories = await Category.find({});
  res.status(200).json({ results: categories.length, data: categories });
});

exports.getCategory = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return nxt(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!category) {
    return nxt(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return nxt(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
