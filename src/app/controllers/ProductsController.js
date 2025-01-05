const Products = require("../models/Products");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class ProductsController {
    // [GET] /products
    getProducts(req, res, next) {
        Products.find({})
            .then((products) => {
                res.render("products", {
                    products: mutipleMongooseToObject(products),
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
