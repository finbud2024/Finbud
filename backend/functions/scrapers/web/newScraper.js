import dotenv            from 'dotenv';
import path              from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose          from 'mongoose';
import axios             from 'axios';
import * as cheerio      from 'cheerio';
import pLimit            from 'p-limit';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Import data models
import News        from '../../../Database_Schema/social/News.js';
import Source      from '../../../Database_Schema/core/Source.js';
import ScrapedUser from '../../../Database_Schema/market-data/ScrapedUser.js';

// Constants
const MONGO_URI = process.env.MONGO_URI;
const HOST      = 'https://vneconomy.vn';
const SECTIONS  = [
  '', // home
  'tieu-diem.htm',
  'dau-tu.htm',
  'tai-chinh.htm',
  'kinh-te-so.htm',
  'kinh-te-xanh.htm',
  'thi-truong.htm',
  'nhip-cau-doanh-nghiep.htm',
  'dia-oc.htm',
  'kinh-te-the-gioi.htm',
  'dan-sinh.htm',
];
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/137 Safari/537.36';


// Helpers
async function ensureSource() {
  return Source.findOneAndUpdate(
    { name: 'VnEconomy' },
    { name: 'VnEconomy', url: HOST, lastScraped: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
async function ensureAuthor(username = 'VnEconomy') {
  return ScrapedUser.findOneAndUpdate(
    { username },
    { username, source: 'vneconomy', lastScraped: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

// Collect article links
async function collectLinks() {
  const urls = new Set();
  const limiter = pLimit(5);

  await Promise.all(
    SECTIONS.map(slug =>
      limiter(async () => {
        const url = slug ? `${HOST}/${slug}` : HOST;
        const { data } = await axios.get(url, {
          headers: { 'User-Agent': USER_AGENT }, timeout: 15_000,
        });
        const $ = cheerio.load(data);
        $('h3.story__title > a[href$=".htm"]').each((_, a) => {
          const href = $(a).attr('href');
          if (href) urls.add(href.startsWith('http') ? href : HOST + href);
        });
      })
    )
  );
  return [...urls];
}

// Parse one article
async function parseArticle(url, sourceId) {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': USER_AGENT }, timeout: 15_000,
  });
  const $ = cheerio.load(data, { decodeEntities: false });

  /* Title */
  const title = $('h1.detail__title').first().text().trim();
  if (!title) throw new Error('no title');

  /* Description */
  const description =
    $('meta[name="description"]').attr('content') ||
    $('h2.detail__summary').first().text().trim() || '';

  /* Featured image */
  const featuredImage =
    $('meta[property="og:image"]').attr('content') ||
    $('figure.detail__avatar img').attr('src') ||
    '';

  /* Category – from div.category h1 */
  let category =
    $('.category h1.category-main a').first().text().trim() ||
    $('.breadcrumbs a:nth-last-child(2)').text().trim() || '';

  /* Datetime */
  const rawTime =
    $('header.detail__header .detail__meta').text().trim() ||
    $('time').attr('datetime') || '';
  const createdAt = rawTime
    ? new Date(
        rawTime.replace(
          /(\d{2})\/(\d{2})\/(\d{4})/, (_, d, m, y) => `${y}-${m}-${d}`
        )
      )
    : new Date();

  /* Author */
  const authorName =
    $('.detail__author strong, .article-author')
      .first()
      .text()
      .trim() || 'VnEconomy';
  const author = await ensureAuthor(authorName);

  /* Body – convert to plain text */
  const $body = $('.detail__content').clone();

  // remove boxes / adv / script / style / figure etc. (keep <p>)
  $body.find('script, style, figure, .serviceBox09, .adv, iframe').remove();

  const paragraphs = [];
  $body.find('p').each((_, p) => {
    const text = $(p).text().replace(/\s+/g, ' ').trim();
    if (text) paragraphs.push(text);
  });
  const content = paragraphs.join('\n\n');
  if (content.length < 200) throw new Error('content too short');

  /* Tags */
  const tags = [];
  $('.detail__tag a').each((_, a) => {
    const t = $(a).text().trim();
    if (t) tags.push(t);
  });

  return {
    title,
    description,
    content,              
    authorId:     author._id,
    sourceId,
    url,
    category,
    featuredImage,
    createdAt,
    updatedAt:    createdAt,
    tags,
  };
}


export async function scrapeVnEconomy(limitPerRun = 150) {
  console.log('\n🚀  VnEconomy scraper starting…');
  await mongoose.connect(MONGO_URI);
  console.log('✅  Mongo connected');

  // Delete yesterday's news
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  await News.deleteMany({
    createdAt: {
      $gte: yesterday,
      $lt: today
    }
  });
  console.log('🗑️  Deleted yesterday\'s news');

  const source = await ensureSource();
  const links  = await collectLinks();
  console.log(`🔍  Found ${links.length} links (processing max ${limitPerRun})`);

  const limiter = pLimit(8);
  await Promise.all(
    links.slice(0, limitPerRun).map(link =>
      limiter(async () => {
        if (await News.findOne({ url: link })) return; // dedup
        try {
          const doc = await parseArticle(link, source._id);
          await News.create(doc);
          console.log('✓', doc.title);
        } catch (err) {
          console.warn('⤬', link, err.message);
        }
      })
    )
  );

  await mongoose.disconnect();
  console.log('🏁  Scraper finished\n');
}

// CLI entrypoint
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  scrapeVnEconomy().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}
