import jwt from "jsonwebtoken";
export function jwtCheck(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "no token" });
    jwt.verify(token, process.env.JWT_KEY);
    next();
}
//# sourceMappingURL=JwtCheck.js.map