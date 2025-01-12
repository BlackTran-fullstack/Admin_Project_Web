const express = require("express");
const router = express.Router();

const users = require("../app/models/Users");

const siteController = require("../app/controllers/SiteControllers");
const usersControllers = require("../app/controllers/UsersControllers");

const paginatedResults = require("../middlewares/paginated");

router.get("/api", paginatedResults(users), usersControllers.getPaginatedUsers);

router.get("/api/:userId", usersControllers.getUserById);

router.get("/:id", usersControllers.getUser);

router.post("/:id/ban", usersControllers.banUser);

router.post("/:id/unban", usersControllers.unbanUser);

router.get("/", usersControllers.getUsers);

module.exports = router;
