import mongoose from 'mongoose';

/**
 * Schemas
 */
export const roleSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  roleName: { type: String, required: true },
  roleId: { type: String, required: true },
  rawPosition: Number,
  userNum: Number,
  desc: String
});

export const commandSchema = new mongoose.Schema({
  prefix: { type: String, required: true},
  amountCalled: Number
});
