const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "slr_secret_key";

// ✅ Fixed Admin Credentials
const ADMIN_USER = {
  username: "ajaykhutar",
  password: "ajay1995"
};

// ✅ Admin Login API
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// ✅ Middleware for authentication
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// ✅ Protected route (Admin Data)
app.get("/api/admin/all", authenticate, (req, res) => {
  const db = JSON.parse(fs.readFileSync("db.json", "utf8"));
  res.json(db);
});

// ✅ Start Server (Render ke liye dynamic port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
