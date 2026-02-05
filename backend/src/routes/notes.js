const express = require('express');
const { body, param } = require('express-validator');
const notesController = require('../controllers/notesController');
const auth = require('../middleware/auth');

const router = express.Router();

const idValidator = [param('id').isMongoId().withMessage('Invalid note id')];

router.post(
  '/',
  auth(true),
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('content').optional().isString(),
    body('tags').optional().isArray(),
  ],
  notesController.createNote
);

router.get('/', auth(true), notesController.getNotes);

router.get('/:id', auth(true), idValidator, notesController.getNoteById);

router.put(
  '/:id',
  auth(true),
  idValidator,
  [
    body('title').optional().isString().trim().notEmpty(),
    body('content').optional().isString(),
    body('tags').optional().isArray(),
    body('favorite').optional().isBoolean(),
  ],
  notesController.updateNote
);

router.delete('/:id', auth(true), idValidator, notesController.deleteNote);

module.exports = router;

