import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { admins, projects, experience, contactUrls } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Public Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', api: true, timestamp: new Date().toISOString() });
});

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
    const data = await db.select().from(experience);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
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
    const result = await db.update(projects).set(req.body).where(eq(projects.id, parseInt(req.params.id))).returning();
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
    const result = await db.insert(experience).values(req.body).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

app.put('/api/admin/experience/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.update(experience).set(req.body).where(eq(experience.id, parseInt(req.params.id))).returning();
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
    const result = await db.update(contactUrls).set(req.body).where(eq(contactUrls.id, parseInt(req.params.id))).returning();
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

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
