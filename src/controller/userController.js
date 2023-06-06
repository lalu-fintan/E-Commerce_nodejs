const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const genreateRefreshToken = require("../config/refreshToken");

//register user
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    const newUser = await userModel.create({
      firstname,
      lastname,
      email,
      mobile,
      password,
    });
    res.status(200).json(newUser);
  } else {
    throw new Error("user already exist");
  }
});

//login user

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  // if (user && (await bcrypt.compare(password, user.password))) {
  //second method
  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = await genreateRefreshToken(user.id);

    const updateUser = await userModel.findByIdAndUpdate(
      user.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    const validUser = jwt.sign(
      {
        id: req.params.id,
        email: user.email,
        password: user.password,
        role: user.role,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "login successfull",
      data: user,
      token: validUser,
    });
  } else {
    throw new Error("email or password is invalid");
  }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("you don't have a refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    throw new Error("this refresh token doesn't matched in the db ");
  } else {
    jwt.verify(refreshToken, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err || decoded.id !== user.id) {
        throw new Error("something wrong in refresh token");
      } else {
        const accessToken = jwt.sign(
          {
            id: req.params.id,
            email: user.email,
            password: user.password,
            role: user.role,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "1d" }
        );
        res.status(200).json({ accessToken });
      }
    });
  }
});

//logout user

const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("you don't have a refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(403); //forbitten
  }
  await userModel.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.status(200).json({ message: "logout successfully" }); //forbitten
});

//get all user

const getAllUser = asyncHandler(async (req, res) => {
  const user = await userModel.find();
  res.status(200).json(user);
});

const userGetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: "no users found" });
  }
});
const userUpdateById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (user) {
    const update = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(update);
  } else {
    res.status(400).json({ message: "no users found" });
  }
});

const userDeleteById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (user) {
    const deleteUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: "user has been deleted" });
  } else {
    res.status(400).json({ message: "no users found" });
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const block = await userModel.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  res.status(200).json({ message: "user blocked" });
});
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const unBlock = await userModel.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  res.status(200).json({ message: "user unblocked" });
});

module.exports = {
  register,
  login,
  getAllUser,
  userGetById,
  userUpdateById,
  userDeleteById,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
};
