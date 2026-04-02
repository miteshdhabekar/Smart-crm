const dotenv = require("dotenv");
dotenv.config();

const cors = require('cors');
app.use(cors({
  origin: 'https://trinetra-backend-4u6j.onrender.com' // Your actual Vercel URL
}));

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();