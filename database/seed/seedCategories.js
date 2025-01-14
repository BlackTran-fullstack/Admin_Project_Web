const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    desc: { type: String, required: true }
});

const Category = mongoose.model("Categories", Categories);

async function seedCategories() {
    try {
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connected to MongoDB!");

        // Sample data
        const categories = [
            { _id: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7ded"), name: "Cabinet", desc: "Cabinet updated" },
            { _id: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7dee"), name: "Table", desc: "Table" },
            { _id: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7def"), name: "Mirror", desc: "Mirror" },
            { _id: new mongoose.Types.ObjectId("673979c4d2067a8cc64f7df1"), name: "Chair", desc: "Chair" },
            { _id: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df3"), name: "Shelf", desc: "Shelf" },
            { _id: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df4"), name: "Lamp", desc: "Lamp" },
            { _id: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df5"), name: "Bed", desc: "Bed" },
            { _id: new mongoose.Types.ObjectId("673eeb15f80d6a76cf39967c"), name: "Others", desc: "Others" },
            { _id: new mongoose.Types.ObjectId("673eeb15f80d6a76cf39967d"), name: "Test", desc: "Test" },
        ];

        // Insert or update each category
        for (let category of categories) {
            await Category.updateOne(
                { _id: category._id },  // Tìm theo _id
                { $set: category },      // Cập nhật các trường nếu tìm thấy
                { upsert: true }         // Nếu không tìm thấy thì thêm mới
            );
        }

        console.log("Categories seeded/updated successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding categories:", error);
        mongoose.connection.close();
    }
}

seedCategories();