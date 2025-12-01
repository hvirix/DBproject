const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const List = require('./models/List');
const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shop_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Error:', err));

// --- API списків ---

app.get('/lists', async (req, res) => {
    try {
        const lists = await List.find().sort({ createdAt: -1 });
        res.json(lists);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/lists', async (req, res) => {
    try {
        const newList = new List(req.body);
        await newList.save();
        res.json(newList);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/lists/:id', async (req, res) => {
    try {
        const listId = req.params.id;
        await List.findByIdAndDelete(listId);
        await Item.deleteMany({ listId: listId });
        res.json({ message: 'List deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API товарів ---

app.get('/items', async (req, res) => {
    try {
        const { listId, search } = req.query;
        let query = { listId };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const items = await Item.find(query);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));