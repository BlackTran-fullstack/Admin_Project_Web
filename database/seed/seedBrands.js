const mongoose = require("mongoose");

const Brands = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
});

const Brand = mongoose.model("Brands", Brands);

async function seedBrands() {
    try {
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connected to MongoDB!");

        // Sample data
        const brands = [
            { _id: new mongoose.Types.ObjectId("67449f554fc73c80de04b2a6"), name: "WoodCraft" },
            { _id: new mongoose.Types.ObjectId("67449f674fc73c80de04b2a7"), name: "ModernHome" },
            { _id: new mongoose.Types.ObjectId("67449f784fc73c80de04b2a8"), name: "RelaxCo" },
            { _id: new mongoose.Types.ObjectId("67449f8b4fc73c80de04b2a9"), name: "DreamWood" },
            { _id: new mongoose.Types.ObjectId("67449f9e4fc73c80de04b2aa"), name: "SleepWell" },
            { _id: new mongoose.Types.ObjectId("67449fbf4fc73c80de04b2ab"), name: "LightCraft" },
            { _id: new mongoose.Types.ObjectId("67449ffa4fc73c80de04b2ac"), name: "ReflecStyle" }
        ];

        // Insert or update each brand
        for (let brand of brands) {
            await Brand.updateOne(
                { _id: brand._id },  // Tìm theo _id
                { $set: brand },      // Cập nhật nếu tìm thấy
                { upsert: true }       // Nếu không tìm thấy, thêm mới
            );
        }

        console.log("Brands seeded/updated successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding brands:", error);
        mongoose.connection.close();
    }
}

seedBrands();