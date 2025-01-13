const Users = require("../models/Users");
const UsersVerification = require("../models/UsersVerification");
const PasswordReset = require("../models/PasswordReset");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const initializePassport = require("../../middlewares/passport");

const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const path = require("path");
const { stat } = require("fs");
const mongoose = require("../../util/mongoose");

const { createClient } = require("@supabase/supabase-js");

// Cấu hình Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// nodemailer stuff
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// testing success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
});

initializePassport(
    passport,
    (email) => {
        return Users.findOne({ email: email });
    },
    (id) => {
        return Users.findById(id);
    }
);

// Gửi email xác minh
const sendVerificationEmail = async (user) => {
    const currentUrl = "http://localhost:3000/";

    const uniqueString = uuidv4() + user._id;

    try {
        // Tạo token xác minh
        const saltRounds = 10;
        const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);

        const newVerification = new UsersVerification({
            userId: user._id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        });
        await newVerification.save();

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
                currentUrl + "verify/" + user._id + "/" + uniqueString
            }>here</a> to process.</p>`,
        };

        console.log(mailOptions.html);

        // Gửi email
        await transporter.sendMail(mailOptions);
        return {
            status: "PENDING",
            message: "Verification email sent",
        };
    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        throw new Error("Failed to send verification email.");
    }
};

const sendOTPVerificationEmail = async (user, res) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        // Xóa OTP cũ trước khi tạo mới
        await PasswordReset.deleteOne({ userId: user._id });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Reset Password OTP",
            html: `<p>Your OTP for resetting your password is <b>${otp}</b><p>This code <b>expires in 1 hour</b></p>.</p>`,
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const newOTPVerification = new PasswordReset({
            userId: user._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error in sendOTPVerificationEmail:", error);
        res.status(500).json({
            success: false,
            errors: ["Failed to send OTP. Please try again later."],
        });
    }
};

class SiteControllers {
    // [GET] /
    home(req, res) {
        res.redirect("/login");
    }

    // [GET] /dashboard
    dashboard(req, res) {
        res.render("dashboard", { showNavbar: true });
    }

    // [GET] /profile
    profile(req, res) {
        res.render("profile", {
            showNavbar: true,
            user: mongooseToObject(req.user),
        });
    }

    // [POST] /profile
    async profilePost(req, res, next) {
        try {
            const userId = req.user.id;

            const { firstName, lastName, address, city, phone, email } =
                req.body;

            const currentUser = await Users.findById(userId);
            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    errors: ["User not found."],
                });
            }

            if (email !== currentUser.email) {
                const existingUser = await Users.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        errors: ["Email already exists."],
                    });
                }
            }

            const data = {
                firstName,
                lastName,
                address,
                city,
                phone,
                email,
            };

            await Users.findByIdAndUpdate(userId, data, { new: true });
            return res.status(200).json({
                success: true,
                message: ["Profile updated successfully."],
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [POST] /profile/update-avatar
    async updateAvatar(req, res) {
        try {
            const userId = req.user.id;
            const file = req.file;

            console.log(file);

            // Kiểm tra xem file có tồn tại hay không
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Tạo tên tệp duy nhất (ví dụ dùng UUID hoặc timestamp)
            const fileName = `${Date.now()}-${file.originalname}`;

            // Upload ảnh lên Supabase
            const { data, error } = await supabase.storage
                .from("images") // Bucket trong Supabase
                .upload(`avatars/${fileName}`, file.buffer, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (error) {
                console.error("Error uploading to Supabase:", error);
                return res.status(500).json({
                    error: "Error uploading avatar",
                    details: error.message,
                });
            }

            // Lấy URL của ảnh đã upload
            const avatarUrl = `${supabaseUrl}/storage/v1/object/public/images/avatars/${fileName}`;

            // Lưu URL vào MongoDB
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Cập nhật avatar mới cho người dùng
            user.avatar = avatarUrl;
            await user.save();

            res.status(200).json({
                message: "Avatar updated successfully",
                avatarUrl,
            });
        } catch (error) {
            console.error("Error updating avatar:", error);
            res.status(500).json({
                error: "Internal Server Error",
                details: error.message,
            });
        }
    }

    // [GET] /login
    login(req, res) {
        res.render("login", { showNavbar: false });
    }

    // [POST] /login
    loginUser(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: [info.message],
                });
            }

            if (user.isBanned) {
                return res.status(400).json({
                    success: false,
                    errors: ["Account has been banned."],
                });
            }

            if (user.role === "Customer") {
                return res.status(400).json({
                    success: false,
                    errors: ["Customers cannot log in to the admin page."],
                });
            }

            if (!user.verified) {
                return res.status(400).json({
                    success: false,
                    errors: ["Please verify your email address."],
                });
            }

            // Đăng nhập người dùng
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    success: true,
                    message: "Login successful.",
                });
            });
        })(req, res, next);
    }

    // [GET] /register
    register(req, res) {
        res.render("register", {
            showNavbar: false,
            error: req.flash("error"),
        });
    }

    // [POST] /register
    async registerUser(req, res) {
        try {
            const { email, password } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email already exists."],
                });
            }

            // Mã hóa mật khẩu và lưu người dùng mới
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new Users({
                ...req.body,
                password: hashedPassword,
                verified: false,
                role: "Admin",
            });

            await user.save();

            // Gửi email xác minh
            sendVerificationEmail(user);

            res.status(200).json({
                success: true,
                message: "Registration successful.",
            });
        } catch (error) {
            console.error("Error in registerUser:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /verify/:userId/:uniqueString
    verifyEmail(req, res) {
        const { userId, uniqueString } = req.params;

        UsersVerification.find({ userId })
            .then((result) => {
                if (result.length > 0) {
                    // user verification record exists so we proceed

                    const { expiresAt } = result[0];
                    const hashedUniqueString = result[0].uniqueString;

                    console.log(userId);
                    console.log(uniqueString);

                    console.log(hashedUniqueString);

                    console.log(
                        bcrypt.compare(uniqueString, hashedUniqueString)
                    );

                    // checking for expired unique string
                    if (expiresAt < Date.now()) {
                        // record has expired so we delete it
                        UsersVerification.deleteOne({ userId })
                            .then((result) => {
                                Users.deleteOne({ _id: userId })
                                    .then(() => {
                                        const message =
                                            "Link has expired. Please sign up again.";
                                        res.redirect(
                                            `/verified/error=true&message=${message}`
                                        );
                                    })
                                    .catch((error) => {
                                        const message =
                                            "Clearing user width expired unique string failed.";
                                        res.redirect(
                                            `/verified/error=true&message=${message}`
                                        );
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                                const message =
                                    "An error occurred while clearing expired user verification record.";
                                res.redirect(
                                    `/verified/error=true&message=${message}`
                                );
                            });
                    } else {
                        // valid record exists so we validate the user string
                        // first compare the hashed unique string
                        bcrypt
                            .compare(uniqueString, hashedUniqueString)
                            .then((result) => {
                                if (result) {
                                    // strings match

                                    Users.updateOne(
                                        { _id: userId },
                                        { verified: true }
                                    )
                                        .then(() => {
                                            UsersVerification.deleteOne({
                                                userId,
                                            })
                                                .then(() => {
                                                    res.sendFile(
                                                        path.join(
                                                            __dirname,
                                                            "./../../resources/views/verified.html"
                                                        )
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                    const message =
                                                        "An error occurred while finalizing successful verification.";
                                                    res.redirect(
                                                        `/verified/error=true&message=${message}`
                                                    );
                                                });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            const message =
                                                "An error occurred while updating user record to show verified.";
                                            res.redirect(
                                                `/verified/error=true&message=${message}`
                                            );
                                        });
                                } else {
                                    // existing record but incorrect verification details passed.
                                    const message =
                                        "Invalid verification details passed. Check your inbox.";
                                    res.redirect(
                                        `/verified/error=true&message=${message}`
                                    );
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                const message =
                                    "An error occurred while comparing unique strings.";
                                res.redirect(
                                    `/verified/error=true&message=${message}`
                                );
                            });
                    }
                } else {
                    // user verification record doesn't exist
                    const message =
                        "Account record doesn't exist or has been verified already. Please sign up or log in.";
                    res.redirect(`/verified/error=true&message=${message}`);
                }
            })
            .catch((error) => {
                console.log(error);
                const message =
                    "An error occurred while checking for existing user verification record";
                res.redirect(`/verified/error=true&message=${message}`);
            });
    }

    // [GET] /verified
    verified(req, res) {
        res.sendFile(
            path.join(__dirname, "./../../resources/views/verified.html")
        );
    }

    // [GET] /forgot-password
    forgotPassword(req, res) {
        res.render("forgotPassword", { error: req.flash("error") });
    }

    // [POST] /forgot-password
    async forgotPasswordPost(req, res) {
        const { email } = req.body;

        try {
            const user = await Users.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email does not exist."],
                });
            }

            if (user.googleId) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email associated with Google account."],
                });
            }

            if (!user.verified) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email not verified."],
                });
            }

            await sendOTPVerificationEmail(user, res);

            res.status(200).json({
                success: true,
                message: "OTP sent to email.",
                userId: user._id,
            });
        } catch (error) {
            console.error("Error in forgotPasswordPost:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /reset-code
    resetCode(req, res) {
        res.render("resetCode", { error: req.flash("error") });
    }

    // [POST] /reset-code
    async resetCodePost(req, res) {
        const { userId, otp } = req.body;

        if (
            !userId ||
            typeof userId !== "string" ||
            !otp ||
            typeof otp !== "string"
        ) {
            return res.status(400).json({
                success: false,
                errors: ["Invalid input. Please check your data."],
            });
        }

        try {
            const user = await PasswordReset.findOne({ userId });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: ["User not found."],
                });
            }

            const { expiresAt, otp: hashedOTP } = user;

            if (expiresAt < Date.now()) {
                await PasswordReset.deleteOne({ userId });
                return res.status(400).json({
                    success: false,
                    errors: ["OTP has expired. Please request a new one."],
                });
            }

            const validOTP = await bcrypt.compare(otp, hashedOTP);

            if (!validOTP) {
                return res.status(400).json({
                    success: false,
                    errors: ["Invalid OTP. Please try again."],
                });
            }

            await PasswordReset.deleteOne({ userId });

            res.status(200).json({
                success: true,
                message: "OTP verified successfully.",
                userId: userId,
            });
        } catch (error) {
            console.error("Error in resetCodePost:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /new-password
    newPassword(req, res) {
        res.render("newPassword", { error: req.flash("error") });
    }

    // [POST] /new-password
    async newPasswordPost(req, res) {
        const { userId, password } = req.body;

        try {
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: ["User not found."],
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.updateOne({ password: hashedPassword }).then(() => {
                res.status(200).json({
                    success: true,
                    message: "Password updated successfully.",
                });
            });
        } catch (error) {
            console.error("Error in newPasswordPost:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // Middleware: Kiểm tra đã đăng nhập
    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect("/login");
    }

    // Middleware: Kiểm tra chưa đăng nhập
    checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect("/dashboard");
        }
        next();
    }

    // [POST] /logout
    logout(req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.status(200).json({ message: "Logged out successfully" });
        });
    }
}

module.exports = new SiteControllers();
