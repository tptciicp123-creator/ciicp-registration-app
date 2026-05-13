import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'registrations.json');

app.use(cors());
app.use(express.json());

// Initialize JSON file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save a new registration
app.post('/api/registrations', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const registrations = JSON.parse(data);
    
    const newRegistration = {
      ...req.body,
      id: Date.now(),
      registeredAt: new Date().toISOString()
    };
    
    registrations.push(newRegistration);
    await fs.writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
    
    res.status(201).json(newRegistration);
  } catch {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Update a registration (e.g., status, uniqueId)
app.patch('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let registrations = JSON.parse(data);
    
    const index = registrations.findIndex(r => r.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Registration not found' });
    
    registrations[index] = { ...registrations[index], ...req.body };
    await fs.writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
    
    res.json(registrations[index]);
  } catch {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

app.listen(PORT, async () => {
  await initDataFile();
  console.log(`Server running at http://localhost:${PORT}`);
});
