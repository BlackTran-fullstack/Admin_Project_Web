const Users = require("../models/Users");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

class UsersControllers {
    // [GET] /users
    getUsers(req, res, next) {
        Users.find({})
            .then((users) => {
                res.render("accounts", {
                    users: mutipleMongooseToObject(users),
                    currentUser: mongooseToObject(req.user),
                    showNavbar: true,
                });
            })
            .catch(next);
    }

    // [GET] /users/api
    getPaginatedUsers(req, res, next) {
        if (res.paginatedResults) {
            res.json(res.paginatedResults);
        } else {
            res.status(500).json({ message: "Pagination results not found" });
        }
    }

    // [GET] /users/api/:userId
    getUserById(req, res, next) {
        const userId = req.params.userId;
        Users.findOne({ _id: userId })
            .then((user) => {
                res.json(user);
            })
            .catch(next);
    }

    // [GET] /users/:id
    getUser(req, res, next) {
        Users.findById(req.params.id)
            .then((user) => {
                res.render("accountDetails", {
                    user: mongooseToObject(user),
                    showNavbar: true,
                });
            })
            .catch(next);
    }

    // [POST] /users/:id/ban
    async banUser(req, res, next) {
        try {
            const userId = req.params.id;
            await Users.findByIdAndUpdate(userId, { isBanned: true });
            res.status(200).json({
                success: true,
                message: "User banned successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                errors: ["Internal Server Error"],
            });
        }
    }

    // [POST] /users/:id/unban
    async unbanUser(req, res, next) {
        try {
            const userId = req.params.id;
            await Users.findByIdAndUpdate(userId, { isBanned: false });
            res.status(200).json({
                success: true,
                message: "User banned successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                errors: ["Internal Server Error"],
            });
        }
    }
}

module.exports = new UsersControllers();
