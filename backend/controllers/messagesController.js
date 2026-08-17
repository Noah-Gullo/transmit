const prisma = require("../prisma");

async function getMessages(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const otherUserId = Number(req.params.userId);

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: req.user.id,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: req.user.id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
      },
      otherUser,
      messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not load messages",
    });
  }
}

async function sendMessage(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const receiverId = Number(req.params.userId);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message text is required",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId: req.user.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not send message",
    });
  }
}

module.exports = {
  getMessages,
  sendMessage,
};