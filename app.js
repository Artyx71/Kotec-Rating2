const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.db');

// Создание таблицы
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    position TEXT,
    room TEXT,
    repairTask TEXT
  )`);
});

app.use(express.json()); // Добавлен парсер JSON

// Создание заявки на ремонт
app.post('/api/requests', (req, res) => {
  const { name, position, room, repairTask } = req.body;
  db.run('INSERT INTO requests (name, position, room, repairTask) VALUES (?, ?, ?, ?)',
    [name, position, room, repairTask], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the request.' });
      } else {
        res.status(201).json({ message: 'Request created successfully.' });
      }
    });
});

// Получение всех заявок на ремонт
app.get('/api/requests', (req, res) => {
  db.all('SELECT * FROM requests', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching requests.' });
    } else {
      res.json(rows);
    }
  });
});

// Обновление заявки на ремонт
app.put('/api/requests/:id', (req, res) => {
  const id = req.params.id;
  const { name, position, room, repairTask } = req.body;
  db.run('UPDATE requests SET name = ?, position = ?, room = ?, repairTask = ? WHERE id = ?',
    [name, position, room, repairTask, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the request.' });
      } else {
        res.json({ message: 'Request updated successfully.' });
      }
    });
});

// Удаление заявки на ремонт
app.delete('/api/requests/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM requests WHERE id = ?', id, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the request.' });
    } else {
      res.json({ message: 'Request deleted successfully.' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});