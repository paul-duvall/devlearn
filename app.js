// *******************************************************************************
// Storage controller
// *******************************************************************************



// *******************************************************************************
// Task controller
// *******************************************************************************

const TaskCtrl = (function(){
  // Item constructor
  const Task = function(id, title, stage1, stage2, stage3, priority){
    this.title = title;
    this.stage1 = stage1;
    this.stage2 = stage2;
    this.stage3 = stage3;
    this.priority = priority;
  }
  

  // Data structure / state
  const data = {
    items: [
      {id: 0, title:'Create monkey site', stage1:'Research other sites', stage2:'Source images', stage3:'Learn flexbox', priority:'High'},
      {id: 1, title:'Learn React', stage1:'Complete Udemy Course', stage2:'Research hooks', stage3:'Select project', priority:'Medium'}
    ],
    // The task currently selected to be edited
    currentTask: null,
    // The stage currently selected to be added to current task tracking
    currentStage: null,
  }

  return {
    // Retrieves existing tasks from the data structure
    getItems: function(){
      return data.items;
    },
    // Adds new item to data structure
    addTask: function(title, ...info){
      console.log(title);
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
    // Form selectors
    taskTitle: '#taskTitle',
    taskStage1: '#taskStage1',
    taskStage2: '#taskStage2',
    taskStage3: '#taskStage3',
    taskPriority: '#taskPriority',
    taskSubmit: '#taskSubmit'
  }

  return {
    populateTasks: function(tasks) {
      html = '';

      tasks.forEach((task) => {
        let currentTask = document.createElement('div');
        currentTask.className = 'taskItem';
        currentTask.innerHTML = `
        <h4 class="taskTitle">${task.title}</h4>
        <p>Priority: ${task.priority}</p>
        <ul>
          <li class="taskStage">${task.stage1} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          <li class="taskStage">${task.stage2} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
          <li class="taskStage">${task.stage3} <i class="fas fa-check"></i> <i class="fas fa-sticky-note"></i></li>
        </ul>
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
    // Make UISelectors public
    getUISelectors: function(){
      return UISelectors;
    }
  }
})();



// *******************************************************************************
// App controller
// *******************************************************************************

const App = (function(TaskCtrl, UICtrl){

  // Event listeners function
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getUISelectors();

    // Add item event
    document.querySelector(UISelectors.taskSubmit).addEventListener('click', taskAddSubmit);
  }

  // Add task submit
  const taskAddSubmit = function(e){
    // Get the data submitted by user
    const formInput = UICtrl.getTaskInput();

    // Ensure that task has been given a title
    if(formInput.title !==''){
      // Add task
      const newTask = TaskCtrl.addTask(...formInput);
      console.log(newTask);
    } else {
      // Possibly add alert message in div under field
    }
    

    e.preventDefault(); 
  }


  return {
    init: function(){
      // Declare variable for list of tasls from data object 
      const tasks = TaskCtrl.getItems();
      
      // Populate UI with tasks
      UICtrl.populateTasks(tasks);

      // Load event listeners
      loadEventListeners();
    }
  }
})(TaskCtrl, UICtrl);



// *******************************************************************************
// End of app controller
// *******************************************************************************

// Initialise app
App.init();


// Get the modal
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("add");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}