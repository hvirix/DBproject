import { useState, useEffect } from 'react';

// --- Стилі ---
const styles = {
    container: {
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '60px',
    },
    card: {
        background: '#ffffff',
        width: '100%',
        maxWidth: '700px', // Повернули нормальну ширину
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        padding: '40px',
        height: 'fit-content',
        border: '1px solid #e9ecef',
    },
    // Заголовки
    mainHeader: {
        textAlign: 'center',
        color: '#212529',
        marginBottom: '40px',
        fontSize: '2rem',
        fontWeight: '800',
        letterSpacing: '-1px',
    },
    listHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #f1f3f5',
        paddingBottom: '20px',
    },
    listTitle: {
        margin: 0,
        fontSize: '1.8rem',
        color: '#343a40',
        fontWeight: 'bold',
    },
    btnBack: {
        background: 'transparent',
        border: '1px solid #dee2e6',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#495057',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },

    // --- Екран вибору списків ---
    newListGroup: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
    },
    inputList: {
        flexGrow: 1,
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ced4da',
        fontSize: '1.1rem',
        outline: 'none',
    },
    btnCreateList: {
        padding: '0 25px',
        background: '#212529',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    listsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr', // Список списків стовпчиком
        gap: '15px',
    },
    listCard: {
        background: '#fff',
        border: '1px solid #e9ecef',
        padding: '20px',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
    },
    listCardTitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#343a40',
    },

    // --- Внутрішній функціонал списку ---
    inputRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
    },
    control: {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ced4da',
        fontSize: '1rem',
        outline: 'none',
        color: '#495057',
    },
    buttonAdd: {
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: '0 25px',
        background: '#228be6',
        color: 'white',
    },

    // --- ТАБЛИЦЯ ТОВАРІВ (Відцентрована) ---
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: {
        display: 'grid',
        // 40% назва, 40% категорія (по центру), 20% кнопки
        gridTemplateColumns: '4fr 4fr 100px',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #f1f3f5',
        padding: '15px 0',
    },
    itemName: {
        fontSize: '1.1rem',
        fontWeight: '500',
        color: '#212529',
        paddingLeft: '10px',
    },
    // Центрування категорії
    categoryCell: {
        textAlign: 'center', // Центруємо текст
        color: '#868e96',
        fontSize: '0.9rem',
        fontWeight: '500',
        background: '#f8f9fa', // Легкий фон для виділення колонки
        padding: '5px 10px',
        borderRadius: '20px',
        width: 'fit-content', // Ширина по контенту
        justifySelf: 'center', // Центруємо саму плашку в клітинці
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        paddingRight: '10px',
    },
    iconBtn: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: 0,
        transition: '0.2s',
    },

    // Заголовки колонок
    headerRow: {
        display: 'grid',
        gridTemplateColumns: '4fr 4fr 100px',
        padding: '0 0 15px 0',
        borderBottom: '2px solid #e9ecef',
        color: '#adb5bd',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
};

