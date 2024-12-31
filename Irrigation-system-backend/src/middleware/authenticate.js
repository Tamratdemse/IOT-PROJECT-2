const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "abcdefgh");
    req.user = decoded; // Attach decoded user info to the request

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
