const prisma = require("../prisma");

async function getOwnProfile(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        status: true,
      },
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not load profile",
    });
  }
}

async function getUserProfile(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const userId = Number(req.params.userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not load profile",
    });
  }
}

async function updateProfile(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const { displayName, bio, status } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        displayName,
        bio,
        status,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        status: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not update profile",
    });
  }
}

module.exports = {
  getOwnProfile,
  getUserProfile,
  updateProfile,
};