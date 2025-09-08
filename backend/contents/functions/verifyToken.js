const jwt = require('jsonwebtoken')
// const SECRET_KEY="FUCKING_SECRET_KEY";
SECRET_KEY="9uJ2$Lm8!vP4qR#d7yWz!2n73tn730t34m80t3t0-m340-4rvc8r-2382n0r2F*"


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports={
    SECRET_KEY,
    verifyToken
}