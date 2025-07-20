import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login to continue.",
      });
    }

    // Verify JWT token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Add user info to request
    req.body.userId = tokenDecode.id;
    req.user = {
      id: tokenDecode.id,
      email: tokenDecode.email || null
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again."
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }
    
    console.error('User auth error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication."
    });
  }
};

export default userAuth;
