const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      approvalStatus: "pending",
      approvalMessage: "Waiting for admin approval",
    });

    res.status(201).json({
      message: "Account request submitted successfully. Wait for admin approval.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in registration",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
   if (user.role !== "admin") {
  if (user.approvalStatus === "pending") {
    return res.status(403).json({
      message: "Your account request is still pending admin approval",
    });
  }

  if (user.approvalStatus === "denied") {
    return res.status(403).json({
      message: "Your account request was denied by admin",
    });
  }
}

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in login",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Logout failed",
        });
      }

      res.clearCookie("connect.sid");

      res.status(200).json({
        message: "Logout successful",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in logout",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    res.status(200).json({
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};