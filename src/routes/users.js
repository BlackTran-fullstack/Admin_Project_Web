const express = require("express");
const router = express.Router();

const users = require("../app/models/Users");

const usersControllers = require("../app/controllers/UsersControllers");

const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(users), usersControllers.getPaginatedUsers);

router.get("/api/:userId", usersControllers.getUserById);

router.get("/", usersControllers.getUsers);

module.exports = router;
