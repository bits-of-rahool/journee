import jwt from "jsonwebtoken"
const verifyToken = (req, res, next) => {
  
    const accessToken = req.cookies.accessToken|| req.headers.Authorization;

    if (!accessToken) {
      return res.status(403).json({ error: "You need to Login" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY); 
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).redirect("/user/login");
    }
    
}

export default verifyToken;