const User = require("../models/userSchema");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const Secretkey = process.env.SECRETKEY;
const sendotp = async (email, otp) => {
    try {
        let Desc, Sendingtext;
        if (typeof otp == "object") {
            Desc: "Order Confirmation ";
            Sendingtext: `your tracking number for order is ${otp.trackingNumber}`;
        }
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
            debug: true
        });

        return transporter.sendMail({
            from: process.env.Email,
            to: email,
            subject: Desc,
            text: Sendingtext
        }, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log(`otp has been succesfully sended to ${email}`);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const createNewUser = async function (name, email, password, role, phoneNumber) {
    console.log("in  service createUser")
    const userExist = await User.findOne({
        email: email
    });
    if (userExist) {
        return ("No need to signup again , Login with your credentials");
    } else {
        try {
            const newUser = new User({
                name,
                email,
                phoneNumber,
                role,
                password,
            });
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await sendotp(email, otp);

            let result = await newUser.save();
            await User.updateOne({ email }, { otp }, { upsert: true });
            return result;
        } catch (error) {
            console.log(error)
            throw { message: error.message }
        }

    }
}

//
const verifyUserEmail = async function (email) {
    try {
        let result = await User.findOne({ email: email });
        if (!result) throw new Error("Invalid Email!!!!!!!");
        console.log("email is verified");
        return result;
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async function (email, otp) {
    try {
        const user = await User.findOne({ email: email });
        console.log(user, otp);
        if (user.otp != otp) throw new Error("invalid otp");
        await User.findOneAndUpdate(
            { email: user.email },
            { isActive: true }
        );
        console.log("otp is verified and user is now active");
        return user;
    } catch (err) {
        throw err;
    }
};

const login = async function (email, password) {
    try {
        console.log("is ")
        const user = await verifyUserEmail(email);
        if (!user.isActive) throw new Error("User is not active");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid Password");
        const token = jwt.sign({ _id: user._id, isActive: true }, Secretkey, {
            expiresIn: "1d"
        });
        await User.findOneAndUpdate({ _id: user._id, isActive: true }, { token: token });
        return token;
    } catch (error) {
        console.log(error);
        throw { message: error.message }
    }
}

const verifyToken = async (Token) => {
    console.log("In Auth service to verify token ");
    try {
        const token = await jwt.verify(Token, Secretkey);
        console.log(token);
        const user = await User.findOne({ _id: token._id, isActive: true });
        console.log(user.token, Token);
        if (!user) {
            throw new Error("Your account is not activated.");
        } else if (!(user.token == Token)) {
            throw new Error("Access Denied. Please login with credentials to generate a token.");
        }

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


const changePassword = async (user, oldPassword, newPassword) => {

    const password = await bcrypt.compare(oldPassword, user.password);
    if (!password) {
        throw new Error("old password is incorrect ");
    }
    console.log(user.password)
    user.password = newPassword;
    await user.save();
    return "Password changed successfully";
};


module.exports = {
    createNewUser, verifyUserEmail, verifyOtp, login, verifyToken, changePassword, sendotp
};

