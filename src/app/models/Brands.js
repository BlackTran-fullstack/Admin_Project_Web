const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Brands = new Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model("Brands", Brands);