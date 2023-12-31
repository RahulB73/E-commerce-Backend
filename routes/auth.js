const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    verifyTokenAndAuthorization, verifyToken,
} = require("./varifyToken");

// REGISTRATION

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Varifying USer return true or false
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );

        if (!user) {
            return res.status(401).json("Wrong User Name");
        }

        // Requesting user password + decrypting it using PASS_SEC
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        // Convering the decrypted password to orignal form
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // Requesting for user passward
        const inputPassword = req.body.password;

        // Varifying User Provided Password
        if (!bcrypt.compare(inputPassword, originalPassword)) {
            return res.status(401).json("Wrong Password");
        }


        // Generating JWT Token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "5d" }
        );

        // code is often used when sending user data to a client in a secure manner. It ensures that sensitive information like the user's password is not included in the response  
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }

});

router.post("/check-token", verifyToken, (req, res) => {
     
});


module.exports = router;
