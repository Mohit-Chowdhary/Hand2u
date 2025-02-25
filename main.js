
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/hand2u', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define item schema
const itemSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    imageUrl: String
});

const Item = mongoose.model('Item', itemSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Upload item route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { name, category, description } = req.body;
        const newItem = new Item({
            name,
            category,
            description,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newItem.save();
        res.status(201).json({ message: 'Item uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload item' });
    }
});

// Fetch items route
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
