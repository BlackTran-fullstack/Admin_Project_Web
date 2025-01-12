const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categories = new Schema({
    name: { type: String, required: true },
    desc: { type: String },
});

module.exports = mongoose.model("Categories", Categories);