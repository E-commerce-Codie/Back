class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["limit", "page", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    let filterQuery = {};

    if (queryStringObj.price) {
      const priceRange = queryStringObj.price.split(",");
      if (priceRange.length === 2) {
        filterQuery.price = { $gte: priceRange[0], $lte: priceRange[1] };
      }

      delete queryStringObj.price;
    }

    if (queryStringObj.ratingsAverage) {
      const ratingRange = queryStringObj.ratingsAverage.split(",");
      if (ratingRange.length === 2) {
        filterQuery.ratingsAverage = {
          $gte: ratingRange[0],
          $lte: ratingRange[1],
        };
      }
      delete queryStringObj.ratingsAverage;
    }

    const queryFilters = { ...filterQuery, ...queryStringObj };

    this.mongooseQuery = this.mongooseQuery.find(queryFilters);
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    return this.mongooseQuery.model
      .countDocuments(this.mongooseQuery.getFilter())
      .then((countDocuments) => {
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        if (skip + limit < countDocuments) {
          pagination.next = page + 1;
        }
        if (skip > 0) {
          pagination.prev = page - 1;
        }

        this.paginationResult = pagination;

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
      });
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fieldsLimit() {
    if (this.queryString.fields) {
      const fieldsLimit = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldsLimit);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const querySearch = {};
      querySearch.$or = [
        {
          title: { $regex: this.queryString.keyword, $options: "i" },
          description: { $regex: this.queryString.keyword, $options: "i" },
        },
      ];
      this.mongooseQuery = this.mongooseQuery.find(querySearch);
    }
    return this;
  }
}

module.exports = ApiFeatures;
