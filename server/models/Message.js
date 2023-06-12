import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read", "error"],
    default: "sent",
  },
  conversationId: {
    type: String,
    required: true,
  },
  deletedBy: {
    type: [String],
    enum: ["sender", "recipient"],
    default: [],
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
