const prisma = require("../prisma");

async function getMessages(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: req.user.id,
          },
          {
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
        id: "desc",
      },
    });

    return res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
      },
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

    const { text, receiverId } = req.body;

    if (!text || !receiverId) {
      return res.status(400).json({
        message: "Text and receiverId are required",
      });
    }

    const message = await prisma.message.create({
      data: {
        text,
        senderId: req.user.id,
        receiverId: Number(receiverId),
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