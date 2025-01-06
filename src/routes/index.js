const siteRouter = require("./site");
const usersRouter = require("./users");
const ordersRouter = require("./orders");

function route(app) {
    app.use("/", siteRouter);

    app.use("/users", usersRouter);

    app.use("/orders", ordersRouter);
}

module.exports = route;
