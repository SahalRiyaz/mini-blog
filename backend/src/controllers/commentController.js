import { commentsRepo, postsRepo } from '../services/dbStore.js';

export async function getCommentsByPost(req, res, next) {
  try {
    const { id } = req.params;

    const post = await postsRepo.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const comments = await commentsRepo.findByPostId(id);
    return res.json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text cannot be empty.' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Comment cannot exceed 1000 characters.' });
    }

    const post = await postsRepo.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const comment = await commentsRepo.create({
      postId: id,
      userId: req.user.id || req.user._id,
      text: text.trim(),
    });

    return res.status(201).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
}
