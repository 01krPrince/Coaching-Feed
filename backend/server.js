require("dotenv").config();
const http     = require("http");
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

const feedRoutes    = require("./routes/feed");
const { initSocket } = require("./socket/index");

const app        = express();
const httpServer = http.createServer(app);  // ← shared server for Express + Socket.IO

// 🌟 Dynamic Allowed Origins Setup
const allowedOrigins = [
  "http://localhost:3000", 
  "http://192.168.0.118:3000"
];

// Agar Render par env variable set hai, toh use list mein push karein
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
  // Kuch log slash laga dete hain end mein, isliye safe side bina slash wala bhi add kar dete hain
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ""));
}

app.use(cors({ 
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(express.json());

// Routes
app.use("/feed", feedRoutes);

// Health check
app.get("/", (req, res) => res.send("SYNCUP API running ✅"));

// Init Socket.IO on the same HTTP server
initSocket(httpServer);

// Connect MongoDB → then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });