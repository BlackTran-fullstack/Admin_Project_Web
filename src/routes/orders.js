const express = require("express");
const router = express.Router();

const orders = require("../app/models/Orders");
const ordersControllers = require("../app/controllers/OrdersControllers");
const paginatedResults = require("../middlewares/paginated");

router.get("/", ordersControllers.allOrders);

module.exports = router;