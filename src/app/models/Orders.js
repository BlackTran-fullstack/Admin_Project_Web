const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const order = {
//     userId: userId,
//     products: cart,
//     total: total,
//     deliveryUnit: deliveryUnit.Name,
//     paymentMethod: req.body.paymentMethod,
// };

const Orders = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    total: { type: Number },
    deliveryUnit: { type: String, ref: "DeliveryUnits" },
    paymentMethod: { type: String, ref: "PaymentMethods" },
    status: { type: String, default: "Pending" },   
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Orders", Orders);