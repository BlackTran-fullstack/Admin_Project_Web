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
    // [GET] /orders/api/yearly_sales
    // const response = await fetch(`/orders/api/yearly_sales?year=${year}`);
    async getYearlySales(req, res) {
        try {
            const { year } = req.query;
            const monthlySales = await Orders.aggregate([
                {
                    $match: {
                        $expr: { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
                    },
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        total: { $sum: "$total" },
                    },
                },
            ]);

            res.json(monthlySales);
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
        const { year } = req.query;
        try {
            const orderTimes = await Orders.aggregate([
                {
                    $match: {
                        $expr: { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
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
                                    { case: { $and: [{ $gte: ["$hour", 0] }, { $lt: ["$hour", 6] }] }, then: "Night" },
                                ],
                                default: "Unknown",
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
            const { year, month } = req.query;
            const numberOfOrders = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
                                { $eq: [{ $month: "$createdAt" }, parseInt(month)] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" },
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
            const { year, month } = req.query;
            const revenue = await Orders.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
                                { $eq: [{ $month: "$createdAt" }, parseInt(month)] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" },
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
    async getTopProducts(req, res) {
        try {
            const { day, month, year } = req.query;
            const topProducts = await OrderDetails.aggregate([
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
                                { $eq: [{ $year: "$order.createdAt" }, parseInt(year)] },
                                { $eq: [{ $month: "$order.createdAt" }, parseInt(month)] },
                                { $eq: [{ $dayOfMonth: "$order.createdAt" }, parseInt(day)] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$productId",
                        count: { $sum: "$quantity" },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: 5,
                },
            ]);

            console.log("Top Products:", topProducts);

            // Convert product IDs to ObjectId
            const productIds = topProducts.map(product => new mongoose.Types.ObjectId(product._id));

            // Fetch product details
            const products = await Products.find({ _id: { $in: productIds } });

            // Map product details to topProducts
            const topProductsWithDetails = topProducts.map(product => {
                const productDetail = products.find(p => p._id.equals(product._id));
                return {
                    ...product,
                    product: productDetail ? productDetail.toObject() : null,
                };
            });

            res.json(topProductsWithDetails);
        } catch (error) {
            console.error("Error in getTopProducts:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }
}

module.exports = new OrdersController();