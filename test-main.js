const assert = require('chai').assert;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Functions to be tested from main.js
const { generateUniqueId } = require('./main'); 

//Block for the generateUniqueId function
describe('generateUniqueId', function () {
  it('should generate a unique ID', function () {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    assert.notEqual(id1, id2, 'Generated IDs should be unique');
  });
});

//Testing the fetchAndPopulateTasks function
describe('fetchAndPopulateTasks', function () {
  // Use JSDOM to create a virtual DOM environment
  const dom = new JSDOM('<!DOCTYPE html><div id="taskList"></div>');
  global.document = dom.window.document;

  it('should fetch and populate tasks', async function () {
    // Import the function to be tested
    const { fetchAndPopulateTasks } = require('./main'); // Update the path accordingly

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


