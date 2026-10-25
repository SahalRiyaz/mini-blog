import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

let isMongoActive = false;

// In-memory store fallback for instant local testing without MongoDB installed
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

// Initialize seed data for both memory store and MongoDB
export async function initializeSeedData() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const readerPasswordHash = await bcrypt.hash('reader123', 10);

  if (getMongoActive()) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Seed] Database is empty. Seeding initial admin, reader, and posts into MongoDB...');
        
        const admin = await User.create({
          name: 'Admin User',
          email: 'admin@miniblog.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
        });

        const reader = await User.create({
          name: 'Jane Reader',
          email: 'reader@miniblog.com',
          passwordHash: readerPasswordHash,
          role: 'reader',
        });

        const post1 = await Post.create({
          title: 'Welcome to Mini Blog: Getting Started',
          content: `## Welcome to Mini Blog!\n\nThis is a lightweight, responsive blog built with **React**, **Express**, and **Node.js**.\n\n### Key Features:\n- 🔐 **JWT Authentication** with password hashing using bcrypt\n- 👥 **Role-Based Access Control**: Admins create/edit/delete posts, readers comment\n- 📝 **Markdown Support**: Rich formatting with headings, code blocks, lists, and links\n- 🏷️ **Tagging & Instant Search**: Filter content easily\n- 💬 **Discussion Threading**: Real-time reader comments\n\nEnjoy exploring and testing the application!`,
          tags: ['announcement', 'welcome', 'guide'],
          authorId: admin._id,
        });

        const post2 = await Post.create({
          title: 'Mastering Modern Full-Stack Development in 2026',
          content: `Modern web development thrives on clean architectures and fast feedback loops.\n\n### Why Separation of Concerns Matters\nWhen building single-page applications with React and REST APIs:\n1. **Predictable State**: Keep client logic decoupled from data storage.\n2. **Security**: Validate on the server, enforce role-based middleware, and sign JWTs.\n3. **Flexibility**: Switch between databases without rewriting your client views.\n\n\`\`\`javascript\n// Clean JWT auth middleware\nexport function requireAdmin(req, res, next) {\n  if (req.user?.role !== 'admin') {\n    return res.status(403).json({ error: 'Admin access required' });\n  }\n  next();\n}\n\`\`\`\n\nDrop a comment below with your favorite development stack!`,
          tags: ['javascript', 'fullstack', 'architecture'],
          authorId: admin._id,
        });

        await Comment.create({
          postId: post1._id,
          userId: reader._id,
          text: 'Great starting guide! The Markdown preview is super clean.',
        });

        await Comment.create({
          postId: post2._id,
          userId: reader._id,
          text: 'Love the middleware snippet. Concise and secure.',
        });

        console.log('[Seed] MongoDB seeded successfully.');
      }
    } catch (err) {
      console.error('[Seed Error] Failed to seed MongoDB:', err.message);
    }
  } else {
    // Seed in-memory store
    memoryStore.users = [
      {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@miniblog.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_reader',
        name: 'Jane Reader',
        email: 'reader@miniblog.com',
        passwordHash: readerPasswordHash,
        role: 'reader',
        createdAt: new Date().toISOString(),
      },
    ];

    memoryStore.posts = [
      {
        id: 'post_1',
        title: 'Welcome to Mini Blog: Getting Started',
        content: `## Welcome to Mini Blog!\n\nThis is a lightweight, responsive blog built with **React**, **Express**, and **Node.js**.\n\n### Key Features:\n- 🔐 **JWT Authentication** with password hashing using bcrypt\n- 👥 **Role-Based Access Control**: Admins create/edit/delete posts, readers comment\n- 📝 **Markdown Support**: Rich formatting with headings, code blocks, lists, and links\n- 🏷️ **Tagging & Instant Search**: Filter content easily\n- 💬 **Discussion Threading**: Real-time reader comments\n\nEnjoy exploring and testing the application!`,
        tags: ['announcement', 'welcome', 'guide'],
        authorId: 'usr_admin',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'post_2',
        title: 'Mastering Modern Full-Stack Development in 2026',
        content: `Modern web development thrives on clean architectures and fast feedback loops.\n\n### Why Separation of Concerns Matters\nWhen building single-page applications with React and REST APIs:\n1. **Predictable State**: Keep client logic decoupled from data storage.\n2. **Security**: Validate on the server, enforce role-based middleware, and sign JWTs.\n3. **Flexibility**: Switch between databases without rewriting your client views.\n\n\`\`\`javascript\n// Clean JWT auth middleware\nexport function requireAdmin(req, res, next) {\n  if (req.user?.role !== 'admin') {\n    return res.status(403).json({ error: 'Admin access required' });\n  }\n  next();\n}\n\`\`\`\n\nDrop a comment below with your favorite development stack!`,
        tags: ['javascript', 'fullstack', 'architecture'],
        authorId: 'usr_admin',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];

    memoryStore.comments = [
      {
        id: 'cmt_1',
        postId: 'post_1',
        userId: 'usr_reader',
        text: 'Great starting guide! The Markdown preview is super clean.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'cmt_2',
        postId: 'post_2',
        userId: 'usr_reader',
        text: 'Love the middleware snippet. Concise and secure.',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ];

    console.log('[Store] In-memory store initialized with demo admin (admin@miniblog.com / admin123) and reader (reader@miniblog.com / reader123).');
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
