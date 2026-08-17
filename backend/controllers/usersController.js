const prisma = require("../prisma");

async function getUsers(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.user.id,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        status: true
      },
    });

    return res.status(200).json({
      user: req.user,
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not load users",
    });
  }
}

module.exports = {
    getUsers
}