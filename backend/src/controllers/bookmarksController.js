const { validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');
const Bookmark = require('../models/Bookmark');

function handleValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors.array();
    throw err;
  }
}

async function fetchTitleFromUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);
    const title = $('title').first().text().trim();
    return title || null;
  } catch (err) {
    console.warn('Failed to fetch title for URL:', url, err.message);
    return null;
  }
}

exports.createBookmark = async (req, res, next) => {
  try {
    handleValidation(req);
    let { url, title, description, tags } = req.body;

    if (!title || !title.trim()) {
      const fetchedTitle = await fetchTitleFromUrl(url);
      if (fetchedTitle) {
        title = fetchedTitle;
      }
    }

    const bookmark = await Bookmark.create({
      url,
      title,
      description,
      tags: (tags || []).map((t) => t.toLowerCase()),
      user: req.user?.id || null,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const { q, tags } = req.query;

    const filter = {};

    if (req.user?.id) {
      filter.user = req.user.id;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { url: regex }];
    }

    if (tags) {
      const tagList = String(tags)
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      if (tagList.length > 0) {
        filter.tags = { $all: tagList };
      }
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
};

exports.getBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    if (req.user?.id && bookmark.user && bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.updateBookmark = async (req, res, next) => {
  try {
    handleValidation(req);
    const { url, title, description, tags, favorite } = req.body;

    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    if (req.user?.id && bookmark.user && bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (url !== undefined) bookmark.url = url;
    if (title !== undefined) bookmark.title = title;
    if (description !== undefined) bookmark.description = description;
    if (tags !== undefined) {
      bookmark.tags = (tags || []).map((t) => t.toLowerCase());
    }
    if (favorite !== undefined) bookmark.favorite = !!favorite;

    await bookmark.save();

    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    if (req.user?.id && bookmark.user && bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await bookmark.deleteOne();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

