const Products = require("../models/Products");
const Orders = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const Users = require("../models/Users");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class OrdersController {
    // [GET] /orders/api
    async allOrders(req, res, next) {
        if (res.paginatedResults) {
            res.json(res.paginatedResults);
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }

    // [GET] /orders
    async getOrders(req, res) {
        try {
            const orders = await Orders.find({});
            res.render("orders", {
                orders: mutipleMongooseToObject(orders),
            });
        } catch (error) {
            console.error("Error in getOrders:", error);
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