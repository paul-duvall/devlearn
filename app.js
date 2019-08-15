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
          item.stages = updatedTask.stages;
        }
      });
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
  const Task = function(id, title, stages, priority){
    this.id = id;
    this.title = title;
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
    addTask: function(title, stages, priority){
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
      let newTask = new Task(ID, title, stages, priority);
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
    setUpdatedTask: function(title, stages, priority) {
      let ID = data.currentTask.id;
      let updatedTask = new Task(ID, title, stages, priority);
      return updatedTask;
    },
    // Update the task in data.items
    updateTask: function(currentTask, updatedTask){
      data.items.forEach((item) => {
        if(item.id === updatedTask.id) {
          item.title = updatedTask.title;
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
    stagesContainer: '#stagesContainer',
    // Add / edit form selectors
    addBtn: '#add',
    modal: '#addModal',
    addModalClose: '#addModalClose',    
    // Form selectors
    modalTitle: '#modalTitle',
    addTaskForm: '#addTaskForm',
    taskTitle: '#taskTitle',
    taskStage: '.taskStage',
    currentTaskStage: '.currentTaskStage',
    addStageButton: '#addStageButton',
    taskPriority: '#taskPriority',
    taskSubmit: '#taskSubmit',
    taskEdit: '#taskEdit',
    taskDelete: '#taskDelete',
    // Task selectors
    editItem: '.fa-pen'    
  }

  // Creates a new empty stage field to be added to the add / edit modal form
  const createNewStage = function(stages){
    let container = document.createElement('div');
    container.setAttribute("id", `taskStage${stages.length + 1}`);

    let label = document.createElement('label');
    let labelText = document.createTextNode("Stage ");
    label.setAttribute("for", `task-stage${stages.length + 1}`);
    label.appendChild(labelText);

    let input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", `task-stage${stages.length + 1}`);
    input.setAttribute("id", `${stages.length + 1}`);
    input.setAttribute("class", "currentTaskStage");

    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  return {
    populateTasks: function(tasks) {
      // html = '';
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
        `;
        // Add stages to the task
        let stages = task.stages;
        stages.forEach((stage) => {
          currentTask.innerHTML += `
            <li class="taskStage">${stage} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          `;
        });
        currentTask.innerHTML += `
          </ul>
        </div>
        `;
        document.querySelector(UISelectors.tasksContainer).appendChild(currentTask);
      });
    },
    // Returns form user input
    getTaskInput: function(){

      // Create an array of stages
      let stagesValues = [];
      let stages = document.querySelectorAll('.currentTaskStage');
      stages.forEach((stage) => {
      let value = stage.value;
      stagesValues.push(value);
    });

      return {
        title: taskTitle.value,
        stages: stagesValues,
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
        `;
        // Add stages to the task
        let stages = newTask.stages;
        stages.forEach((stage) => {
          task.innerHTML += `
          <li class="taskStage">${stage} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          `;
        });
        task.innerHTML += `
          </ul>
          </div>
        `;
        // Insert item
        document.querySelector(UISelectors.tasksContainer).insertAdjacentElement('beforeend', task);  
    },
    // Add an additional stage to add / edit modal
    addStage: function(e){
      let stages = document.querySelectorAll(UISelectors.currentTaskStage);
      let newStage = createNewStage(stages);
      document.querySelector(UISelectors.stagesContainer).appendChild(newStage);
      e.preventDefault();
    },
    // Clear form fields
    clearForm: function(){
      taskTitle.value = '';
      taskPriority.value = '';
    },
    // Ensures that additional stage fields are not applied to subsequent tasks that are edited
    resetStagesFields: function(){
      let stagesContainer = document.getElementById('stagesContainer');
      stagesContainer.innerHTML = `
      <label for="task-stage1">Stage</label>
      <input type="text" name="task-stage1" id="taskStage1" class="currentTaskStage">
      `;
    },
    // Populates the form fields in the modal for editing
    populateModal: function(currentTask){
      taskTitle.value = currentTask.title;
      taskStages = currentTask.stages;

      let stagesContainer = document.querySelector('#stagesContainer');

      let stageTracker = 0;

      taskStages.forEach((stage) => {        
        if(stageTracker < taskStages.length && !stage==""){
          let newStage = document.createElement('div');
          // Populate first stage field
          if(stageTracker == 0){
            // Clear existing contents of StagesContainer
            document.querySelector(UISelectors.stagesContainer).innerHTML = '';
            // Set id of first stage
            newStage.setAttribute("id", `taskStage1`);
          } else {
            // Set id of subsequent stages
            newStage.setAttribute("id", `taskStage${stageTracker + 1}`);
          } 

          // Create the label for the current stage
          let label = document.createElement('label');
          let labelText = document.createTextNode("Stage ");
          label.setAttribute("for", `task-stage${stageTracker + 2}`);
          label.appendChild(labelText);

          // Create the input field for the current stage
          let input = document.createElement('input');
          input.setAttribute("type", "text");
          input.setAttribute("name", `task-stage${stageTracker + 2}`);
          input.setAttribute("id", `taskStage${stageTracker + 2}`);
          input.setAttribute("class", "currentTaskStage");
          input.setAttribute("value", `${stage}`);

          newStage.appendChild(label);
          newStage.appendChild(input);
          stagesContainer.appendChild(newStage);
        }
        stageTracker++;
      });
    },
    // Clears form, shows add button and hides edit / delete buttons for add state
    setAddState: function(){
      // Set title text
      document.querySelector(UISelectors.modalTitle).innerHTML = 'Add task';

      // Display appropriate buttons
      UICtrl.clearForm();
      document.querySelector(UISelectors.taskSubmit).style.display = 'inline';
      document.querySelector(UISelectors.taskEdit).style.display = 'none';
      document.querySelector(UISelectors.taskDelete).style.display = 'none';

    },
    setEditState: function(){
      // Set title text
      document.querySelector(UISelectors.modalTitle).innerHTML = 'Edit task';
      
      // Display appropriate buttons
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
    // Add an additional stage to add / edit modal
    document.querySelector(UISelectors.addStageButton).addEventListener('click', UICtrl.addStage);
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
    // Set form's initial fields (ensuring multiple stages don't appear if previously added by user)
    stagesContainer = document.getElementById('stagesContainer');
    let newInitialStage = document.createElement('div');
    newInitialStage.setAttribute("id", "taskStage1");

    let label = document.createElement('label');
    let labelText = document.createTextNode("Stage ");
    label.setAttribute("for", `task-stage1`);
    label.appendChild(labelText);

    let input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", `task-stage1`);
    input.setAttribute("id", `1`);
    input.setAttribute("class", "currentTaskStage");

    newInitialStage.appendChild(label);
    newInitialStage.appendChild(input);

    stagesContainer.innerHTML = '';
    stagesContainer.appendChild(newInitialStage);

    UICtrl.setAddState();
    e.preventDefault();
  }

  // Close the add task modal by clicking on the x
  const addModalCloseByX = function(e){
    addModal.style.display = "none";
    UICtrl.resetStagesFields();
    e.preventDefault();
  }

  // Add task submit
  const taskAddSubmit = function(e){
    // Get the data submitted by user
    const formInput = UICtrl.getTaskInput();  
    
    // Ensure that task has been given a title
    if(formInput.title !== ''){
      // Add task
      const newTask = TaskCtrl.addTask(formInput.title, formInput.stages, formInput.priority);
      console.log(newTask);
      // Add new task to the UI list
      UICtrl.addListItem(newTask);
      // Store in local storage
      StorageCtrl.storeItem(newTask);
      // Clear the form fields
      UICtrl.clearForm();
      // Close the modal window
      addModal.style.display = "none";
    } 
    else {
      // Possibly add alert message in div under field
    }
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
    const updatedTask = TaskCtrl.setUpdatedTask(formInput.title, formInput.stages, formInput.priority);
    
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