const siteRouter = require("./site");
const usersRouter = require("./users");

function route(app) {
    app.use("/", siteRouter);

    app.use("/users", usersRouter);
}

module.exports = route;
