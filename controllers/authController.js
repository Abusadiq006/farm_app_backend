const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// LOGIN USER
const loginUser = async (req, res) => {
  try{
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    console.log("EMAIL:", email);
    console.log("PASSWORD SENT:", password);

    const user = await User.findOne({ email });
    console.log("FOUND USER:", user);

    if(!user){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("HASHED PASSWORD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if(!isMatch){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  }catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { loginUser }
