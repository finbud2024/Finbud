import User from '../Database Schema/User.js';

export default async function createOrFindDummyUser(displayName, profilePicture) {
  const existingUser = await User.findOne({ 'identityData.displayName': displayName });

  if (existingUser) return existingUser._id;

  const newUser = await User.create({
    accountData: {
      username: displayName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      password: 'externaluser',
      priviledge: 'user',
    },
    identityData: {
      displayName,
      profilePicture,
    },
    bankingAccountData: {}, 
    settings: {},
    fincoin_balance: 0,
  });

  return newUser._id;
}
