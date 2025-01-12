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
                showNavbar: true,
            });
        } catch (error) {
            console.error("Error in getOrders:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /orders/api/orderDetails/:orderId
    async orderDetailsByOrderId(req, res) {
        if (res.paginatedResults) {
            const orderDetails = res.paginatedResults.data;

            console.log("Order Details:", orderDetails);

            let results = [];
    
            for (let i = 0; i < orderDetails.length; i++) {
                const product = await Products.findOne({ _id: orderDetails[i].productId });
                results.push({
                    ...orderDetails[i].toObject(),
                    product: product ? product.toObject() : null,
                });
            }

            res.json({
                success: true,
                data: results,
                totalDocuments: res.paginatedResults.totalDocuments,
                totalPages: res.paginatedResults.totalPages,
                page: res.paginatedResults.page,
                limit: res.paginatedResults.limit,
            });
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }

    // [GET] /orders/orderDetails/:orderId
    async orderDetails(req, res) {
        try {
            const orderId = req.params.orderId;
            const orderDetails = await OrderDetails.find({ orderId });
            const products = await Products.find({ _id: { $in: orderDetails.map((od) => od.productId) } });
            res.render("orderDetail", {
                orderId,
                products: mutipleMongooseToObject(products),
                user: mongooseToObject(req.user),
                showNavbar: true,
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

    // [POST] /orders/api/updateOrderStatus/:orderId
    async updateOrderStatus(req, res) {
        try {
            const { orderId, status } = req.body;
            console.log("Order ID:", orderId);
            console.log("Status:", status);
    
            const order = await Orders.findOne({ _id: orderId });
            if (!order) {
                return res.status(404).json({ success: false, errors: ["Order not found."] });
            }
    
            order.status = status;
            await order.save();
            res.json({ success: true });
        } catch (error) {
            console.error("Error in updateOrderStatus:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }
}

module.exports = new OrdersController();