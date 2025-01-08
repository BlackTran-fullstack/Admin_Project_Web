const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Brands = require("../models/Brands");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class ProductsController {
    // [GET] /products
    getProducts(req, res, next) {
        Products.find({})
            .populate("categoriesId", "name")
            .populate("brandsId", "name")
            .then((products) => {
                res.render("products", {
                    products
                });
            })
            .catch(next);
    }

    // [GET] /products/api
    getPaginatedProducts(req, res, next) {
        if (res.paginatedResults) {
            res.json(res.paginatedResults);
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }
}

module.exports = new ProductsController(); 
