const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const order = {
//     userId: userId,
//     products: cart,
//     total: total,
//     deliveryUnit: deliveryUnit.Name,
//     paymentMethod: req.body.paymentMethod,
// };

const OrderDetails = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: "Orders" },
    productId: { type: Schema.Types.ObjectId, ref: "Products" },
    quantity: { type: Number },
    isReview: { type: Boolean, default: false },
});



module.exports = mongoose.model("OrderDetails", OrderDetails);