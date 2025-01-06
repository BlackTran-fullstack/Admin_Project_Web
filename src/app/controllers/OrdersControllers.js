const Products = require("../models/Products");
const Orders = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class OrdersController {
    // [GET] /orders/allOrders
    async allOrders(req, res) {
        try {
            const orders = await Orders.find().sort({
                createdAt: -1,
            });
            res.render("order", {
                orders: mutipleMongooseToObject(orders),
                user: mongooseToObject(req.user),
            });
        } catch (error) {
            console.error("Error in allOrders:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /list-orders
    async listOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Orders.find({ userId }).sort({
                createdAt: -1,
            });
            res.render("orders", {
                orders: mutipleMongooseToObject(orders),
                user: mongooseToObject(req.user),
            });
        } catch (error) {
            console.error("Error in listOrders:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /list-orders/:orderId
    async orderDetails(req, res) {
        try {
            const orderId = req.params.orderId;
            const orderDetails = await OrderDetails.find({ orderId });
            let products = [];
            for (const item of orderDetails) {
                const product = await Products.findOne({ _id: item.productId });
                console.log("product:", product);
                products.push({
                    orderDetailId: item._id,
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                });
            }
            res.render("orderDetail", {
                products: products,
                user: mongooseToObject(req.user),
            });
        } catch (error) {
            console.error("Error in orderDetails:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    async orderDetail(req, res) {
        try {
            const orderdetailId = req.params.orderdetailId;
            const orderDetail = await OrderDetails.findOne({ _id: orderdetailId });
            res.render("orderDetail", {
                orderDetail: mongooseToObject(orderDetail),
            });
        }
        catch (error) {
            console.error("Error in orderDetail:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }
}

module.exports = new OrdersController();