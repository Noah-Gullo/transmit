const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function signup(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return res.status(201).json({
      message: "Account created",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not create account",
    });
  }
}

function login(req, res) {
  return res.status(200).json({
    message: "Login successful",
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  });
}

function logout(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logout successful",
      });
    });
  });
}

module.exports = {
  signup,
  login,
  logout,
};