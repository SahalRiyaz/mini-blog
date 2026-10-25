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

// Rich essays on art and aesthetic criticism
const seedArticles = [
  {
    id: 'art_post_1',
    title: 'The Quiet Geometry of Light: Vermeer and the Poetics of Interior Space',
    content: `## The Solitude of the Dutch Interior\n\nIn the quiet studios of seventeenth-century Delft, **Johannes Vermeer** achieved something singular in Western painting: the elevation of the quiet, domestic moment into a sacred encounter with light.\n\nUnlike the dramatic theatricality of Italian Baroque or the bustling crowds of his contemporary Jan Steen, Vermeer composed scenes of radical stillness. A woman pouring milk from an earthenware jug, a young girl turning her head draped in an oriental turban, an astronomer contemplating a celestial globe—each figure is suspended in a timeless amber of illumination.\n\n### The Optical Mastery of Pigment\n\nVermeer’s handling of lapis lazuli—the rare and extraordinarily costly ultramarine pigment mined in Afghanistan—gives his shadows an extraordinary luminescence. Where lesser painters used muddy umbers, Vermeer infused his cool north light with crystalline blues:\n\n> "Color in Vermeer does not merely describe surface; it measures the emotional distance between silence and contemplation."\n\n### The Camera Obscura and Soft Focus\n\nArt historians continue to debate Vermeer's use of early optical instruments like the *camera obscura*. Notice the diffuse discs of confusion (*pointillés*) dancing across the crust of the bread in *The Milkmaid* or the lion-head finials of the chairs. These are not defects of sight, but the painter's deliberate translation of how the human eye experiences peripheral radiance.\n\nIn a world dominated by noise and velocity, returning to Vermeer reminds us that art's greatest power often lies in stillness.`,
    tags: ['painting', 'baroque', 'vermeer', 'light'],
  },
  {
    id: 'art_post_2',
    title: 'From Pigment to Poetry: How Impressionism Redefined Color and Time',
    content: `## The Revolution of Plein-Air Painting\n\nIn the spring of 1874, an artist collective calling themselves the *Société Anonyme des Artistes Peintres, Sculpteurs, Graveurs* staged a rogue exhibition in Paris at Nadar’s photography studio. Among the works was Claude Monet’s *Impression, Sunrise*, depicting the misty harbor of Le Havre in rapid strokes of lavender, vermilion, and slate.\n\nCritics mocked the canvas as unfinished wallpaper. Yet this rebellion marked the birth of **Impressionism**, fracturing centuries of academic dogma in favor of sensory immediacy.\n\n### Breaking the Mold: The Portable Paint Tube\n\nTechnological breakthroughs often catalyze artistic revolutions. In 1841, American painter John Goffe Rand patented the collapsible tin paint tube, emancipating artists from studio mortars and pestles. For the first time, painters could carry vibrant synthetic pigments—viridian, cobalt violet, and cadmium yellow—out into the open countryside (*en plein air*).\n\n### The Relativity of Vision\n\nConsider Monet's relentless series work on the facade of **Rouen Cathedral**, painted across changing seasons and hours of the day:\n\n- **Early Morning**: Cool blues and chalky grays as the stone awakens.\n- **Midday Sun**: Blinding ochres and bleached golds dissolving the stone gothic tracery.\n- **Sunset**: Rose-tinted ambers and indigo shadows swallowing the portal arches.\n\nMonet demonstrated that the cathedral itself was not the true subject—light itself, fluid and fleeting, was the canvas.`,
    tags: ['impressionism', 'monet', 'color-theory', 'modern-art'],
  },
  {
    id: 'art_post_3',
    title: 'Awakening the Stone: Form, Breath, and Silence in Classical Sculpture',
    content: `## The Non-Finito and the Living Marble\n\nTo stand before Michelangelo’s unfinished *Slaves* (*Prigioni*) in Florence is to witness marble caught in the act of becoming. The muscles of the torso strain against raw crystalline rock; the faces remain half-submerged in the quarry stone of Carrara.\n\nMichelangelo believed that sculpture was not an additive art, but an act of liberation:\n\n> "Every block of stone has a statue inside it, and it is the task of the sculptor to discover it."\n\n### The Tension Between Weight and Grace\n\nFrom the wind-swept drapery of the Hellenistic *Winged Victory of Samothrace* to Auguste Rodin’s rough-hewn bronzes, great sculpture navigates a fundamental paradox: how to make the heaviest, most enduring materials of the earth convey human vulnerability, breath, and movement.\n\nWhen we walk around a three-dimensional work of art, our own bodies become part of the composition. Every angle reshapes the silhouette, every shift in gallery shadow changes the expression carved in stone thousands of years ago.`,
    tags: ['sculpture', 'renaissance', 'michelangelo', 'form'],
  },
];

// Initialize seed data for both memory store and MongoDB
export async function initializeSeedData() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const readerPasswordHash = await bcrypt.hash('reader123', 10);

  if (getMongoActive()) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Seed] Database is empty. Seeding initial curator, reader, and art essays into MongoDB...');
        
        const admin = await User.create({
          name: 'Elena Rostova (Curator)',
          email: 'admin@miniblog.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
        });

        const reader = await User.create({
          name: 'Julian Vance (Art Critic)',
          email: 'reader@miniblog.com',
          passwordHash: readerPasswordHash,
          role: 'reader',
        });

        for (const item of seedArticles) {
          const post = await Post.create({
            title: item.title,
            content: item.content,
            tags: item.tags,
            authorId: admin._id,
          });

          await Comment.create({
            postId: post._id,
            userId: reader._id,
            text: 'A profoundly insightful reading of the brushwork and thematic composition. The historical framing is sublime.',
          });
        }

        console.log('[Seed] Art essays and discussions seeded successfully.');
      }
    } catch (err) {
      console.error('[Seed Error] Failed to seed MongoDB:', err.message);
    }
  } else {
    // Seed in-memory store
    memoryStore.users = [
      {
        id: 'usr_curator',
        name: 'Elena Rostova (Curator)',
        email: 'admin@miniblog.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_reader',
        name: 'Julian Vance (Art Critic)',
        email: 'reader@miniblog.com',
        passwordHash: readerPasswordHash,
        role: 'reader',
        createdAt: new Date().toISOString(),
      },
    ];

    memoryStore.posts = seedArticles.map((art, idx) => ({
      id: art.id,
      title: art.title,
      content: art.content,
      tags: art.tags,
      authorId: 'usr_curator',
      createdAt: new Date(Date.now() - 3600000 * (idx * 3 + 1)).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * (idx * 3 + 1)).toISOString(),
    }));

    memoryStore.comments = [
      {
        id: 'cmt_1',
        postId: 'art_post_1',
        userId: 'usr_reader',
        text: 'The distinction between Vermeer’s quiet domesticity and the grandiose Baroque of his contemporaries is captured beautifully here. The observation on the lapis lazuli shadows is striking.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'cmt_2',
        postId: 'art_post_2',
        userId: 'usr_reader',
        text: 'Monet’s Rouen Cathedral series proved that light itself is the true subject of painting, not the stone. A wonderful reflection on the impact of portable paint tubes as well.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'cmt_3',
        postId: 'art_post_3',
        userId: 'usr_reader',
        text: 'The concept of non-finito in Michelangelo has always felt almost contemporary in its emotional rawness. Beautiful essay!',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ];

    console.log('[Store] Journal store initialized with demo curator (admin@miniblog.com) and reader (reader@miniblog.com).');
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
