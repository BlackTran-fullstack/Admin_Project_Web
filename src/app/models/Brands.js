const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Brands = new Schema({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
});

module.exports = mongoose.model("Brands", Brands);