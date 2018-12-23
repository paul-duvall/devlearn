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
      {id: 0, title:'Create restaurant site', stage1:'Research other sites', stage2:'Source images', stage3:'Learn flexbox', priority:'High'},
      {id: 1, title:'Learn React', stage1:'Complete Udemy Course', stage2:'Research hooks', stage3:'Select project', priority:'Medium'}
    ],
    // The task currently selected to be edited
    currentTask: null,
    // The stage currently selected to be added to current task tracking
    currentStage: null,
  }

  return {
    getItems: function(){
      return data.items;
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
  
  return {
    populateTasks: function(tasks) {
      html = '';

      tasks.forEach((task) => {
        console.log(task);
        
      });
    }
  }
})();



// *******************************************************************************
// App controller
// *******************************************************************************

const App = (function(TaskCtrl, UICtrl){
  // console.log(TaskCtrl.logData());

  return {
    init: function(){
      // Declare variable for list of tasls from data object 
      const tasks = TaskCtrl.getItems();
      
      // Populate UI with tasks
      UICtrl.populateTasks(tasks);
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