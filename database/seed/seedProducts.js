const mongoose = require("mongoose");

const Products = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    long_description: { type: String, required: true },
    slug: { type: String, required: true },
    categoriesId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rate: { type: Number, required: true },
    imagePath: { type: String, required: true },
    brandsId: { type: mongoose.Schema.Types.ObjectId, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Products", Products);

async function seedProducts() {
    try {
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connected to MongoDB!");

        // Sample data
        const products = [
            { _id: new mongoose.Types.ObjectId("67397bc08330f2cda8561bcf"), name: "Aspen Table", description: "Elegant oak table", price: 2500000, stock: 4, long_description: "A premium oak dining table for modern homes.", slug: "aspen-table", categoriesId: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7dee"), rate: 4, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/aspen_table.jpg", brandsId: new mongoose.Types.ObjectId("67449f554fc73c80de04b2a6"), updatedAt: new Date("2025-01-13T03:24:25.614Z"), createdAt: new Date("2025-01-08T14:37:47.834Z") },
            { _id: new mongoose.Types.ObjectId("67397bc08330f2cda8561bd0"), name: "Nova Table", description: "Glass-top coffee table", price: 3000000, stock: 26, long_description: "Modern glass coffee table for living spaces.", slug: "nova-table", categoriesId: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7dee"), rate: 5, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/nova_table.jpg", brandsId: new mongoose.Types.ObjectId("67449f674fc73c80de04b2a7"), updatedAt: new Date("2025-01-12T17:51:06.412Z"), createdAt: new Date("2025-01-07T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397bc08330f2cda8561bd1"), name: "Delta Desk", description: "Compact work desk", price: 3500000, stock: 19, long_description: "Minimalist work desk with storage.", slug: "delta-desk", categoriesId: new mongoose.Types.ObjectId("673978e6d2067a8cc64f7dee"), rate: 4, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/delta_desk.jpg", brandsId: new mongoose.Types.ObjectId("67449f554fc73c80de04b2a6"), updatedAt: new Date("2025-01-12T17:52:23.365Z"), createdAt: new Date("2025-01-07T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397bc08330f2cda8561bd2"), name: "Orion Chair", description: "Ergonomic chair", price: 4000000, stock: 50, long_description: "Adjustable chair for office use.", slug: "orion-chair", categoriesId: new mongoose.Types.ObjectId("673979c4d2067a8cc64f7df1"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/orion_chair.jpg", brandsId: new mongoose.Types.ObjectId("67449f674fc73c80de04b2a7"), updatedAt: new Date("2025-01-08T14:37:49.610Z"), createdAt: new Date("2025-01-06T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397c238330f2cda8561bd3"), name: "Mason Stool", description: "Wooden bar stool", price: 500000, stock: 25, long_description: "Rustic stool for kitchen counters.", slug: "mason-stool", categoriesId: new mongoose.Types.ObjectId("673979c4d2067a8cc64f7df1"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/mason_stool.jpg", brandsId: new mongoose.Types.ObjectId("67449f554fc73c80de04b2a6"), updatedAt: new Date("2025-01-08T14:37:49.944Z"), createdAt: new Date("2025-01-05T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397c238330f2cda8561bd4"), name: "Luxe Chair", description: "Velvet lounge chair", price: 7000000, stock: 20, long_description: "Comfortable velvet chair for relaxation.", slug: "luxe-chair", categoriesId: new mongoose.Types.ObjectId("673979c4d2067a8cc64f7df1"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/luxe_chair.jpg", brandsId: new mongoose.Types.ObjectId("67449f784fc73c80de04b2a8"), updatedAt: new Date("2025-01-08T14:37:50.319Z"), createdAt: new Date("2025-01-04T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397c238330f2cda8561bd5"), name: "Everest Bed", description: "King-size bed frame", price: 4000000, stock: 10, long_description: "Solid wood bed frame with sleek design.", slug: "everest-bed", categoriesId: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df5"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/everest_bed.jpg", brandsId: new mongoose.Types.ObjectId("67449f8b4fc73c80de04b2a9"), updatedAt: new Date("2025-01-08T14:37:50.652Z"), createdAt: new Date("2025-01-03T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397c238330f2cda8561bd6"), name: "Solo Bed", description: "Compact single bed", price: 12000000, stock: 20, long_description: "Durable single bed for small spaces.", slug: "solo-bed", categoriesId: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df5"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/solo_bed.jpg", brandsId: new mongoose.Types.ObjectId("67449f9e4fc73c80de04b2aa"), updatedAt: new Date("2025-01-08T14:37:50.880Z"), createdAt: new Date("2025-01-03T14:37:48.504Z") },
            { _id: new mongoose.Types.ObjectId("67397c238330f2cda8561bd7"), name: "Loft Bunk", description: "Space-saving bunk bed", price: 18000000, stock: 8, long_description: "Modern bunk bed with sturdy frame.", slug: "loft-bunk", categoriesId: new mongoose.Types.ObjectId("67397ab9d2067a8cc64f7df5"), rate: 0, imagePath: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/loft_bunk.jpg", brandsId: new mongoose.Types.ObjectId("67449f674fc73c80de04b2a7"), updatedAt: new Date("2025-01-08T14:37:51.127Z"), createdAt: new Date("2025-01-02T14:37:48.504Z") }
	];

	// Loop through each product and perform updateOne new
    for (const product of products) {
        await Product.updateOne(
            { _id: product._id }, // Match by _id
            { $set: product }, // Update or insert the product data
            { upsert: true } // If the product doesn't exist, it will be inserted
        );
    }

    console.log("Products seeded successfully!");

    mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding products:", error);
        mongoose.connection.close();
    }
}

seedProducts();