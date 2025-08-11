
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://yuvarajmuthukumaran:abcabc@cluster0.dptw3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dashboardItems: { type: [String], default: [] }, // Save ingredient names as strings
});

const User = mongoose.model("User", userSchema);

// Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Send user info including dashboardItems and _id as id
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dashboardItems: user.dashboardItems,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get dashboard items for user
app.get("/dashboard-items/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("dashboardItems");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ dashboardItems: user.dashboardItems });
  } catch (err) {
    console.error("Get dashboard items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update dashboard items for user
app.post("/dashboard-items/:userId", async (req, res) => {
  try {
    const { dashboardItems } = req.body;
    if (!Array.isArray(dashboardItems))
      return res.status(400).json({ message: "dashboardItems must be an array" });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { dashboardItems },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Dashboard items updated", dashboardItems: user.dashboardItems });
  } catch (err) {
    console.error("Update dashboard items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
