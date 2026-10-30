"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { constans } = require("../constans/const");

const UserScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        default: constans.userDefaultAvatar.publicId || "default",
      },
      url: {
        type: String,
        default: constans.userDefaultAvatar.url || "",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    chats: [{ type: Schema.ObjectId, ref: "chat" }],
    isTester: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("user", UserScheme);
