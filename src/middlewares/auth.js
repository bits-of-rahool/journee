import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken|| req.headers.Authorization;
    // console.log(accessToken);
    if (!accessToken) {
      return res.status(403).json({ error: "You need to Login" });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    // console.log(decoded)
    req.user = decoded;
    next();
}

export default verifyToken;