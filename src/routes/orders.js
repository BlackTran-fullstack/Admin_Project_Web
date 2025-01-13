const express = require("express");
const router = express.Router();

const orders = require("../app/models/Orders");
const OrderDetails = require("../app/models/OrderDetails");
const ordersControllers = require("../app/controllers/OrdersControllers");
const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(orders), ordersControllers.allOrders);

router.post("/api/updateOrderStatus", ordersControllers.updateOrderStatus);

router.get("/api/orderDetails/:orderId", paginatedResults(OrderDetails), ordersControllers.orderDetailsByOrderId);

router.get("/orderDetails/:orderId", ordersControllers.orderDetails);

router.get("/", ordersControllers.getOrders);

// dashboard data
router.get("/api/yearly_sales", ordersControllers.getYearlySales);

router.get("/api/orderTimes", ordersControllers.getOrderTimes);

router.get("/api/numberOfOrders", ordersControllers.getNumberOfOrders);

router.get("/api/revenue", ordersControllers.getRevenue);

router.get("/api/topProducts", ordersControllers.getTopProducts);

module.exports = router;