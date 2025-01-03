const mongoose = require("mongoose");

async function connect() {
    try {
        // await mongoose.connect("mongodb://localhost:27017/web_project_furniro");
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connect Successfully!!!");
    } catch (error) {
        console.log("Connect failure!!!");
    }
}

module.exports = { connect };
