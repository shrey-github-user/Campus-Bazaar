// backend/middleware/validation.js

// Validate signup data
exports.validateSignup = (req, res, next) => {
  const { name, email, password, university, universityId } = req.body;

  if (!name || !email || !password || !university || !universityId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.(ac\.in|in)$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email must end with .ac.in or .in' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  next();
};

// Validate login data
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }
  next();
};

// Validate note upload
exports.validateNoteUpload = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  next();
};
