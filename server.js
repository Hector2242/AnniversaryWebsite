const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Data files
const PHOTOS_FILE = path.join(__dirname, 'photos.json');
const NOTES_FILE = path.join(__dirname, 'notes.json');
const LETTERS_FILE = path.join(__dirname, 'letters.json');

// Initialize data files if they don't exist
if (!fs.existsSync(PHOTOS_FILE)) {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(LETTERS_FILE)) {
    fs.writeFileSync(LETTERS_FILE, JSON.stringify([], null, 2));
}

// Create letters folder if it doesn't exist
const lettersDir = path.join(__dirname, 'letters');
if (!fs.existsSync(lettersDir)) {
    fs.mkdirSync(lettersDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'pic'));
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'uploaded-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Only allow images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Get all uploaded photos
app.get('/api/photos', (req, res) => {
    try {
        const data = fs.readFileSync(PHOTOS_FILE, 'utf8');
        const photos = JSON.parse(data);
        res.json(photos);
    } catch (error) {
        console.error('Error reading photos:', error);
        res.json([]);
    }
});

// Upload photos
app.post('/api/photos', upload.array('photos', 20), (req, res) => {
    try {
        const data = fs.readFileSync(PHOTOS_FILE, 'utf8');
        const photos = JSON.parse(data);

        const metadata = JSON.parse(req.body.metadata || '[]');

        const newPhotos = req.files.map((file, index) => {
            const meta = metadata[index] || {};
            return {
                id: Date.now() + '-' + index,
                filename: file.filename,
                src: 'pic/' + file.filename,
                year: meta.year || '2024',
                caption: meta.caption || '',
                uploadedAt: new Date().toISOString()
            };
        });

        photos.push(...newPhotos);
        fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));

        res.json({ success: true, photos: newPhotos });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a photo
app.delete('/api/photos/:id', (req, res) => {
    try {
        const data = fs.readFileSync(PHOTOS_FILE, 'utf8');
        let photos = JSON.parse(data);

        const photoIndex = photos.findIndex(p => p.id === req.params.id);

        if (photoIndex === -1) {
            return res.status(404).json({ success: false, error: 'Photo not found' });
        }

        const photo = photos[photoIndex];

        // Delete the file from disk
        const filePath = path.join(__dirname, 'pic', photo.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from metadata
        photos.splice(photoIndex, 1);
        fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================================================
// Notes API
// ==========================================================================

// Get all notes
app.get('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf8');
        const notes = JSON.parse(data);
        // Sort: pinned first, then by date
        notes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        res.json(notes.filter(n => !n.archived));
    } catch (error) {
        console.error('Error reading notes:', error);
        res.json([]);
    }
});

// Create a note
app.post('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf8');
        const notes = JSON.parse(data);

        const newNote = {
            id: Date.now().toString(),
            content: req.body.content,
            tag: req.body.tag || 'thought',
            pinned: req.body.pinned || false,
            archived: false,
            createdAt: new Date().toISOString()
        };

        notes.push(newNote);
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));

        res.json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a note (pin/archive)
app.put('/api/notes/:id', (req, res) => {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf8');
        let notes = JSON.parse(data);

        const noteIndex = notes.findIndex(n => n.id === req.params.id);
        if (noteIndex === -1) {
            return res.status(404).json({ success: false, error: 'Note not found' });
        }

        notes[noteIndex] = { ...notes[noteIndex], ...req.body };
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));

        res.json({ success: true, note: notes[noteIndex] });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf8');
        let notes = JSON.parse(data);

        notes = notes.filter(n => n.id !== req.params.id);
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================================================
// Letters API
// ==========================================================================

// Configure multer for letter image uploads
const letterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'letters'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'letter-' + uniqueSuffix + ext);
    }
});

const letterUpload = multer({
    storage: letterStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Get all letters
app.get('/api/letters', (req, res) => {
    try {
        const data = fs.readFileSync(LETTERS_FILE, 'utf8');
        const letters = JSON.parse(data);
        // Sort by date written or created
        letters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(letters);
    } catch (error) {
        console.error('Error reading letters:', error);
        res.json([]);
    }
});

// Create a letter (text)
app.post('/api/letters', (req, res) => {
    try {
        const data = fs.readFileSync(LETTERS_FILE, 'utf8');
        const letters = JSON.parse(data);

        const newLetter = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content || '',
            format: 'text',
            dateWritten: req.body.dateWritten || null,
            feeling: req.body.feeling || '',
            readWhen: req.body.readWhen || '',
            createdAt: new Date().toISOString()
        };

        letters.push(newLetter);
        fs.writeFileSync(LETTERS_FILE, JSON.stringify(letters, null, 2));

        res.json({ success: true, letter: newLetter });
    } catch (error) {
        console.error('Error creating letter:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a letter with image
app.post('/api/letters/image', letterUpload.single('image'), (req, res) => {
    try {
        const data = fs.readFileSync(LETTERS_FILE, 'utf8');
        const letters = JSON.parse(data);

        const newLetter = {
            id: Date.now().toString(),
            title: req.body.title,
            imageSrc: 'letters/' + req.file.filename,
            format: 'image',
            dateWritten: req.body.dateWritten || null,
            feeling: req.body.feeling || '',
            readWhen: req.body.readWhen || '',
            createdAt: new Date().toISOString()
        };

        letters.push(newLetter);
        fs.writeFileSync(LETTERS_FILE, JSON.stringify(letters, null, 2));

        res.json({ success: true, letter: newLetter });
    } catch (error) {
        console.error('Error creating letter:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a letter
app.delete('/api/letters/:id', (req, res) => {
    try {
        const data = fs.readFileSync(LETTERS_FILE, 'utf8');
        let letters = JSON.parse(data);

        const letter = letters.find(l => l.id === req.params.id);
        if (!letter) {
            return res.status(404).json({ success: false, error: 'Letter not found' });
        }

        // Delete image file if exists
        if (letter.imageSrc) {
            const filePath = path.join(__dirname, letter.imageSrc);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        letters = letters.filter(l => l.id !== req.params.id);
        fs.writeFileSync(LETTERS_FILE, JSON.stringify(letters, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting letter:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Anniversary Website server running at http://localhost:${PORT}`);
});
