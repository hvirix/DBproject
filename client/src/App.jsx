import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [currentList, setCurrentList] = useState(null);
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');

    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Продукти'); // Змінив дефолт

    const categories = ["Продукти", "Електроніка", "Дім", "Робота", "Навчання", "Інше"];

    const fetchLists = async () => {
        try {
            const res = await fetch('http://localhost:5000/lists');
            const data = await res.json();
            setLists(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchLists(); }, []);

    const createList = async () => {
        if (!newListName.trim()) return;
        try {
            const res = await fetch('http://localhost:5000/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newListName }),
            });
            const list = await res.json();
            setLists([list, ...lists]);
            setNewListName('');
        } catch (error) { console.error(error); }
    };

    const deleteList = async (e, id) => {
        e.stopPropagation();
        // попередження про видалення списку
        if (window.confirm("Видалити цей список разом з товарами?")) {
            await fetch(`http://localhost:5000/lists/${id}`, { method: 'DELETE' });
            fetchLists();
        }
    };

    const fetchItems = async () => {
        if (!currentList) return;
        try {
            const res = await fetch(`http://localhost:5000/items?listId=${currentList._id}`);
            const data = await res.json();
            setItems(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchItems(); }, [currentList]);

    const addItem = async () => {
        if (!name.trim()) return;
        try {
            await fetch('http://localhost:5000/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, listId: currentList._id }),
            });
            setName('');
            fetchItems();
        } catch (error) { console.error(error); }
    };

    const deleteItem = async (id) => {
        // попередження про видалення товару
        if (window.confirm("Ви точно хочете видалити цей запис?")) {
            await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
            fetchItems();
        }
    };

    const updateItem = async (id, oldName) => {
        const newName = prompt("Введіть нову назву:", oldName);
        if (newName && newName.trim() !== oldName) {
            await fetch(`http://localhost:5000/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            fetchItems();
        }
    };

    if (!currentList) {
        return (
            <div className="app-container">
                <div className="main-card">
                    <h1 className="header-title">Мої списки</h1>

                    <div className="input-group">
                        <input
                            className="form-control input-name"
                            placeholder="Створити новий список..."
                            value={newListName}
                            onChange={e => setNewListName(e.target.value)}
                        />
                        <button className="btn-primary" onClick={createList}>Створити</button>
                    </div>

                    <div className="lists-grid">
                        {lists.map(list => (
                            <div key={list._id} className="list-item-card" onClick={() => setCurrentList(list)}>
                                <span className="list-name">{list.title}</span>
                                <button
                                    className="icon-btn delete"
                                    onClick={(e) => deleteList(e, list._id)}
                                    title="Видалити список"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {lists.length === 0 && <p className="empty-state">У вас поки немає списків</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="main-card">
                <div className="header-row">
                    <button className="back-btn" onClick={() => setCurrentList(null)}>
                        ← Назад
                    </button>
                    <span className="list-title">{currentList.title}</span>
                    <div style={{width: '60px'}}></div> {/* Для балансу */}
                </div>

                <div className="input-group">
                    <input
                        className="form-control input-name"
                        placeholder="Введіть назву товару"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()} // Додав Enter
                    />
                    <select className="form-control select-category" value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button className="btn-primary" onClick={addItem}>Додати</button>
                </div>

                <div className="table-header">
                    <span>Назва</span>
                    <span style={{textAlign: 'center'}}>Категорія</span>
                    <span style={{textAlign: 'right'}}>Дії</span>
                </div>

                <ul className="items-list">
                    {items.map(item => (
                        <li key={item._id} className="item-row">
                            <div className="item-text">{item.name}</div>

                            <div className="category-badge">
                                {item.category}
                            </div>

                            <div className="actions-cell">
                                <button title="Редагувати" onClick={() => updateItem(item._id, item.name)} className="icon-btn edit">✎</button>
                                <button title="Видалити" onClick={() => deleteItem(item._id)} className="icon-btn delete">✕</button>
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && <p className="empty-state">Список порожній</p>}
                </ul>
            </div>
        </div>
    );
}

export default App;