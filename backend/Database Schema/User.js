import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  	accountData:{
		username:{
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true
		},
		priviledge:{
			type:String,
			enum: ['admin', 'user'],
			required: true,
			default: 'user'
		},
		securityQuestion: String,
		securityAnswer: String
  	},
	identityData:{
		firstName: String,
		lastName: String,
		displayName: String,
	}
});

const User = mongoose.model('user', userSchema);
export default User;

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
