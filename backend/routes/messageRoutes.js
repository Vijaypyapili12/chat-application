const express = require("express");
const router = express.Router();
const Message = require("../models/Message");


// Send message
router.post("/", async (req, res) => {
  try {
    const message = new Message({
      content: req.body.content
    });

    await message.save();
    res.json(message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete message
router.put("/delete/:id", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, {
      deleted: true
    });

    res.json({ message: "Message deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Pin message
router.put("/pin/:id", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, {
      pinned: true
    });

    res.json({ message: "Message pinned" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;