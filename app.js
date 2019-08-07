// *******************************************************************************
// Storage controller
// *******************************************************************************

const StorageCtrl = (function(){
  // Public methods
  return {
    // Runs when a new task is added by the user, adding it also to the ls
    storeItem: function(newItem){
      let items = [];
      // Check to see if there are already items in local storage
      if(localStorage.getItem('items') === null) {
        // Runs if there are no items currently in local storage
        items = [];
        // Pus new items
        items.push(newItem);
        // set local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(newItem);
        // Reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    // Edit item in ls
    editItemInLS: function(updatedTask) {
      let items = StorageCtrl.getItemsFromLS();
      items.forEach((item) => {
        if(item.id === updatedTask.id) {
          item.title = updatedTask.title;
          item.stage1 = updatedTask.stage1;
          item.stage2 = updatedTask.stage2;
          item.stage3 = updatedTask.stage3;
          item.stages = updatedTask.stages;
        }
      });
      console.log(updatedTask);
      console.log(items);
      // Reset local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    // Get items from the ls, updating the UI with those items
    getItemsFromLS: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})();


// *******************************************************************************
// Task controller
// *******************************************************************************

const TaskCtrl = (function(){
  // Item constructor
  const Task = function(id, title, stage1, stage2, stage3, stages, priority){
    this.id = id;
    this.title = title;
    this.stage1 = stage1;
    this.stage2 = stage2;
    this.stage3 = stage3;
    this.stages = stages;
    // this.priority = priority;
  }
  

  // Data structure / state
  const data = {
    items: StorageCtrl.getItemsFromLS(),
    // items: [
    //   {id: 0, title:'Create monkey site', stage1:'Research other sites', stage2:'Source images', stage3:'Learn flexbox', priority:'High'},
    //   {id: 1, title:'Learn React', stage1:'Complete Udemy Course', stage2:'Research hooks', stage3:'Select project', priority:'Medium'}
    // ],
    // The task currently selected to be edited
    currentTask: null,
    // The changes made to the current task that need to be applied
    updatedTask: null,
    // The stage currently selected to be added to current task tracking
    currentStage: null,
  }

  return {
    // Retrieves existing tasks from the data structure
    getItems: function(){
      return data.items;
    },
    // Adds new item to data structure
    addTask: function(title, stage1, stage2, stage3, stages, priority){
      let ID;
      // Create ID for task being added
      if(data.items.length > 0){
        // ID is set to 1 more than the id of the last item present
        ID = data.items[data.items.length - 1].id +1;
      } else {
        // If there are no tasks already present, set this first task to have an id of 0
        ID = 0;
      }

      // Create new task in data structure
      let newTask = new Task(ID, title, stage1, stage2, stage3, stages, priority);
      // Add newly create task to the items array
      data.items.push(newTask);
      return newTask;      
    },
    // Sets currentTask in data to the task selected from the UI
    setCurrentTask: function(currentItemID){
      // checks each item in data structure to see if it matched item in UI
      data.items.forEach((item) => {
        // If matches, set item to currentTask
        if(item.id == currentItemID){
          data.currentTask = item;
        }
      }); 
    },
    setUpdatedTask: function(title, stage1, stage2, stage3, stages, priority) {
      let ID = data.currentTask.id;
      let updatedTask = new Task(ID, title, stage1, stage2, stage3, stages, priority);
      return updatedTask;
    },
    // Update the task in data.items
    updateTask: function(currentTask, updatedTask){
      data.items.forEach((item) => {
        if(item.id === updatedTask.id) {
          item.title = updatedTask.title;
          item.stage1 = updatedTask.stage1;
          item.stage2 = updatedTask.stage2;
          item.stage3 = updatedTask.stage3;
          item.stages = updatedTask.stages;
        }
      });
    },
    // Make currentTask public
    getCurrentTask: function(){
      return data.currentTask;
    },
    logData: function(){
      return data;
    }
  }

})();



// *******************************************************************************
// UI controller
// *******************************************************************************

const UICtrl = (function(){
  // Object contains references to the various selectors needed within the UI Controller (allows these to be easily changed in html as only needs to be edited here in js)
  const UISelectors = {
    tasksContainer: '.tasksContainer',
    // Add / edit form selectors
    addBtn: '#add',
    modal: '#addModal',
    addModalClose: '#addModalClose',    
    // Form selectors
    taskTitle: '#taskTitle',
    taskStage1: '#taskStage1',
    taskStage2: '#taskStage2',
    taskStage3: '#taskStage3',
    taskPriority: '#taskPriority',
    taskSubmit: '#taskSubmit',
    taskEdit: '#taskEdit',
    taskDelete: '#taskDelete',
    // Task selectors
    editItem: '.fa-pen'    
  }

  return {
    populateTasks: function(tasks) {
      html = '';
      document.querySelector(UISelectors.tasksContainer).innerHTML = '';

      tasks.forEach((task) => {
        let currentTask = document.createElement('div');
        currentTask.className = 'card m-3';
        currentTask.setAttribute("data-id", task.id);
        currentTask.innerHTML = `
        <div class="card-body">
          <h4 class="taskTitle">${task.title}  <i class="fas fa-pen"></i></h4>
          <p>Priority: ${task.priority}</p>
          <ul>
            <li class="taskStage">${task.stage1} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
            <li class="taskStage">${task.stage2} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
            <li class="taskStage">${task.stage3} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          </ul>
        </div>
        `;
        document.querySelector(UISelectors.tasksContainer).appendChild(currentTask);
      });
    },
    // Returns form user input
    getTaskInput: function(){
      return {
        title: taskTitle.value,
        stage1: taskStage1.value,
        stage2: taskStage2.value,
        stage3: taskStage3.value,
        priority: taskPriority.value
      }
    },    
    // Add new item to the UI
    addListItem: function(newTask){
      let task = document.createElement('div');
      task.className = 'card m-3';
      task.id = `item-${newTask.id}`;
      task.innerHTML = `
        <div class="card-body">
          <h4 class="taskTitle">${newTask.title}<i class="fas fa-pen"></i></h4>
          <p>Priority: ${newTask.priority}</p>
          <ul>
            <li class="taskStage">${newTask.stage1} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
            <li class="taskStage">${newTask.stage2} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
            <li class="taskStage">${newTask.stage3} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          </ul>
        </div>
        `;
        // Insert item
        document.querySelector(UISelectors.tasksContainer).insertAdjacentElement('beforeend', task);  
    },
    // Clear form fields
    clearForm: function(){
      taskTitle.value = '';
      taskStage1.value = '';
      taskStage2.value = '';
      taskStage3.value = '';
      taskPriority.value = '';
    },
    // Populates the form fields in the modal for editing
    populateModal: function(currentTask){
      taskTitle.value = currentTask.title;
      taskStage1.value = currentTask.stage1;
      taskStage2.value = currentTask.stage2;
      taskStage3.value = currentTask.stage3;
    },
    // Clears form, shows add button and hides edit / delete buttons for add state
    setAddState: function(){
      UICtrl.clearForm();
      document.querySelector(UISelectors.taskSubmit).style.display = 'inline';
      document.querySelector(UISelectors.taskEdit).style.display = 'none';
      document.querySelector(UISelectors.taskDelete).style.display = 'none';

    },
    setEditState: function(){
      document.querySelector(UISelectors.taskSubmit).style.display = 'none';
      document.querySelector(UISelectors.taskEdit).style.display = 'inline';
      document.querySelector(UISelectors.taskDelete).style.display = 'inline';
    },
    // Make UISelectors public
    getUISelectors: function(){
      return UISelectors;
    }
  }
})();


// *******************************************************************************
// App controller
// *******************************************************************************

const App = (function(TaskCtrl, StorageCtrl, UICtrl){
  // Event listeners function
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getUISelectors();
    // Open modal event
    document.querySelector(UISelectors.addBtn).addEventListener('click', addModalOpen);
    // Close modal with x event
    document.querySelector(UISelectors.addModalClose).addEventListener('click', addModalCloseByX);
    // Add item event
    document.querySelector(UISelectors.taskSubmit).addEventListener('click', taskAddSubmit);
    // Edit an item event
    document.querySelectorAll(UISelectors.editItem).forEach(function(item){
      item.addEventListener('click', setEditState);
    });
    // Apply edit changes event
    document.querySelector(UISelectors.taskEdit).addEventListener('click', applyChanges);
  }

  // Open the add task modal
  const addModalOpen = function(e){  
    addModal.style.display = "block";
    UICtrl.setAddState();
    e.preventDefault();
  }

  // Close the add task modal by clicking on the x
  const addModalCloseByX = function(e){
    addModal.style.display = "none";
    e.preventDefault();
  }

  // Add task submit
  const taskAddSubmit = function(e){
    // Get the data submitted by user
    const formInput = UICtrl.getTaskInput();
    // Ensure that task has been given a title
    if(formInput.title !== ''){
      // Add task
      const newTask = TaskCtrl.addTask(formInput.title, formInput.stage1, formInput.stage2, formInput.stage3, formInput.priority);
      // Add new task to the UI list
      UICtrl.addListItem(newTask);
      // Store in local storage
      StorageCtrl.storeItem(newTask);
      // Clear the form fields
      UICtrl.clearForm();
      // Close the modal window
      addModal.style.display = "none";
    } 
    // else {
    //   // Possibly add alert message in div under field
    // }
    e.preventDefault(); 
  }

  // Open modal to edit existing item
  const setEditState = function(e){
    // Get the ID of the task selected in the UI
    let currentItemID = e.path[3].getAttribute("data-id");
    // Set the current task in the data structure to match
    TaskCtrl.setCurrentTask(currentItemID);
    // Get the current task
    let currentTask = TaskCtrl.getCurrentTask();
    // Populates add item model with data from item to be edited
    UICtrl.populateModal(currentTask);
    // Set edit state
    UICtrl.setEditState();
    // Show modal
    addModal.style.display = "block";
  }

  // Apply changes to existing item
  const applyChanges = function(e){
    e.preventDefault();
    // Get the updated data submitted by user
    const formInput = UICtrl.getTaskInput();
    // Set updatedTask in data structure
    const updatedTask = TaskCtrl.setUpdatedTask(formInput.title, formInput.stage1, formInput.stage2, formInput.stage3, formInput.priority);
    
    let currentTask = TaskCtrl.getCurrentTask();  
    TaskCtrl.updateTask(currentTask, updatedTask);
    StorageCtrl.editItemInLS(updatedTask);
    addModal.style.display = "none";
    App.init();
  }

  return {
    init: function(){
      // Declare variable for list of tasks from data object 
      const tasks = TaskCtrl.getItems();
      // Populate UI with tasks
      UICtrl.populateTasks(tasks);
      // Load event listeners
      loadEventListeners();
    }
  }
})(TaskCtrl, StorageCtrl, UICtrl);

// Initialise app
App.init();