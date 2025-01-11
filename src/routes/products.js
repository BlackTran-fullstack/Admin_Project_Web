const express = require("express");
const router = express.Router();

const products = require("../app/models/Products");

const productsControllers = require("../app/controllers/ProductsController");

const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(products), productsControllers.getPaginatedProducts);

router.post("/api", productsControllers.createProduct);

router.delete("/api/:id", productsControllers.deleteProduct);

router.put("/api/:id", productsControllers.updateProduct);

router.get("/", productsControllers.getProducts);

module.exports = router;
