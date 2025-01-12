const mongoose = require("mongoose");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const ObjectId = mongoose.Types.ObjectId;

const Brands = require("../models/Brands");

class BrandsController {
    // [GET] /brands
    getBrands(req, res, next) {
        Brands.find({})
            .then((brands) => {
                res.render("brands", {
                    brands: mutipleMongooseToObject(brands),
                    showNavbar: true,
                });
            })
            .catch(next);
    }

    // [GET] /brands/api
    getPaginatedBrands(req, res, next) {
        if (res.paginatedResults) {
            res.json(res.paginatedResults);
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }

    // [POST] /brands/api
    createBrand(req, res, next) {
        const { name } = req.body;

        console.log("name", name);

        const newBrand = new Brands({
            name,
        });

        newBrand
            .save()
            .then((savedBrand) => {
                res.status(201).json(savedBrand);
            })
            .catch(next);
    }

    // [PUT] /brands/api/:id
    updateBrand(req, res, next) {
        const { name } = req.body;
        const { id } = req.params;

        Brands.updateOne({ _id: id }, { name })
            .then(() => {
                res.status(200).json({ message: "Updated successfully" });
            })
            .catch(next);
    }

    // [DELETE] /brands/api/:id
    deleteBrand(req, res, next) {
        const { id } = req.params;

        Brands.deleteOne({ _id: id })
            .then(() => {
                res.status(200).json({ message: "Deleted successfully" });
            })
            .catch(next);
    }
}

module.exports = new BrandsController();