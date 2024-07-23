import mongoose from "mongoose";
import bcrypt from "bcrypt";
SALT_WORK_FACTOR = 10;


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
	}
});


// // Hash password before saving user
// userSchema.pre('save', async function (next) {
// 	console.log('in pre save');
// 	if (!this.isModified('password')) {
// 		return next();
// 	}
// 	try{
// 		const salt = await bcrypt.genSalt(10);
// 		this.password = await bcrypt.hash(this.password, salt);
// 	}catch(err){
// 		console.log('error in hashing password: ', err);
// 		next(err);
// 	}
//   next();
// });

// Method to compare entered password with hashed password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Hash password before saving user
// userSchema.pre('save', async function(next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

// // Method to compare entered password with hashed password
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

const User = mongoose.model('User', userSchema);
export default User;