function App() {
    // Стан для перемикання екранів
    const [currentList, setCurrentList] = useState(null); // Якщо null - показуємо всі списки, якщо об'єкт - показуємо товари
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');

    // Стан для товарів
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Загальне');

    const categories = ["Загальне", "Продукти", "Електроніка", "Дім", "Робота", "Навчання"];

    // 1. Завантаження списків при старті
    const fetchLists = async () => {
        const res = await fetch('http://localhost:5000/lists');
        const data = await res.json();
        setLists(data);
    };

    useEffect(() => { fetchLists(); }, []);

    // 2. Створення нового списку
    const createList = async () => {
        if(!newListName) return;
        const res = await fetch('http://localhost:5000/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newListName }),
        });
        const list = await res.json();
        setLists([list, ...lists]);
        setNewListName('');
    };

    // 3. Видалення списку
    const deleteList = async (e, id) => {
        e.stopPropagation(); // Щоб не відкривався список при кліку на видалення
        if(window.confirm("Видалити весь список?")) {
            await fetch(`http://localhost:5000/lists/${id}`, { method: 'DELETE' });
            fetchLists();
        }
    };

    // --- Логіка товарів (Тільки коли вибрано список) ---
    const fetchItems = async () => {
        if(!currentList) return;
        const res = await fetch(`http://localhost:5000/items?listId=${currentList._id}`);
        const data = await res.json();
        setItems(data);
    };

    useEffect(() => { fetchItems(); }, [currentList]);

    const addItem = async () => {
        if(!name) return;
        await fetch('http://localhost:5000/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category, listId: currentList._id }),
        });
        setName('');
        fetchItems();
    };

    const deleteItem = async (id) => {
        await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const updateItem = async (id, oldName) => {
        const newName = prompt("Нова назва:", oldName);
        if (newName) {
            await fetch(`http://localhost:5000/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            fetchItems();
        }
    };

    // --- ЕКРАН 1: УСІ СПИСКИ ---
    if (!currentList) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.mainHeader}>Мої Списки 📝</h1>

                    <div style={styles.newListGroup}>
                        <input
                            style={styles.inputList}
                            placeholder="Назва нового списку (напр. АТБ)"
                            value={newListName}
                            onChange={e => setNewListName(e.target.value)}
                        />
                        <button style={styles.btnCreateList} onClick={createList}>Створити</button>
                    </div>

                    <div style={styles.listsGrid}>
                        {lists.map(list => (
                            <div key={list._id} style={styles.listCard} onClick={() => setCurrentList(list)}>
                                <span style={styles.listCardTitle}>{list.title}</span>
                                <button
                                    onClick={(e) => deleteList(e, list._id)}
                                    style={{...styles.iconBtn, color: '#fa5252'}}
                                    title="Видалити список"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {lists.length === 0 && <p style={{textAlign: 'center', color: '#adb5bd'}}>Створіть свій перший список!</p>}
                    </div>
                </div>
            </div>
        );
    }

    // --- ЕКРАН 2: ВСЕРЕДИНІ СПИСКУ ---
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Шапка списку */}
                <div style={styles.listHeaderRow}>
                    <button style={styles.btnBack} onClick={() => setCurrentList(null)}>
                        ← Назад
                    </button>
                    <h2 style={styles.listTitle}>{currentList.title}</h2>
                    <div style={{width: '80px'}}></div> {/* Пустий блок для балансу */}
                </div>

                {/* Додавання товару */}
                <div style={styles.inputRow}>
                    <input
                        style={{...styles.control, flexGrow: 1}}
                        placeholder="Що купити?"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <select style={{...styles.control, cursor: 'pointer'}} value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button style={styles.buttonAdd} onClick={addItem}>+</button>
                </div>

                {/* Заголовки Таблиці */}
                <div style={styles.headerRow}>
                    <span style={{paddingLeft: '10px'}}>НАЗВА</span>
                    <span style={{textAlign: 'center'}}>КАТЕГОРІЯ</span>
                    <span style={{textAlign: 'right', paddingRight: '10px'}}>ДІЇ</span>
                </div>

                {/* Список Товарів */}
                <ul style={styles.list}>
                    {items.map(item => (
                        <li key={item._id} style={styles.listItem}>
                            {/* 1. Назва */}
                            <div style={styles.itemName}>{item.name}</div>

                            {/* 2. Категорія (ВІДЦЕНТРОВАНА) */}
                            <div style={styles.categoryCell}>
                                {item.category}
                            </div>

                            {/* 3. Дії */}
                            <div style={styles.actions}>
                                <button onClick={() => updateItem(item._id, item.name)} style={{...styles.iconBtn, color: '#ced4da'}}>✎</button>
                                <button onClick={() => deleteItem(item._id)} style={{...styles.iconBtn, color: '#fa5252'}}>✕</button>
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && <p style={{textAlign: 'center', color: '#adb5bd', marginTop: '30px'}}>Список порожній</p>}
                </ul>
            </div>
        </div>
    );
}

export default App;