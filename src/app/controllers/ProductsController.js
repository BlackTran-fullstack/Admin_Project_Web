const mongoose = require("mongoose");

const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Brands = require("../models/Brands");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const ObjectId = mongoose.Types.ObjectId; // Add this line to fix the error

class ProductsController {
    // [GET] /products
    getProducts(req, res, next) {
        Products.find({})
            .populate("categoriesId", "name")
            .populate("brandsId", "name")
            .then((products) => {
                res.render("products", {
                    products,
                    showNavbar: true,
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

    // [POST] /products/api
    createProduct(req, res, next) {
        const { name, price, category, brand, stock, imagePath } = req.body;

        // Tạo đối tượng sản phẩm mới
        const newProduct = new Products({
            name,
            price,
            categoriesId: new ObjectId(category), // Use new ObjectId here
            brandsId: new ObjectId(brand), // Use new ObjectId here
            stock,
            imagePath,
        });

        // Lưu sản phẩm vào MongoDB
        newProduct
            .save()
            .then((savedProduct) => {
                // Populate the category and return the saved product
                return savedProduct
                    .populate("categoriesId", "name")
                    .then((populatedProduct) => {
                        res.status(201).json(populatedProduct); // Return the populated product
                    });
            })
            .catch((error) => {
                console.error("Error saving product:", error);
                res.status(500).json({
                    message: "Failed to save product",
                    error,
                });
            });
    }

    // [DELETE] /products/api/:id
    deleteProduct(req, res, next) {
        const { id } = req.params;

        Products.findByIdAndDelete(id)
            .then((deletedProduct) => {
                if (deletedProduct) {
                    res.json(deletedProduct);
                } else {
                    res.status(404).json({ message: "Product not found" });
                }
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                res.status(500).json({
                    message: "Failed to delete product",
                    error,
                });
            });
    }

    // [PUT] /products/api/:id
    updateProduct(req, res, next) {
        const { id } = req.params;
        const { name, price, category, brand, stock, imagePath } = req.body;

        Products.findByIdAndUpdate(
            id,
            {
                name,
                price,
                categoriesId: category,
                brandsId: brand,
                stock,
                imagePath,
            },
            { new: true }
        )
            .then((updatedProduct) => {
                if (updatedProduct) {
                    res.json(updatedProduct);
                } else {
                    res.status(404).json({ message: "Product not found" });
                }
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                res.status(500).json({
                    message: "Failed to update product",
                    error,
                });
            });
    }
}

module.exports = new ProductsController();