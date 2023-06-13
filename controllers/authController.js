const NodeCache = require("node-cache");
const authService = require("../services/authService");
const { validateName, validateEmail } = require('../services/validationservice');
const Nodecache = require("node-cache");
const mycache = new NodeCache({ stdTTL: 60 });
exports.createUser = async (req, res) => {
    console.log("in auth controller createUser");
    const {
        name,
        email,
        password,
        role,
        phoneNumber
    } = req.body;

    if (!validateName(name)) {
        return res.status(400).json({ message: "Invalid name" });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }
    try {
        const result = await authService.createNewUser(name, email, password, role, phoneNumber);
        res.status(201).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.verifyEmail = async function (req, res) {
    try {
        const { email, otp } = req.body;
        const user = await authService.verifyUserEmail(email);
        if (user.isActive) {
            return res.status(200).send({ message: "your account is already active no need to verify!! Login via email and password" });
        }
        console.log(user.email);
        await authService.verifyOtp(user.email, otp);
        res.status(200).json({ message: "your account has been Activated succesfully please login with your credentials to get your token" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async function (req, res) {
    try {
        console.log("in controller");
        const { email, password } = req.body;
        console.log(email, password);
        const token = await authService.login(email, password);
        res.status(201).json(token);
    } catch (error) {
        res.status(400).json(error.message);
    };
}
// exports.verifyToken = async function (req, res, next) {
//     try {
//         if (mycache.has(Token)) {
//             console.log("getting it from cached", Token);
//             return res.send(mycache.get(Token));
//         } else {
//             const Token = req.headers.authorization.split(" ")[1];
//             fetch(Token)
//                 .then((response) => response.json())
//                 .then((result) => {
//                     mycache.set(Token, result);
//                     console.log("fetching data again from server ")
//                     res.status(200).send(result)
//                 });

//         }

//         if (!Token)
//             throw new Error({ message: "Access Denied , Token not found , please login with credential to genrate token " });
//         const user = await authService.verifyToken(Token);
//         console.log("user got")
//         req.loggedInUser = user;
//         next();
//     } catch (error) {
//         console.log("error in user post ", error);
//         res.status(400).json({ message: error.message });
//     }
// };


// const fetch = require('node-fetch'); // Import the fetch library if not already imported

exports.verifyToken = async function (req, res, next) {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        let response;
        if (mycache.has("token")) {
            console.log("Getting it from cache token");
            response = mycache.get("token");
            console.log(response);

        } else {

            response = req.headers.authorization.split(" ")[1];
            if (!response)
                throw new Error("Access Denied, Token not found. Please login with credentials to generate a token.");

            console.log(response);
            if (!response)
                throw new Error("Failed to fetch data from server.");

            mycache.set("token", response);
            console.log("getting it from headers");
        }
        const user = await authService.verifyToken(response);
        console.log("User found");
        req.loggedInUser = user;
        next();
    } catch (error) {
        console.log("Error in verifyToken:", error);
        res.status(400).json({ message: error.message });
    }
};

exports.logout = async function (req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        await authService.logout(token);
        res.status(200).json({ message: "user Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.changePassword = async function (req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.loggedInUser;
        if (oldPassword === newPassword) {
            res.status(400).json("old password should not be same as of new password");
        }
        const result = await authService.changePassword(user, oldPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


exports.authorizedUser = (role) => {
    return (req, res, next) => {
        const user = req.loggedInUser;
        console.log(user.role, role);
        if (role == user.role) {
            next();
        } else {
            res.status(403).json({ message: "User not Authorized !" });
        }
    };
};

