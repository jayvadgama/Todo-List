document.addEventListener("DOMContentLoaded", function () {
  var addTaskButton = document.querySelector(".btn-primary");
  var modalContainer = document.querySelector("#popupContainer");

  // Get a reference to the popup modal
  var modal = document.querySelector("#addTaskModal");

  fetchAndPopulateTasks();
  addTaskButton.addEventListener("click", function () {
    console.log("hmm");
    modal.style.display = "block";
  });

  function attachDeleteListeners() {
    console.log("line 15")
    const deleteButtons = document.querySelectorAll('.delete-task');
    deleteButtons.forEach(button => {
      button.addEventListener('click', deleteTask);
    });
  }

  // Function to close the modal
  function closeModal() {
    modal.style.display = "none";
  }

  // Add a click event listener to the close button
  var closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", closeModal);

  // Handle the "Save Task" button
  var saveTaskButton = modal.querySelector("#saveTask");
  saveTaskButton.addEventListener("click", async function () {
    var taskName = document.querySelector("#taskName").value;
    var taskOwner = document.querySelector("#taskOwner").value;
    var priority = document.querySelector("#priority").value;
    console.log("values adding: " + taskName, taskOwner, priority);
    var taskId = generateUniqueId();
    const newTask = {
      taskId: taskId, 
      taskName: taskName,
      taskMaker: taskOwner,
      priority: priority,
    };

    try {
      await addTask(newTask);
      // Refresh the task list or do any necessary updates
      console.log('Task added successfully.');
      closeModal();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  });




  function populateTaskList(tasks) {
    // Sort tasks based on priority (veryhigh > high > medium > low)
    tasks.sort((a, b) => {
      const priorityOrder = ['veryhigh', 'high', 'medium', 'low'];
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
    
  
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing list
  
    tasks.forEach(task => {
      console.log("taskID:" +task.taskId)
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.dataset.taskId = task.taskId;
      
      
      listItem.innerHTML = `
        <div class="todo-indicator"></div>
        <div class="widget-content p-0">
          <div class="widget-content-wrapper">
            <div class="widget-content-left mr-2">
              <div class="custom-checkbox custom-control">
                <input class="custom-control-input" id="checkbox-${task.taskId}" type="checkbox">
                <label class="custom-control-label" for="checkbox-${task.taskId}">&nbsp;</label>
              </div>
            </div>
            <div class="widget-content-left">
              <div class="widget-heading">${task.taskName} <div class="badge badge-danger ml-2">${task.priority}</div></div>
              <div class="widget-subheading"><i>By ${task.taskMaker}</i></div>
            </div>
            <div class="widget-content-right">
              <button class="border-0 btn-transition btn btn-outline-success">
                <i class="fa fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      if (task.completed) {
        listItem.style.textDecoration = 'line-through';
      }

      const deleteButton = document.createElement('button');
      deleteButton.className = 'border-0 btn-transition btn btn-outline-danger delete-task';
      deleteButton.dataset.taskId = task.taskId; // Set the task ID as a data attribute
      deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
      listItem.querySelector('.widget-content-right').appendChild(deleteButton);

      // Set priority indicator color based on task.priority
      const todoIndicator = listItem.querySelector('.todo-indicator');
      if (task.priority === 'low') {
        todoIndicator.classList.add('bg-success');
      } else if (task.priority === 'medium') {
        todoIndicator.classList.add('bg-primary');
      } else if (task.priority === 'high') {
        todoIndicator.classList.add('bg-warning');
      } else if (task.priority === 'veryhigh') {
        todoIndicator.classList.add('bg-danger');
      }
  
      taskList.appendChild(listItem);
      const checkButton = listItem.querySelector('.btn-outline-success');
      checkButton.addEventListener('click', () => toggleTaskCompleted(task.taskId));
    });
    function toggleTaskCompleted(taskId) {
      fetchAndUpdateTask(taskId);
    }
  }



  async function fetchAndUpdateTask(taskId) {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/completed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }), // Mark task as completed
      });
  
      if (response.ok) {
        // Fetch and populate tasks again to update the list
        fetchAndPopulateTasks();
      } else {
        console.error('Error updating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }




// Inside the fetchAndPopulateTasks function
async function fetchAndPopulateTasks() {
  try {
    const response = await fetch('http://localhost:3001/api/tasks');
    const tasks = await response.json();

    populateTaskList(tasks);
    attachDeleteListeners();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}
async function deleteTask(event) {
  console.log("line 127")
  const listItem = event.target.closest('.list-group-item');
  const taskId = listItem.dataset.taskId;

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the task from the UI
      listItem.remove();
      console.log('Task deleted successfully.');

      // Fetch and populate tasks again to update the list
      fetchAndPopulateTasks();
    } else {
      console.error('Error deleting task:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}




});

// Function to load the popup content


// Function to add a new task
async function addTask(task) {
  const response = await fetch('http://localhost:3001/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  return response.json();


  
}
function generateUniqueId() {
  // Example of generating a random string
  return Math.random().toString(36).substr(2, 9);
}