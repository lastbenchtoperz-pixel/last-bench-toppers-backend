const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// --- Controller Functions ---

/**
 * POST /api/auth/register
 * Handles user registration with password hashing
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the raw password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(201).json({
        message: "User Registered Successfully",
        userId: result.insertId
      });
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/auth/login
 * Validates user credentials and returns a JWT token
 */
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const user = result[0];

      // Compare incoming plain password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      // Generate web access token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login Successful",
        token,
        role: user.role,
        name: user.name
      });
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- Module Exports ---
module.exports = {
  registerUser,
  loginUser
};