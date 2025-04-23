import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  accountData: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    priviledge: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    securityQuestion: String,
    securityAnswer: String,
  },
  identityData: {
    firstName: String,
    lastName: String,
    displayName: String,
    profilePicture: String,
  },
  bankingAccountData: {
    accountBalance: {
      type: Number,
      default: 0,
    },
    stockValue: {
      type: Number,
      default: 0,
    },
    cash: {
      type: Number,
      default: 1000,
    },
  },
  settings: {
    darkMode: { type: Boolean, default: false },
  },
  fincoin_balance: {
    type: Number,
    default: 0,
  },
  bank_accounts: {
    type: [String],
    default: [],
  }
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
  try {
    // Update account balance
    this.bankingAccountData.accountBalance =
      this.bankingAccountData.cash + this.bankingAccountData.stockValue;

    // Only hash password if it exists and has been modified
    if (this.accountData.password && this.isModified('accountData.password')) {
      const salt = await bcryptjs.genSalt(10);
      this.accountData.password = await bcryptjs.hash(this.accountData.password, salt);
    }
    next();
  } catch (err) {
    console.log("error in pre-save middleware:", err);
    next(err);
  }
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    // If no password is set (OAuth user), always return false
    if (!this.accountData.password) {
      return false;
    }
    const match = await bcryptjs.compare(
      enteredPassword,
      this.accountData.password
    );
    return match;
  } catch (err) {
    console.log("error in compare password: ", err);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
