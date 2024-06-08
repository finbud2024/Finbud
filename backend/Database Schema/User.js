import mongoose from "mongoose";
import {ThreadSchema} from "./Thread";

const userSchema = new mongoose.Schema({
  	accountData:{
		username:String,
		password: String,
		// securityQuestion: String,
		// securityAnswer: String
  	},
	identityData:{//expand later
		displayName: String,
	}
});

// Hash password before saving user
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const user = mongoose.model('user', userSchema);

export default user;
