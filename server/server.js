const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shop_db')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error(err));

// --- 1. Схема для СПИСКІВ (Нове!) ---
const ListSchema = new mongoose.Schema({
    title: String, // Назва списку (напр. "Покупки на ДР")
    createdAt: { type: Date, default: Date.now }
});
const List = mongoose.model('List', ListSchema);

// --- 2. Схема для ТОВАРІВ (Оновлена) ---
const ItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    listId: String // Важливо: прив'язка до конкретного списку
});
const Item = mongoose.model('Item', ItemSchema);

// --- API для СПИСКІВ ---

// Отримати всі списки
app.get('/lists', async (req, res) => {
    const lists = await List.find().sort({ createdAt: -1 });
    res.json(lists);
});

// Створити новий список
app.post('/lists', async (req, res) => {
    const newList = new List(req.body);
    await newList.save();
    res.json(newList);
});

// Видалити список (і всі товари в ньому)
app.delete('/lists/:id', async (req, res) => {
    const listId = req.params.id;
    await List.findByIdAndDelete(listId);
    await Item.deleteMany({ listId: listId }); // Видаляємо товари цього списку
    res.json({ message: 'List deleted' });
});

// --- API для ТОВАРІВ ---

// Отримати товари ТІЛЬКИ конкретного списку
app.get('/items', async (req, res) => {
    const { listId, category, search } = req.query;
    let query = { listId }; // Фільтруємо по ID списку

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const items = await Item.find(query);
    res.json(items);
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on 5000'));