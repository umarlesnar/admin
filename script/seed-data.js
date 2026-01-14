// scripts/seed-data.js
const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema({
  provider_id: String,
  auth_type: { type: Number, default: 0 },
  username: String,
  user_type: String,
  display_name: String,
  auth_credentials: Object,
  profile: {
    first_name: String,
    last_name: String,
    email: String,
  },
  email: [
    {
      email_id: String,
      is_primary: Boolean,
      is_verified: Boolean,
    },
  ],
  role: String,
  status: String,
  visibility: String,
  created_at: { type: Date, default: Date.now },
});

const UserAccount = mongoose.model("admin_user_accounts", userAccountSchema);

// Add token generation function
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { last } = require("lodash");

function generatePasswordHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const password_randomword = crypto.randomBytes(8).toString("hex");
  const adminUser = {
    provider_id: "local",
    auth_type: 1,
    username: "admin@kwic.in",
    auth_credentials: {
      password: generatePasswordHash(password_randomword),
      last_password_change: new Date(),
    },
    visibility: "SHOW",
    user_type: "ADMIN",
    display_name: "Administrator",
    profile: {
      first_name: "Admin",
      last_name: "User",
      email: "admin@kwic.in",
    },
    email: [{ email_id: "admin@kwic.in", is_primary: true, is_verified: true }],
    status: "ACTIVE",
    role: "ADMIN",
  };

  await UserAccount.findOneAndUpdate(
    { username: adminUser.username },
    adminUser,
    { upsert: true, new: true }
  );
  console.log("Intial Admin User Created/Updated");
  console.log(
    `Username: ${adminUser.username}, Password: ${password_randomword}`
  );
  console.log("Seed completed");
  process.exit(0);
}

seed().catch(console.error);
