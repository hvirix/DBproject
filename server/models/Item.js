const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true }
});

module.exports = mongoose.model('Item', ItemSchema);