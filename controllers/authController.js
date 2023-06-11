const authService = require("../services/authService");

exports.createUser = async function (req, res) {
    try {
        console.log("in auth controller createUSer");
        const {
            name,
            email,
            password,
            role,
            phoneNumber
        } = req.body;
        let result = await authService.createNewUser(name, email, password, role, phoneNumber);
        console.log(result);
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
exports.verifyToken = async function (req, res, next) {
    try {
        const Token = req.headers.authorization.split(" ")[1];
        if (!Token)
            throw new Error({ message: "Access Denied , Token not found , please login with credential to genrate token " });
        const user = await authService.verifyToken(Token);
        console.log("user got")
        req.loggedInUser = user;
        next();
    } catch (error) {
        console.log("error in user post ", error);
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
            res.status(403).json({
                message: "User not Authorized !",
            });
        }
    };
};
