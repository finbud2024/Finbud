import mongoose from "mongoose";
// import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
  	accountData:{
		username:{
			type: String,
			required: true,
			unique: true,
		},
		password:String,
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
		profilePicture: String,
	},
	bankingAccountData:{
		accountBalance:{
			type: Number,
			default: 0
		},
		stockValue:{
			type: Number,
			default: 0
		},
		cash:{
			type: Number,
			default: 1000
		}
	}
});
//NEED TO PRESAVE WITH ACCOUNT BALANCE = STOCK VALUE + CASH

// // Hash password before saving user
// userSchema.pre('save', async function (next) {
// 	if (!this.isModified('password')) {
// 		return next();
// 	}
// 	try{
// 		const salt = await bcrypt.genSalt(10);
// 		this.accountData.password = await bcrypt.hash(this.accountData.password, salt);
// 	}catch(err){
// 		console.log('error in hashing password: ', err);
// 		next(err);
// 	}
//   next();
// });

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try{
	// const match = await bcrypt.compare(enteredPassword, this.accountData.password);
	const match = enteredPassword === this.accountData.password;
	return match;
  }catch(err){
	console.log('error in compare password: ', err);
	return false;
  }
};


const User = mongoose.model('User', userSchema);
export default User;