import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

let isMongoActive = false;

// Real in-memory store (starts with zero fake posts and zero fake comments)
const memoryStore = {
  users: [],
  posts: [],
  comments: [],
};

export function setMongoActive(status) {
  isMongoActive = status;
}

export function getMongoActive() {
  return isMongoActive && mongoose.connection.readyState === 1;
}

// Helper to generate IDs for memory store
function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Initialize seed data (Only sets up the initial account so users can sign in immediately; NO fake posts)
export async function initializeSeedData() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const readerPasswordHash = await bcrypt.hash('reader123', 10);

  if (getMongoActive()) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Seed] Setting up initial curator account...');
        await User.create({
          name: 'Curator',
          email: 'admin@miniblog.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
        });

        await User.create({
          name: 'Reader',
          email: 'reader@miniblog.com',
          passwordHash: readerPasswordHash,
          role: 'reader',
        });
      }
      // Zero fake posts or comments created in database!
    } catch (err) {
      console.error('[Seed Error] Database check failed:', err.message);
    }
  } else {
    // In-memory store (Only base user accounts for login, zero fake posts)
    memoryStore.users = [
      {
        id: 'usr_curator',
        name: 'Curator',
        email: 'admin@miniblog.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_reader',
        name: 'Reader',
        email: 'reader@miniblog.com',
        passwordHash: readerPasswordHash,
        role: 'reader',
        createdAt: new Date().toISOString(),
      },
    ];

    // Completely empty: zero fake posts, zero fake comments
    memoryStore.posts = [];
    memoryStore.comments = [];

    console.log('[Store] Journal store ready. No fake articles present. All articles must be written by real people.');
  }
}

// ----------------- Users Service -----------------
export const usersRepo = {
  async findByEmail(email) {
    if (getMongoActive()) {
      return await User.findOne({ email: email.toLowerCase().trim() });
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async findById(id) {
    if (getMongoActive()) {
      return await User.findById(id).select('-passwordHash');
    }
    const user = memoryStore.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async count() {
    if (getMongoActive()) {
      return await User.countDocuments();
    }
    return memoryStore.users.length;
  },

  async create({ name, email, passwordHash, role }) {
    if (getMongoActive()) {
      return await User.create({ name, email, passwordHash, role });
    }
    const newUser = {
      id: generateId(),
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'reader',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },
};

// ----------------- Posts Service -----------------
export const postsRepo = {
  async find({ search, tag }) {
    if (getMongoActive()) {
      const query = {};
      if (tag) {
        query.tags = tag.toLowerCase();
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }
      return await Post.find(query).sort({ createdAt: -1 }).populate('authorId', 'name email role');
    }

    let results = [...memoryStore.posts];

    if (tag) {
      const tagLower = tag.toLowerCase();
      results = results.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === tagLower));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower)
      );
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Populate author
    return results.map((post) => {
      const author = memoryStore.users.find((u) => u.id === post.authorId);
      return {
        ...post,
        author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
      };
    });
  },

  async findById(id) {
    if (getMongoActive()) {
      return await Post.findById(id).populate('authorId', 'name email role');
    }

    const post = memoryStore.posts.find((p) => p.id === id);
    if (!post) return null;

    const author = memoryStore.users.find((u) => u.id === post.authorId);
    return {
      ...post,
      author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
    };
  },

  async create({ title, content, tags, authorId }) {
    if (getMongoActive()) {
      const post = await Post.create({ title, content, tags, authorId });
      return await Post.findById(post._id).populate('authorId', 'name email role');
    }

    const newPost = {
      id: generateId(),
      title,
      content,
      tags: tags || [],
      authorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.posts.unshift(newPost);

    const author = memoryStore.users.find((u) => u.id === authorId);
    return {
      ...newPost,
      author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
    };
  },

  async update(id, { title, content, tags }) {
    if (getMongoActive()) {
      return await Post.findByIdAndUpdate(
        id,
        { title, content, tags, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('authorId', 'name email role');
    }

    const index = memoryStore.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    memoryStore.posts[index] = {
      ...memoryStore.posts[index],
      title: title ?? memoryStore.posts[index].title,
      content: content ?? memoryStore.posts[index].content,
      tags: tags ?? memoryStore.posts[index].tags,
      updatedAt: new Date().toISOString(),
    };

    const post = memoryStore.posts[index];
    const author = memoryStore.users.find((u) => u.id === post.authorId);
    return {
      ...post,
      author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
    };
  },

  async delete(id) {
    if (getMongoActive()) {
      const deleted = await Post.findByIdAndDelete(id);
      if (deleted) {
        await Comment.deleteMany({ postId: id });
      }
      return deleted;
    }

    const index = memoryStore.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const removed = memoryStore.posts.splice(index, 1)[0];
    memoryStore.comments = memoryStore.comments.filter((c) => c.postId !== id);
    return removed;
  },
};

// ----------------- Comments Service -----------------
export const commentsRepo = {
  async findByPostId(postId) {
    if (getMongoActive()) {
      return await Comment.find({ postId }).sort({ createdAt: -1 }).populate('userId', 'name role');
    }

    const comments = memoryStore.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return comments.map((comment) => {
      const user = memoryStore.users.find((u) => u.id === comment.userId);
      return {
        ...comment,
        user: user ? { id: user.id, name: user.name, role: user.role } : null,
      };
    });
  },

  async count() {
    if (getMongoActive()) {
      return await Comment.countDocuments();
    }
    return memoryStore.comments.length;
  },

  async create({ postId, userId, text }) {
    if (getMongoActive()) {
      const comment = await Comment.create({ postId, userId, text });
      return await Comment.findById(comment._id).populate('userId', 'name role');
    }

    const newComment = {
      id: generateId(),
      postId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    };
    memoryStore.comments.unshift(newComment);

    const user = memoryStore.users.find((u) => u.id === userId);
    return {
      ...newComment,
      user: user ? { id: user.id, name: user.name, role: user.role } : null,
    };
  },
};
