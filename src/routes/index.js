const siteRouter = require("./site");
const usersRouter = require("./users");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");
const brandsRouter = require("./brands");
const ordersRouter = require("./orders");

function route(app) {
    app.use("/", siteRouter);

    app.use("/users", usersRouter);

    app.use("/products", productsRouter);

    app.use("/categories", categoriesRouter);

    app.use("/brands", brandsRouter);

    app.use("/orders", ordersRouter);
}

module.exports = route;
