const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersVerification = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    uniqueString: { type: String },
    createdAt: { type: Date },
    expiresAt: { type: Date },
});

module.exports = mongoose.model("UsersVerification", UsersVerification);
