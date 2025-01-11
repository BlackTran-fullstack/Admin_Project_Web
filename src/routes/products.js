const express = require("express");
const router = express.Router();

const products = require("../app/models/Products");

const productsControllers = require("../app/controllers/ProductsController");

const paginatedResults = require("../middlewares/paginated");

const { uploadAvatar } = require("../middlewares/multer");

router.get("/api", paginatedResults(products), productsControllers.getPaginatedProducts);

router.get("/api/:id", productsControllers.getProduct);

router.post("/api", productsControllers.createProduct);

router.delete("/api/:id", productsControllers.deleteProduct);

router.put("/api/:id", productsControllers.updateProduct);

router.post("/upload-img", uploadAvatar, productsControllers.uploadImage);  

router.get("/", productsControllers.getProducts);

module.exports = router;
