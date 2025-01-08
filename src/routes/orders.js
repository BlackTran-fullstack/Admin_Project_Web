const express = require("express");
const router = express.Router();

const orders = require("../app/models/Orders");
const ordersControllers = require("../app/controllers/OrdersControllers");
const paginatedResults = require("../middlewares/paginated");

router.get("/api",paginatedResults(orders), ordersControllers.allOrders);

router.get("/", ordersControllers.getOrders);

module.exports = router;