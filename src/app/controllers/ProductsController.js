const mongoose = require("mongoose");

const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Brands = require("../models/Brands");

const { createClient } = require("@supabase/supabase-js");

// Cấu hình Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const ObjectId = mongoose.Types.ObjectId; // Add this line to fix the error

class ProductsController {
    // [GET] /products/categories
    getCategories(req, res, next) {
        Categories.find({})
            .then((categories) => {
                res.json(categories);
            })
            .catch(next);
    }

    // [GET] /products/brands
    getBrands(req, res, next) {
        Brands.find({})
            .then((brands) => {
                res.json(brands);
            })
            .catch(next);
    }

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

    // [GET] /products/api/:id
    getProduct(req, res, next) {
        const { id } = req.params;

        console.log("Vao getProduct");

        Products.findById(id)
            .populate("categoriesId", "name")
            .populate("brandsId", "name")
            .then((product) => {
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ message: "Product not found" });
                }
            })
            .catch((error) => {
                console.error("Error getting product:", error);
                res.status(500).json({
                    message: "Failed to get product",
                    error,
                });
            });
    }

    // [POST] /products/api
    createProduct(req, res, next) {
        const {
            name,
            price,
            category,
            brand,
            stock,
            imagePath,
            extraImages,
            slug,
        } = req.body;

        // Tạo đối tượng sản phẩm mới
        const newProduct = new Products({
            name,
            price,
            categoriesId: new ObjectId(category), // Use new ObjectId here
            brandsId: new ObjectId(brand), // Use new ObjectId here
            stock,
            imagePath,
            extraImages,
            slug,
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
        console.log("Vao updateProduct");

        const { id } = req.params;
        const { name, price, category, brand, stock, imagePath, extraImages } =
            req.body;

        Products.findByIdAndUpdate(
            id,
            {
                name,
                price,
                categoriesId: category,
                brandsId: brand,
                stock,
                imagePath,
                extraImages,
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

    // [POST] /products/upload-img
    async uploadImage(req, res, next) {
        const files = req.files;

        // Kiểm tra xem file có tồn tại hay không
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        try {
            // Mảng lưu URL các ảnh đã upload
            const imageUrls = [];

            // Upload ảnh lên Supabase
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = `${Date.now()}-${file.originalname}`;

                // Upload file to Supabase
                const { data, error } = await supabase.storage
                    .from("images")
                    .upload(`${fileName}`, file.buffer, {
                        cacheControl: "3600", // 1 hour
                        upsert: true,
                    });

                if (error) {
                    return res
                        .status(500)
                        .json({ message: "Failed to upload image", error });
                }

                const imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;
                imageUrls.push(imageUrl);
            }

            // Trả về URL của file đã upload
            res.json({ imageUrls });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ message: "Failed to upload image", error });
        }
    }
}

module.exports = new ProductsController();
