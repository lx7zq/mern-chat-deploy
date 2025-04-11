import mongoose from "mongoose";
import { Schema, model } from "mongoose";

//วิธีแยก Class พิมพ์ใหญ่ Object พิมพ์เล็ก
const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

//สร้างModel
const Message = mongoose.model("Message", messageSchema);
export default Message;
