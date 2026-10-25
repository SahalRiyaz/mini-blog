import { postsRepo } from '../services/dbStore.js';

export async function getPosts(req, res, next) {
  try {
    const { search, tag } = req.query;
    const posts = await postsRepo.find({ search, tag });
    return res.json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req, res, next) {
  try {
    const { id } = req.params;
    const post = await postsRepo.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.json({ post });
  } catch (error) {
    next(error);
  }
}

export async function createPost(req, res, next) {
  try {
    const { title, content, tags } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters long.' });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: 'Content must be at least 10 characters long.' });
    }

    // Process tags: array or comma-separated string
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const post = await postsRepo.create({
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags,
      authorId: req.user.id || req.user._id,
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const existing = await postsRepo.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    let parsedTags = undefined;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
      } else if (typeof tags === 'string') {
        parsedTags = tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      }
    }

    const updated = await postsRepo.update(id, {
      title: title !== undefined ? title.trim() : undefined,
      content: content !== undefined ? content.trim() : undefined,
      tags: parsedTags,
    });

    return res.json({
      message: 'Post updated successfully',
      post: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await postsRepo.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    await postsRepo.delete(id);

    return res.json({
      message: 'Post deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
}
