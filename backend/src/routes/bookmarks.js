const express = require('express');
const { body, param } = require('express-validator');
const bookmarksController = require('../controllers/bookmarksController');
const auth = require('../middleware/auth');

const router = express.Router();

const idValidator = [param('id').isMongoId().withMessage('Invalid bookmark id')];

router.post(
  '/',
  auth(true),
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('tags').optional().isArray(),
  ],
  bookmarksController.createBookmark
);

router.get('/', auth(true), bookmarksController.getBookmarks);

router.get('/:id', auth(true), idValidator, bookmarksController.getBookmarkById);

router.put(
  '/:id',
  auth(true),
  idValidator,
  [
    body('url').optional().isURL(),
    body('title').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('tags').optional().isArray(),
    body('favorite').optional().isBoolean(),
  ],
  bookmarksController.updateBookmark
);

router.delete('/:id', auth(true), idValidator, bookmarksController.deleteBookmark);

module.exports = router;

