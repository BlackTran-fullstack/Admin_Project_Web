const express = require("express");
const router = express.Router();

const Brands = require("../app/models/Brands");
const BrandsController = require("../app/controllers/BrandsController");
const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(Brands), BrandsController.getPaginatedBrands);

router.post("/api", BrandsController.createBrand);

router.put("/api/:id", BrandsController.updateBrand);

router.delete("/api/:id", BrandsController.deleteBrand);

router.get("/", BrandsController.getBrands);

module.exports = router;