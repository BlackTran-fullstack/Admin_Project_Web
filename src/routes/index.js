const siteRouter = require("./site");
const usersRouter = require("./users");
const productsRouter = require("./products");

function route(app) {
    app.use("/", siteRouter);

    app.use("/users", usersRouter);

    app.use("/products", productsRouter);
}

module.exports = route;
