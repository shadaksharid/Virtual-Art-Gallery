const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const adminRoutes = require("./routes/adminRoutes")
const notificationRoutes = require("./routes/notificationRoutes");
const dotenv = require("dotenv");
const cors = require("cors"); 
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors())

app.use("/api/users", userRoutes);
app.use("/api/artworks", artworkRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to the Virtual Art Gallery API");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
