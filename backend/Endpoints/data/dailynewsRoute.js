import { Router }  from 'express';
import mongoose    from 'mongoose';
import News        from '../../Database_Schema/social/News.js';

const dailynewsRoute = Router();

// API: get all daily news
dailynewsRoute.get('/', async (req, res, next) => {
  try {
    /* ---------- single article by id ---------------------- */
    if (req.query.id) {
      if (!mongoose.isValidObjectId(req.query.id)) {
        return res.status(400).json({ error: 'Bad id' });
      }
      const doc = await News.findById(req.query.id)
        .populate('sourceId', 'name')
        .lean();
      return doc ? res.json(doc) : res.status(404).json({ error: 'Not found' });
    }

    /* ---------- entire (optionally filtered) list ---------- */
    const filter = {};
    if (req.query.category) filter.category = req.query.category.trim();
    if (req.query.search)   filter.$text    = { $search: req.query.search.trim() };

    const items = await News.find(filter)
      .sort({ createdAt: -1 })
      .select('-content')       // hide heavy field in list
      .populate('sourceId', 'name')
      .lean();

    res.json(items);        // ← no extra meta fields
  } catch (err) { next(err); }
});

export default dailynewsRoute;
