import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import { db } from './db';
import { admins, projects, experience, contactUrls, backgroundKeyframes } from './db/schema';
import { eq, asc } from 'drizzle-orm';

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

// Email Transporter (Example with placeholder, will use env if provided)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'image/svg+xml' || file.mimetype === 'image/avif';
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (including SVG and AVIF) are allowed'));
  }
});

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Helper to sanitize payload for updates (remove id and createdAt)
const sanitizePayload = (payload: any) => {
  const { id, createdAt, created_at, ...rest } = payload;
  return rest;
};

// Public Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', api: true, timestamp: new Date().toISOString() });
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!CONTACT_EMAIL) {
    console.error('CONTACT_EMAIL not configured in environment variables');
    return res.status(500).json({ error: 'Contact email not configured' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00e7fd;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Serve uploaded files directly (or through imgproxy)
app.use('/uploads', express.static('uploads'));

app.get('/api/projects', async (req, res) => {
  try {
    const data = await db.select().from(projects);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/experience', async (req, res) => {
  try {
    const data = await db.select().from(experience).orderBy(asc(experience.order));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

app.post('/api/admin/experience/reorder', authenticateToken, async (req, res) => {
  const { ids } = req.body; // Array of IDs in the new order
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx.update(experience).set({ order: i }).where(eq(experience.id, ids[i]));
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder experience' });
  }
});

app.get('/api/contact-urls', async (req, res) => {
  try {
    const data = await db.select().from(contactUrls);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact URLs' });
  }
});

app.get('/api/background-keyframes', async (req, res) => {
  try {
    const data = await db.select().from(backgroundKeyframes);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch keyframes' });
  }
});

// Admin Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await Bun.password.verify(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected Admin Routes
app.post('/api/admin/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the filename. The frontend will decide how to use it.
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const result = await db.insert(projects).values(req.body).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.update(projects)
      .set(sanitizePayload(req.body))
      .where(eq(projects.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.post('/api/admin/experience', authenticateToken, async (req, res) => {
  try {
    const allExp = await db.select().from(experience);
    const maxOrder = allExp.reduce((max, item) => Math.max(max, item.order || 0), -1);
    
    const result = await db.insert(experience).values({ ...req.body, order: maxOrder + 1 }).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

app.put('/api/admin/experience/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.update(experience)
      .set(sanitizePayload(req.body))
      .where(eq(experience.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

app.delete('/api/admin/experience/:id', authenticateToken, async (req, res) => {
  try {
    await db.delete(experience).where(eq(experience.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

app.post('/api/admin/contact-urls', authenticateToken, async (req, res) => {
  try {
    const result = await db.insert(contactUrls).values(req.body).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact URL' });
  }
});

app.put('/api/admin/contact-urls/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.update(contactUrls)
      .set(sanitizePayload(req.body))
      .where(eq(contactUrls.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact URL' });
  }
});

app.delete('/api/admin/contact-urls/:id', authenticateToken, async (req, res) => {
  try {
    await db.delete(contactUrls).where(eq(contactUrls.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact URL' });
  }
});

app.post('/api/admin/background-keyframes', authenticateToken, async (req, res) => {
  try {
    const result = await db.insert(backgroundKeyframes).values(req.body).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create keyframe' });
  }
});

app.put('/api/admin/background-keyframes/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.update(backgroundKeyframes)
      .set(sanitizePayload(req.body))
      .where(eq(backgroundKeyframes.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update keyframe' });
  }
});

app.delete('/api/admin/background-keyframes/:id', authenticateToken, async (req, res) => {
  try {
    await db.delete(backgroundKeyframes).where(eq(backgroundKeyframes.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete keyframe' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
