const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createSendToken = (user, statusCode, res) => {
  // Include role in the token payload
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "90d",
    }
  );
  console.log("token", token);
  // Create cookie options with proper date calculation
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Cookie cannot be accessed or modified in any way by the browser
    secure: process.env.NODE_ENV === "production",
  };

  // Send cookie
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role in the response
      },
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  // Remove password from output
  newUser.password = undefined;

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Send token
  createSendToken(user, 200, res);
  console.log("token sent");
});

// New middleware to get current user from token
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  let token;

  // Get token from cookie
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from decoded token
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role, // Include role in the response
      },
    },
  });
});
