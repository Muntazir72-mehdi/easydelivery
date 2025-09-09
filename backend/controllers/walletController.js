const Wallet = require('../models/Wallet');

// Get wallet for current user
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      // Create wallet if not exists
      wallet = new Wallet({ user: userId });
      await wallet.save();
    }
    res.json(wallet);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error fetching wallet' });
  }
};

// Add transaction and update wallet balance and reward points
exports.addTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, amount, description, deliveryRequestId } = req.body;

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = new Wallet({ user: userId });
    }

    if (type === 'debit' && wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update balance
    wallet.balance = type === 'credit' ? wallet.balance + amount : wallet.balance - amount;

    // Update reward points for credit transactions (e.g., 1 point per $10)
    if (type === 'credit') {
      wallet.rewardPoints += Math.floor(amount / 10);
    }

    // Add transaction record
    wallet.transactions.push({
      type,
      amount,
      description,
      deliveryRequest: deliveryRequestId
    });

    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error adding transaction' });
  }
};
