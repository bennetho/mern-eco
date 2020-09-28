const Users = require("../models/useModels");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  //--------------------register--------------//
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email: email });
      if (user)
        return res.status(400).json({ msg: "The email already exists " });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password should be at least 6 characters " });

      //password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      //save to mongoDB
      await newUser.save();

      //create jwwebtoken for authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accesstoken });
      //   res.json({ msg: 'Successfully Registered' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // ----------------login---------------//
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // if login success,then create access token refreh
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // ------------------logout-------------//
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //-------------------refresh token---------------//
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });

      // res.json({ rf_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //-----------------get user-----------------//
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = userCtrl;
