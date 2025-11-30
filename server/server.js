const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Підключаємось до бази даних (вона має бути встановлена на компі)
mongoose.connect('mongodb://localhost:27017/shop_db')
    .then(() => console.log('MongoDB Підключено!'))
    .catch(err => console.error('Помилка бази:', err));

// Схема товару
const ItemSchema = new mongoose.Schema({
    name: String,
    category: String
});
const Item = mongoose.model('Item', ItemSchema);

// Отримати товари (з пошуком і фільтром)
app.get('/items', async (req, res) => {
    const { category, search } = req.query;
    let query = {};

    // Якщо вибрана категорія не All, додаємо фільтр
    if (category && category !== 'All') {
        query.category = category;
    }
    // Якщо є текст пошуку, шукаємо схожі назви
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query);
    res.json(items);
});

// Додати товар
app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

// Редагувати товар
app.put('/items/:id', async (req, res) => {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// Видалити товар
app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Сервер працює на порту 5000'));