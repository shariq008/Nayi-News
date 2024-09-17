const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id }, // Payload: include user ID or other identifying information
      'your_jwt_secret', // Secret key (ensure this is kept private and secure)
      { expiresIn: '1h' } // Optional: token expiration time
    );

    // Return the token and user info
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        // Include other user fields as needed
      },
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = login;
