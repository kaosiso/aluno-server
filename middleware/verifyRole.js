const verifyRole = (role) => (req, res, next) => {
  console.log("🔍 Role check:", req.user?.role); // Debug log
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = verifyRole;
