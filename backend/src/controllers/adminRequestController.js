const User = require("../models/User");
const nodemailer = require("nodemailer");
const logActivity = require("../utils/logActivity");

// Mail Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Common background handler (DRY)
const handleSideEffects = (user, action, req, emailSubject, emailText) => {
  // Send Email (non-blocking)
  if (user.email) {
    transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: emailSubject,
        text: emailText,
      })
      .catch((err) => console.error("Email failed:", err));
  }

  // Log Activity (non-blocking)
  logActivity({
    user: req.session?.user || "System",
    action,
    module: "Request",
    details: `${action} account request for ${user.email}`,
  }).catch((err) => console.error("Log failed:", err));
};

// Get Pending Requests
const getPendingRequests = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: "pending",
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching requests",
      error: error.message,
    });
  }
};

// Approve Request
const approveRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate actions
    if (user.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    // Update DB
    user.approvalStatus = "accepted";
    user.approvalMessage = "Your account request has been approved";
    await user.save();

    // Immediate response
    res.status(200).json({ message: "Request approved successfully" });

    // Background tasks
    handleSideEffects(
      user,
      "Approved",
      req,
      "Account Approved",
      `Hello ${user.name}, your account request has been approved.`
    );
  } catch (error) {
    res.status(500).json({
      message: "Error approving request",
      error: error.message,
    });
  }
};

// Deny Request
const denyRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate actions
    if (user.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    // Update DB
    user.approvalStatus = "denied";
    user.approvalMessage = "Your account request has been denied";
    await user.save();

    // Immediate response
    res.status(200).json({ message: "Request denied successfully" });

    // Background tasks
    handleSideEffects(
      user,
      "Denied",
      req,
      "Account Request Denied",
      `Hello ${user.name}, your account request has been denied by admin.`
    );
  } catch (error) {
    res.status(500).json({
      message: "Error denying request",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingRequests,
  approveRequest,
  denyRequest,
};