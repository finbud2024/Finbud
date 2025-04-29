// recreateAllForums.js
import mongoose from 'mongoose';
import Forum from '../Database Schema/Forum.js'; // adjust path if needed
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

const forumData = [
  {
    _id: '67d28bab5a9c17e61ac5423c',
    name: 'General',
    slug: 'p/general',
    description: 'General financial discussions',
    logo: 'Globe'
  },
  {
    _id: '67d28c4c5a9c17e61ac5423f',
    name: 'Crypto',
    slug: 'p/crypto',
    description: 'Cryptocurrency and blockchain discussions',
    logo: 'Bitcoin'
  },
  {
    _id: '67d28ca75a9c17e61ac54242',
    name: 'Economy',
    slug: 'p/economy',
    description: 'Economy, global markets, and business news',
    logo: 'LineChart'
  },
  {
    _id: '67d28cf25a9c17e61ac54245',
    name: 'Fintech',
    slug: 'p/fintech',
    description: 'Finance technology, startups, and innovations',
    logo: 'CreditCard'
  },
  {
    _id: '67d28d395a9c17e61ac54248',
    name: 'Investing',
    slug: 'p/investing',
    description: 'Stocks, bonds, and investment strategies',
    logo: 'TrendingUp'
  },
  {
    _id: '67d28d795a9c17e61ac5424b',
    name: 'Personal Finance',
    slug: 'p/personal-finance',
    description: 'Budgeting, saving, financial planning',
    logo: 'PiggyBank'
  },
  {
    _id: '67d28db95a9c17e61ac5424e',
    name: 'Real Estate',
    slug: 'p/real-estate',
    description: 'Housing market and real estate investment',
    logo: 'Home'
  },
  {
    _id: '67d28e095a9c17e61ac54251',
    name: 'Career & Money',
    slug: 'p/career-money',
    description: 'Career advice, salary, and negotiation',
    logo: 'Briefcase'
  },
  {
    _id: '67d28e505a9c17e61ac54254',
    name: 'Events',
    slug: 'p/events',
    description: 'Finance-related conferences, meetups, and webinars',
    logo: 'Calendar'
  },
  {
    _id: '67d28e935a9c17e61ac54257',
    name: 'AMA (Ask Me Anything)',
    slug: 'p/ama',
    description: 'AMA sessions with finance experts',
    logo: 'ChatBubble'
  }
];

async function recreateForums() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const forum of forumData) {
    const exists = await Forum.findById(forum._id);
    if (exists) {
      console.log(`✅ Forum '${forum.name}' already exists. Skipping.`);
      continue;
    }

    await new Forum({
      _id: new mongoose.Types.ObjectId(forum._id),
      name: forum.name,
      slug: forum.slug,
      description: forum.description,
      logo: forum.logo,
      posts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }).save();

    console.log(`✅ Created forum '${forum.name}'`);
  }

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
}

recreateForums().catch(err => {
  console.error('❌ Error:', err);
  mongoose.disconnect();
});
