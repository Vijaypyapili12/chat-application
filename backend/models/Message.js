const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  pinned: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Message", messageSchema);