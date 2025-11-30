import { useState, useEffect } from 'react';

// --- Стилі: Суворі, Рівні, Без зайвого ---
const styles = {
    container: {
        minHeight: '100vh',
        background: '#f1f3f5', // Світло-сірий професійний фон
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
    },
    card: {
        background: '#ffffff',
        width: '100%',
        maxWidth: '650px',
        borderRadius: '4px', // Мінімальне заокруглення
        border: '1px solid #dee2e6', // Тонка чітка рамка
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        padding: '40px',
        height: 'fit-content',
    },
    header: {
        textAlign: 'left', // Вирівнювання по лівому краю (суворіше)
        color: '#212529',
        marginBottom: '30px',
        marginTop: 0,
        fontSize: '1.5rem',
        fontWeight: '700',
        borderBottom: '2px solid #f1f3f5',
        paddingBottom: '15px',
    },
    // Верхній блок (Inputs)
    inputRow: {
        display: 'flex',
        gap: '12px', // Рівні відступи
        marginBottom: '30px',
        alignItems: 'stretch', // Щоб висота елементів була однаковою
    },
    control: {
        padding: '10px 15px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '0.9rem',
        outline: 'none',
        color: '#495057',
        transition: 'border-color 0.15s',
    },
    inputName: {
        flexGrow: 2, // Широке поле
    },
    selectCategory: {
        flexGrow: 1, // Вужче поле
        cursor: 'pointer',
        background: '#fff',
    },
    buttonAdd: {
        border: '1px solid #ced4da', // Рамка як у інпутів
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        padding: '0 25px', // Широка кнопка
        transition: 'all 0.2s',
    },
    // Блок фільтрації
    filterRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8f9fa', // Виділений блок
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #e9ecef',
        marginBottom: '20px',
    },
    searchGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexGrow: 1,
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#868e96',
        textTransform: 'uppercase',
    },
    searchInput: {
        border: 'none',
        background: 'transparent',
        borderBottom: '1px solid #ced4da', // Тільки нижня лінія
        padding: '5px 0',
        fontSize: '0.9rem',
        outline: 'none',
        width: '200px',
        color: '#212529',
    },
    filterSelect: {
        padding: '6px 10px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '0.85rem',
        cursor: 'pointer',
    },
    // Список
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        background: '#fff',
        borderBottom: '1px solid #e9ecef',
        padding: '16px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    itemName: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#212529',
    },
    badge: {
        fontSize: '0.75rem',
        color: '#495057',
        background: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: '600',
        border: '1px solid #dee2e6',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    btnAction: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background 0.2s, color 0.2s',
    },
};

function App() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Загальне');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchText, setSearchText] = useState('');

    // Стейт для ховеру кнопки додавання
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const categories = ["Загальне", "Продукти", "Електроніка", "Дім", "Робота", "Навчання"];

    const fetchItems = async () => {
        const params = new URLSearchParams();
        if (filterCategory !== 'All') params.append('category', filterCategory);
        if (searchText) params.append('search', searchText);
        const res = await fetch(`http://localhost:5000/items?${params.toString()}`);
        const data = await res.json();
        setItems(data);
    };

    useEffect(() => { fetchItems(); }, [filterCategory, searchText]);

    const addItem = async () => {
        if(!name) return;
        await fetch('http://localhost:5000/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category }),
        });
        setName('');
        fetchItems();
    };

    const deleteItem = async (id) => {
        if(window.confirm("Видалити цей запис?")) {
            await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
            fetchItems();
        }
    };

    const updateItem = async (id, oldName) => {
        const newName = prompt("Введіть нову назву:", oldName);
        if (newName && newName !== oldName) {
            await fetch(`http://localhost:5000/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            fetchItems();
        }
    };

    // Стиль кнопки Add (зміна кольору)
    const btnAddStyle = {
        ...styles.buttonAdd,
        background: isBtnHovered ? '#343a40' : '#f8f9fa', // Світла -> Темна
        color: isBtnHovered ? '#ffffff' : '#212529',      // Темний текст -> Білий
        borderColor: isBtnHovered ? '#343a40' : '#ced4da',
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Список Завдань</h2>

                {/* РЯДОК 1: Ввід даних */}
                <div style={styles.inputRow}>
                    <input
                        style={{...styles.control, ...styles.inputName}}
                        placeholder="Введіть назву..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <select style={{...styles.control, ...styles.selectCategory}} value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button
                        style={btnAddStyle}
                        onClick={addItem}
                        onMouseEnter={() => setIsBtnHovered(true)}
                        onMouseLeave={() => setIsBtnHovered(false)}
                    >
                        Додати
                    </button>
                </div>

                {/* РЯДОК 2: Фільтри */}
                <div style={styles.filterRow}>
                    <div style={styles.searchGroup}>
                        <span style={styles.label}>Пошук:</span>
                        <input
                            style={styles.searchInput}
                            placeholder="Почніть вводити..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <select style={styles.filterSelect} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="All">Всі категорії</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Список */}
                <ul style={styles.list}>
                    {items.map(item => (
                        <li key={item._id} style={styles.listItem}>
                            <div style={styles.itemContent}>
                                <span style={styles.itemName}>{item.name}</span>
                                <span style={styles.badge}>{item.category}</span>
                            </div>
                            <div style={styles.actions}>
                                <button
                                    onClick={() => updateItem(item._id, item.name)}
                                    style={{...styles.btnAction, color: '#0d6efd'}}
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => deleteItem(item._id)}
                                    style={{...styles.btnAction, color: '#dc3545'}}
                                >
                                    Видалити
                                </button>
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && <p style={{textAlign: 'center', color: '#adb5bd', margin: '20px 0'}}>Немає записів</p>}
                </ul>
            </div>
        </div>
    );
}

export default App;