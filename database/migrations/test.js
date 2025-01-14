const mongoose = require("mongoose");
const { Schema } = mongoose;

async function createCollections() {
    try {
        // Kết nối tới MongoDB
        await mongoose.connect(
            "mongodb+srv://xuandang1707:mongodb@cluster0.nckk8.mongodb.net/web_project_furniro"
        );
        console.log("Connected to MongoDB!");

        // Tạo schema và collection cho Users
        const UsersSchema = new Schema({
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
                default: "https://latarfaitdjumzdjmqxd.supabase.co/storage/v1/object/public/images/avatars/userdefault.png"
            },
            role: { type: String, default: "Customer" },
            isBanned: { type: Boolean, default: false }
        }, { timestamps: true });
        await mongoose.model("Users", UsersSchema).createCollection();
        console.log("Users collection created successfully!");

        // Tạo schema và collection cho Brands
        const BrandsSchema = new Schema({
            _id: { type: Schema.Types.ObjectId },
            name: { type: String, required: true },
        });
        await mongoose.model("Brands", BrandsSchema).createCollection();
        console.log("Brands collection created successfully!");

        // Tạo schema và collection cho Products
        const ProductsSchema = new Schema({
            name: { type: String, required: true, default: "" },
            description: { type: String },
            price: { type: Number, required: true },
            stock: { type: Number, default: 0 },
            long_description: { type: String },
            slug: { type: String },
            categoriesId: { type: Schema.Types.ObjectId, ref: "Categories" },
            rate: { type: Number, default: 0 },
            imagePath: { type: String },
            extraImages: { type: [String], default: [] },
            brandsId: { type: Schema.Types.ObjectId, ref: "Brands" },
        }, { timestamps: true });
        await mongoose.model("Products", ProductsSchema).createCollection();
        console.log("Products collection created successfully!");

        // Tạo schema và collection cho Categories
        const CategoriesSchema = new Schema({
            _id: { type: Schema.Types.ObjectId },
            name: { type: String, required: true },
            desc: { type: String },
        });
        await mongoose.model("Categories", CategoriesSchema).createCollection();
        console.log("Categories collection created successfully!");

        // Tạo schema và collection cho Orders
        const OrdersSchema = new Schema({
            userId: { type: Schema.Types.ObjectId, ref: "Users" },
            total: { type: Number },
            deliveryUnit: { type: String, ref: "DeliveryUnits" },
            paymentMethod: { type: String, ref: "PaymentMethods" },
            status: { type: String, default: "Pending" },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
        });
        await mongoose.model("Orders", OrdersSchema).createCollection();
        console.log("Orders collection created successfully!");

        // Tạo schema và collection cho OrderDetails
        const OrderDetailsSchema = new Schema({
            orderId: { type: Schema.Types.ObjectId, ref: "Orders" },
            productId: { type: Schema.Types.ObjectId, ref: "Products" },
            quantity: { type: Number },
            isReview: { type: Boolean, default: false },
        });
        await mongoose.model("OrderDetails", OrderDetailsSchema).createCollection();
        console.log("OrderDetails collection created successfully!");

        // Tạo schema và collection cho PaymentMethods
        const PaymentMethodsSchema = new Schema({
            _id: { type: Schema.Types.ObjectId },
            Name: { type: String, required: true },
        });
        await mongoose.model("PaymentMethods", PaymentMethodsSchema).createCollection();
        console.log("PaymentMethods collection created successfully!");

        // Tạo schema và collection cho Cart
        const CartSchema = new Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                required: true,
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        }, { timestamps: true });
        await mongoose.model("Cart", CartSchema).createCollection();
        console.log("Cart collection created successfully!");

        // Tạo schema và collection cho DeliveryUnits
        const DeliveryUnitsSchema = new Schema({
            _id: { type: Schema.Types.ObjectId },
            Name: { type: String, required: true },
            Fee: { type: Number, required: true },
        });
        await mongoose.model("DeliveryUnits", DeliveryUnitsSchema).createCollection();
        console.log("DeliveryUnits collection created successfully!");

        // Tạo schema và collection cho Feedbacks
        const FeedbacksSchema = new Schema({
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true,
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            message: { type: String, required: true },
            rating: { type: Number, required: true },
        });
        await mongoose.model("Feedbacks", FeedbacksSchema).createCollection();
        console.log("Feedbacks collection created successfully!");

        // Tạo schema và collection cho PasswordReset
        const PasswordResetSchema = new Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            otp: { type: String },
            createdAt: { type: Date },
            expiresAt: { type: Date },
        });
        await mongoose.model("PasswordReset", PasswordResetSchema).createCollection();
        console.log("PasswordReset collection created successfully!");

        // Tạo schema và collection cho UsersVerification
        const UsersVerificationSchema = new Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            uniqueString: { type: String },
            createdAt: { type: Date },
            expiresAt: { type: Date },
        });
        await mongoose.model("UsersVerification", UsersVerificationSchema).createCollection();
        console.log("UsersVerification collection created successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error creating collections:", error);
        mongoose.connection.close();
    }
}

// Gọi hàm để tạo các collection
createCollections();
