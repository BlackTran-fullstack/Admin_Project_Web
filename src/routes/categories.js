const express = require("express");
const router = express.Router();

const Categories = require("../app/models/Categories");
const CategoriesController = require("../app/controllers/CategoriesController");
const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(Categories), CategoriesController.getPaginatedCategories);

router.post("/api", CategoriesController.createCategory);

router.put("/api/:id", CategoriesController.updateCategory);

router.delete("/api/:id", CategoriesController.deleteCategory);

router.get("/", CategoriesController.getCategories);

module.exports = router;