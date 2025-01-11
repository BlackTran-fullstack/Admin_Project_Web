const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordReset = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    otp: { type: String },
    createdAt: { type: Date },
    expiresAt: { type: Date },
});

module.exports = mongoose.model("PasswordReset", PasswordReset);
