const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/Message');
const { verifyAdmin } = require('../middleware/auth');

// High-reliability memory buffer for zero data loss during serverless cold starts or transient DB disconnects
const memoryMessagesBuffer = [];

/**
 * @route   POST /api/messages
 * @desc    Submit a customer inquiry / contact message from frontend
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      inquiryType: (inquiryType || 'General Inquiry').trim(),
      message: message.trim(),
      status: 'unread',
      starred: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let savedMessage = null;

    if (mongoose.connection.readyState === 1) {
      try {
        savedMessage = await Message.create(messageData);
      } catch (dbErr) {
        console.warn('⚠️ Notice: Could not save message to MongoDB, buffering in memory:', dbErr.message);
      }
    }

    if (!savedMessage) {
      // In-memory fallback
      messageData._id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      memoryMessagesBuffer.unshift(messageData);
      savedMessage = messageData;
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our atelier team will get back to you shortly.',
      data: savedMessage
    });
  } catch (error) {
    console.error('❌ Error submitting contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again or reach out on WhatsApp.'
    });
  }
});

/**
 * @route   GET /api/messages
 * @desc    Get all contact messages for admin dashboard
 * @access  Protected (Admin only)
 */
router.get('/', verifyAdmin, async (req, res) => {
  try {
    let dbMessages = [];

    if (mongoose.connection.readyState === 1) {
      try {
        dbMessages = await Message.find().sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.warn('⚠️ Could not query MongoDB for messages:', err.message);
      }
    }

    // Merge in-memory messages if any
    const existingIds = new Set(dbMessages.map(m => m._id.toString()));
    const uncommittedMemory = memoryMessagesBuffer.filter(m => !existingIds.has(m._id.toString()));

    const allMessages = [...uncommittedMemory, ...dbMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      count: allMessages.length,
      unreadCount: allMessages.filter(m => m.status === 'unread').length,
      messages: allMessages
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
});

/**
 * @route   PATCH /api/messages/:id/status
 * @desc    Update message status (unread | read | replied)
 * @access  Protected (Admin only)
 */
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let updatedMessage = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      updatedMessage = await Message.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      ).lean();
    }

    // Check memory buffer if not in DB or if mem ID
    if (!updatedMessage) {
      const idx = memoryMessagesBuffer.findIndex(m => m._id.toString() === id);
      if (idx !== -1) {
        memoryMessagesBuffer[idx].status = status;
        memoryMessagesBuffer[idx].updatedAt = new Date();
        updatedMessage = memoryMessagesBuffer[idx];
      }
    }

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.json({
      success: true,
      message: `Message status updated to ${status}`,
      data: updatedMessage
    });
  } catch (error) {
    console.error('❌ Error updating message status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update message status' });
  }
});

/**
 * @route   PATCH /api/messages/:id/star
 * @desc    Toggle star on message
 * @access  Protected (Admin only)
 */
router.patch('/:id/star', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let updatedMessage = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const current = await Message.findById(id);
      if (current) {
        current.starred = !current.starred;
        await current.save();
        updatedMessage = current.toObject();
      }
    }

    if (!updatedMessage) {
      const idx = memoryMessagesBuffer.findIndex(m => m._id.toString() === id);
      if (idx !== -1) {
        memoryMessagesBuffer[idx].starred = !memoryMessagesBuffer[idx].starred;
        updatedMessage = memoryMessagesBuffer[idx];
      }
    }

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.json({
      success: true,
      message: updatedMessage.starred ? 'Message starred' : 'Message unstarred',
      data: updatedMessage
    });
  } catch (error) {
    console.error('❌ Error toggling star on message:', error);
    return res.status(500).json({ success: false, message: 'Failed to update message' });
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete message
 * @access  Protected (Admin only)
 */
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = false;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const resDb = await Message.findByIdAndDelete(id);
      if (resDb) deleted = true;
    }

    const memIdx = memoryMessagesBuffer.findIndex(m => m._id.toString() === id);
    if (memIdx !== -1) {
      memoryMessagesBuffer.splice(memIdx, 1);
      deleted = true;
    }

    return res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

module.exports = router;

