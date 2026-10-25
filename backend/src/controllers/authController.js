import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepo } from '../services/dbStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_12345';
const JWT_EXPIRES_IN = '7d';

function createToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'reader';

    const existingUser = await usersRepo.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await usersRepo.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: assignedRole,
    });

    const token = createToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await usersRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  return res.json({
    user: {
      id: req.user.id || req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}
