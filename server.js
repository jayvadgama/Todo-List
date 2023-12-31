const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up handlebars as the view engine
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes 
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.render('index'));
// Load existing tasks from JSON file
let tasks = [];
fs.readFile('tasks.json', 'utf8', (err, data) => {
  if (!err) {
    tasks = JSON.parse(data);
  }
});

// API endpoint to get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// API endpoint to add a new task
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);

  fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf8', err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'Task added successfully' });
  });
});

// API endpoint to delete a task
app.delete('/api/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  tasks = tasks.filter(task => task.taskId !== taskId);

  fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf8', err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.put('/api/tasks/:taskId/completed', (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find(task => task.taskId === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = true;

  fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf8', err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'Task marked as completed' });
  });
});
