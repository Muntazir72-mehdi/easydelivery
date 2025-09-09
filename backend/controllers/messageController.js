const Message = require('../models/Message');

// Common message templates
const commonMessages = {
  greeting: [
    "Hello! How can I help you with your delivery today?",
    "Hi there! I'm here to assist with your delivery needs.",
    "Welcome! What can I do for you regarding your package?"
  ],
  status: [
    "I'd like to check the status of my delivery.",
    "Can you update me on my package's current location?",
    "When will my delivery arrive?"
  ],
  payment: [
    "I need help with payment for my delivery.",
    "How do I pay for the delivery service?",
    "Can you provide payment options?"
  ],
  support: [
    "I need help with my delivery.",
    "I'm having an issue with my package.",
    "Can you assist me with a delivery problem?"
  ]
};

// Generate instant reply based on user message
const generateInstantReply = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return commonMessages.greeting[Math.floor(Math.random() * commonMessages.greeting.length)];
  }

  if (message.includes('status') || message.includes('where') || message.includes('location') || message.includes('track')) {
    return "Your package is currently in transit. You can track it in real-time using our delivery tracking feature. Estimated delivery time is within 2-3 business days.";
  }

  if (message.includes('payment') || message.includes('pay') || message.includes('cost') || message.includes('price')) {
    return "We accept various payment methods including credit cards, debit cards, and digital wallets. Payment is processed securely and you can add funds to your wallet anytime.";
  }

  if (message.includes('help') || message.includes('problem') || message.includes('issue') || message.includes('support')) {
    return "I'm here to help! Please provide more details about your issue, and I'll assist you right away. You can also contact our support team at support@easydelivery.com.";
  }

  if (message.includes('cancel') || message.includes('refund')) {
    return "For cancellation requests or refunds, please provide your delivery ID. We'll process your request within 24 hours and provide a full refund if eligible.";
  }

  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! We're glad to help. If you need anything else, feel free to ask.";
  }

  // Default response
  return "Thank you for your message. Our team will get back to you shortly. For immediate assistance, you can check our FAQ section or contact support.";
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, deliveryRequestId, content } = req.body;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      deliveryRequest: deliveryRequestId,
      content
    });

    const savedMessage = await newMessage.save();
    await savedMessage.populate('sender', 'name');
    await savedMessage.populate('receiver', 'name');

    // Generate instant reply if this is a user message to support
    if (receiverId === 'support' || receiverId === 'admin') {
      const instantReply = generateInstantReply(content);

      const replyMessage = new Message({
        sender: 'system', // System-generated reply
        receiver: senderId,
        deliveryRequest: deliveryRequestId,
        content: instantReply,
        isRead: false
      });

      const savedReply = await replyMessage.save();
      await savedReply.populate('sender', 'name');
      await savedReply.populate('receiver', 'name');

      // Return both messages
      res.status(201).json({
        userMessage: savedMessage,
        instantReply: savedReply
      });
    } else {
      res.status(201).json(savedMessage);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error sending message' });
  }
};

// Get messages for current user
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.query;

    let query = {
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    };

    if (otherUserId) {
      query = {
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId }
        ]
      };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('deliveryRequest', 'title')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// Get message threads/conversations
exports.getMessageThreads = async (req, res) => {
  try {
    const userId = req.user._id;

    const threads = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$receiver',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', userId] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          otherUser: { name: 1, email: 1 },
          lastMessage: 1,
          unreadCount: 1
        }
      }
    ]);

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching message threads' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.body;

    await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error marking messages as read' });
  }
};

// Get common message templates
exports.getCommonMessages = async (req, res) => {
  try {
    res.json({
      greeting: commonMessages.greeting,
      status: commonMessages.status,
      payment: commonMessages.payment,
      support: commonMessages.support
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching common messages' });
  }
};
