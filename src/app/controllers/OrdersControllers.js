const mongoose = require("mongoose");
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

    // dashboard data
    // [GET] /orders/api/yearlySales
    async getYearlySales(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const nextEndDate = new Date(endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1);
            const yearlySales = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $expr: { $gte: [{ $toDate: "$createdAt" }, new Date(startDate)] } },
                                { $expr: { $lte: [{ $toDate: "$createdAt" }, nextEndDate] } },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        total: { $sum: "$total" },
                    },
                },
            ]);

            console.log("startDate:", startDate);
            console.log("endDate:", endDate);
            console.log("Yearly Sales:", yearlySales);

            res.json(yearlySales);
        } catch (error) {
            console.error("Error in getYearlySales:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /orders/api/orderTimes
    // morning: 6am - 12pm afternoon: 12pm - 6pm evening: 6pm - 12am night: 12am - 6am
    async getOrderTimes(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const nextEndDate = new Date(endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1);
            const orderTimes = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$createdAt", new Date(startDate)] },
                                { $lte: ["$createdAt", nextEndDate] },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        hour: { $hour: "$createdAt" },
                    },
                },
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    { case: { $and: [{ $gte: ["$hour", 6] }, { $lt: ["$hour", 12] }] }, then: "Morning" },
                                    { case: { $and: [{ $gte: ["$hour", 12] }, { $lt: ["$hour", 18] }] }, then: "Afternoon" },
                                    { case: { $and: [{ $gte: ["$hour", 18] }, { $lt: ["$hour", 24] }] }, then: "Evening" },
                                ],
                                default: "Night",
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            res.json(orderTimes);
        } catch (error) {
            console.error("Error in getOrderTimes:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /orders/api/numberOfOrders day by day 
    async getNumberOfOrders(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const nextEndDate = new Date(endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1);
            const numberOfOrders = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$createdAt", new Date(startDate)] },
                                { $lte: ["$createdAt", nextEndDate] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
            ]);

            res.json(numberOfOrders);
        } catch (error) {
            console.error("Error in getNumberOfOrders:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }
    
    // [GET] /orders/api/revenue day by day
    async getRevenue(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const nextEndDate = new Date(endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1);
            const revenue = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$createdAt", new Date(startDate)] },
                                { $lte: ["$createdAt", nextEndDate] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        total: { $sum: "$total" },
                    },
                },
            ]);

            res.json(revenue);
        } catch (error) {
            console.error("Error in getRevenue:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /orders/api/topProducts
    // Get top 5 products with the highest revenue from startDate to endDate
    async getTopRevenueProducts(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const nextEndDate = new Date(endDate);
            nextEndDate.setDate(nextEndDate.getDate() + 1);
            const topRevenueProducts = await OrderDetails.aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                {
                    $unwind: "$product",
                },
                {
                    $lookup: {
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "order",
                    },
                },
                {
                    $unwind: "$order",
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$order.createdAt", new Date(startDate)] },
                                { $lte: ["$order.createdAt", nextEndDate] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$product._id",
                        total: { $sum: "$product.price" },
                        product: { $first: "$product" },
                    },
                },
                {
                    $sort: { total: -1 },
                },
                {
                    $limit: 5,
                },
            ]);

            res.json(topRevenueProducts);
        } catch (error) {
            console.error("Error in getTopRevenueProducts:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }
}

module.exports = new OrdersController();