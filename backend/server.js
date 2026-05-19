require("dotenv").config();
const http     = require("http");
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

const feedRoutes    = require("./routes/feed");
const { initSocket } = require("./socket/index");

const app        = express();
const httpServer = http.createServer(app);  // ← shared server for Express + Socket.IO

app.use(cors({ 
  origin: ["http://localhost:3000", "http://192.168.0.118:3000"], // Dono local URLs allow karein
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