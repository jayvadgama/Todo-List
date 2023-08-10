const assert = require('chai').assert;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Import the functions to be tested from main.js
const {
  generateUniqueId,
  fetchAndPopulateTasks,
  deleteTask,
  addTask,
} = require('./main');

// Describe block for the generateUniqueId function
describe('generateUniqueId', function () {
  it('should generate a unique ID', function () {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    assert.notEqual(id1, id2, 'Generated IDs should be unique');
  });
});

// Describe block for the fetchAndPopulateTasks function
describe('fetchAndPopulateTasks', function () {
  // Use JSDOM to create a virtual DOM environment
  const dom = new JSDOM('<!DOCTYPE html><div id="taskList"></div>');
  global.document = dom.window.document;

  it('should fetch and populate tasks', async function () {
    // Mock the fetch function for testing
    global.fetch = async () => ({
      json: async () => [
        // Mock task data
        { taskId: '1', taskName: 'Task 1', taskMaker: 'User 1', priority: 'low' },
        { taskId: '2', taskName: 'Task 2', taskMaker: 'User 2', priority: 'medium' },
        // ... 
      ],
    });

    // Call the function to be tested
    await fetchAndPopulateTasks();

    // Assert that tasks are populated in the DOM
    const taskList = document.getElementById('taskList');
    assert.equal(taskList.children.length, 2, 'Expected number of tasks');
    // Add more assertions as needed
  });
});

// Describe block for the deleteTask function
describe('deleteTask', function () {
  it('should delete a task', async function () {
    // Mock the fetch function for testing
    global.fetch = async () => ({
      ok: true,
      text: async () => 'Task deleted successfully.',
    });

    // Create a mock list item with a task ID
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.dataset.taskId = '1';

    // Simulate a click event on the delete button
    const event = { target: listItem.querySelector('.delete-task') };
    await deleteTask(event);

    // Assert that the list item is removed from the DOM
    const taskList = document.getElementById('taskList');
    assert.equal(taskList.children.length, 0, 'Task should be removed');
    // Add more assertions as needed
  });
});

// Describe block for the addTask function
describe('addTask', function () {
  it('should add a task', async function () {
    // Mock the fetch function for testing
    global.fetch = async () => ({
      json: async () => ({ taskId: '123' }), // Mock response with the added task ID
    });

    // Mock input values
    document.querySelector('#taskName').value = 'New Task';
    document.querySelector('#taskOwner').value = 'User 3';
    document.querySelector('#priority').value = 'high';

    // Call the function to be tested
    await addTask();

    // Assert that the task is added to the DOM
    const taskList = document.getElementById('taskList');
    assert.equal(taskList.children.length, 1, 'Task should be added');
    // Add more assertions as needed
  });
});
