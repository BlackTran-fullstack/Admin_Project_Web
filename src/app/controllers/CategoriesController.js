const mongoose = require("mongoose");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const ObjectId = mongoose.Types.ObjectId;

const Categories = require("../models/Categories");

class CategoriesController {
    // [GET] /categories
    getCategories(req, res, next) {
        Categories.find({})
            .then((categories) => {
                res.render("categories", {
                    categories: mutipleMongooseToObject(categories),
                    showNavbar: true,
                });
            })
            .catch(next);
    }

    // [GET] /categories/api
    getPaginatedCategories(req, res, next) {
        if (res.paginatedResults) {
            res.json(res.paginatedResults);
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }

    // [POST] /categories/api
    createCategory(req, res, next) {
        const { name, desc } = req.body;

        console.log("name", name);
        console.log("desc", desc);

        const newCategory = new Categories({
            name,
            desc,
        });

        console.log("newCategory", newCategory);

        newCategory
            .save()
            .then((savedCategory) => {
                res.status(201).json(savedCategory);
            })
            .catch(next);
    }

    // [PUT] /categories/api/:id
    updateCategory(req, res, next) {
        const { name, desc } = req.body;
        const { id } = req.params;

        Categories.updateOne({ _id: id }, { name, desc })
            .then(() => {
                Categories.findOne({ _id: id })
                    .then((category) => {
                        res.json(category);
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [DELETE] /categories/api/:id
    deleteCategory(req, res, next) {
        const { id } = req.params;

        Categories.deleteOne({ _id: id })
            .then(() => {
                res.json({ message: "Category deleted successfully" });
            })
            .catch(next);
    }

    // dashboard data
    // [GET] /categories/yearly-sales
    getYearlySales(req, res, next) {
        
    }
}

module.exports = new CategoriesController();