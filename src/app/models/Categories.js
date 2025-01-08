const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categories = new Schema({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    desc: { type: String },
});

module.exports = mongoose.model("Categories", Categories);