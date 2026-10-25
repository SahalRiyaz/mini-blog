import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  addComment,
} from '../controllers/commentController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /posts - Read posts (Public)
router.get('/', getPosts);

// GET /posts/:id - Read single post (Public)
router.get('/:id', getPostById);

// POST /posts - Create post (Admin only)
router.post('/', requireAuth, requireAdmin, createPost);

// PUT /posts/:id - Update post (Admin only)
router.put('/:id', requireAuth, requireAdmin, updatePost);

// DELETE /posts/:id - Delete post (Admin only)
router.delete('/:id', requireAuth, requireAdmin, deletePost);

// GET /posts/:id/comments - Read comments (Public)
router.get('/:id/comments', getCommentsByPost);

// POST /posts/:id/comments - Add comment (Logged in: reader or admin)
router.post('/:id/comments', requireAuth, addComment);

export default router;
