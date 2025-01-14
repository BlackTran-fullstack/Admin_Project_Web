const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Định nghĩa schema cho Users
const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verified: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    country: { type: String },
    address: { type: String },
    city: { type: String },
    phone: { type: String },
    avatar: {
        type: String,
        default:
            "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/avatars/userdefault.png",
    },
    role: { type: String, default: "Customer" },
    isBanned: { type: Boolean, default: false },
}, { timestamps: true });

// Tạo model từ schema
const Users = mongoose.model("Users", userSchema);

async function seedUsers() {
    try {
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connected to MongoDB!");

        const users = [
            {
                email: "testuser1@example.com",
                firstName: "John",
                lastName: "Doe",
                password: "hashed_password_here",
                verified: true,
                country: "Vietnam",
                address: "123 Example Street",
                city: "Hanoi",
                phone: "0123456789",
                role: "Customer",
            },
            {
                email: "testuser2@example.com",
                firstName: "Jane",
                lastName: "Doe",
                password: "hashed_password_here",
                verified: true,
                country: "Vietnam",
                address: "456 Another Street",
                city: "HCM",
                phone: "0987654321",
                role: "Admin",
            },
        ];

        // Cập nhật hoặc thêm dữ liệu vào database
        for (const user of users) {
            await Users.updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true }
            );
        }

        console.log("Users seeded successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding Users:", error);
        mongoose.connection.close();
    }
}

seedUsers();
