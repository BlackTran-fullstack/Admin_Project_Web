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
}

module.exports = new UsersControllers();
