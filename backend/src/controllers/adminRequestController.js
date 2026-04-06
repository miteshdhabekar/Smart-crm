const User = require("../models/User");
const nodemailer = require("nodemailer");
const logActivity = require("../utils/logActivity");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const getPendingRequests = async (req, res) => {
  try {
    const users = await User.find({ approvalStatus: "pending", role: "user" })
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

const approveRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Update Database First
    user.approvalStatus = "accepted";
    user.approvalMessage = "Your account request has been approved";
    await user.save();

    // 2. Respond to Admin immediately (Better UX)
    res.status(200).json({ message: "Request approved successfully" });

    // 3. Handle Side Effects (Email & Logs) in background
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Account Approved",
        text: `Hello ${user.name}, your account request has been approved.`,
      });

      await logActivity({
        user: req.session.user,
        action: "Approved",
        module: "Request",
        details: `Approved account request for ${user.email}`,
      });
    } catch (sideEffectError) {
      console.error("Email or Log failed:", sideEffectError);
      // We don't res.status(500) here because the DB update was already successful
    }

  } catch (error) {
    res.status(500).json({
      message: "Error approving request",
      error: error.message,
    });
  }
};

const denyRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.approvalStatus = "denied";
    user.approvalMessage = "Your account request has been denied";
    await user.save();

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Account Request Denied",
      text: `Hello ${user.name}, your account request has been denied by admin.`,
    });

    res.status(200).json({
      message: "Request denied successfully",
    });
    await logActivity({
      user: req.session.user,
      action: "Denied",
      module: "Request",
      details: `Denied account request for ${user.email}`,
    });
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