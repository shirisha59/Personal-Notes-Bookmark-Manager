const { validationResult } = require('express-validator');
const Note = require('../models/Note');

function handleValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors.array();
    throw err;
  }
}

exports.createNote = async (req, res, next) => {
  try {
    handleValidation(req);
    const { title, content, tags } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: (tags || []).map((t) => t.toLowerCase()),
      user: req.user?.id || null,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const { q, tags } = req.query;

    const filter = {};

    if (req.user?.id) {
      filter.user = req.user.id;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { content: regex }];
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

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (req.user?.id && note.user && note.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    handleValidation(req);
    const { title, content, tags, favorite } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (req.user?.id && note.user && note.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) {
      note.tags = (tags || []).map((t) => t.toLowerCase());
    }
    if (favorite !== undefined) note.favorite = !!favorite;

    await note.save();

    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (req.user?.id && note.user && note.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await note.deleteOne();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

