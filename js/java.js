// alert("this alert box");
// console.log(text);
// console.log(index);

var forms = document.querySelectorAll('.new-exercise');
var inputs = document.querySelectorAll('.new-exercise-input');
var exercises = document.querySelectorAll('.exercise-list');
var workouts = document.querySelectorAll('.workout');

var exerciseList = [];

var sidebarToggler = document.querySelector('#sidebar-toggler');
sidebarToggler.addEventListener('click', event => {
	toggleSidebar();
	}
);

document.addEventListener('submit', event => {
	forms.forEach((form, index) => {
	  	event.preventDefault();
		var text = inputs[index].value.trim();
	  	if (text !== '') {
		    addExercise(text, index);
		    inputs[index].value = '';
		    inputs[index].focus();
		}
	})
});

document.querySelector('.add-workout').addEventListener('click', event => {
	addWorkout();
});

function recalculate() {
	forms = document.querySelectorAll('.new-exercise');
	inputs = document.querySelectorAll('.new-exercise-input');
	exercises = document.querySelectorAll('.exercise-list');
	workouts = document.querySelectorAll('.workout');
}

function toggleSidebar() {
	var sidebar = document.querySelector('.exercises');
	if (sidebar.classList.contains('hide')) {
		sidebar.classList.remove('hide');
		sidebarToggler.innerHTML = "Hide Exercises";
	}
	else {
		sidebar.classList.add('hide');
		sidebarToggler.innerHTML = "Show Exercises";
	}
}


function addExercise(text, index) {   

	 var exercise = {
	 	text: text,
	 	reps: 0,
	 	time: "",
	 	id: Date.now()
	 };

	 exerciseList.push(exercise);

	 exercises[index].insertAdjacentHTML('beforeEnd', 
	 	'<li data-key=' + exercise.id + '>' +
			exercise.text +
		'</li>'
	 	);

     var scrollExercises = document.querySelectorAll(".scroll-exercises");
  
     scrollExercises[index].scrollTop = scrollExercises[index].scrollHeight;
}

function addWorkout(){

	var numberWorkouts = workouts.length;
	
	document.querySelector('.add-workout').insertAdjacentHTML('beforeBegin',
	`<div class="item workout">
		<h4>Workout ${numberWorkouts+1}</h4>
		<div class="scroll-exercises">
			<ul class="list-unstyled exercise-list">
			</ul>
			<form class="new-exercise">
				<input type="text" aria-label="New exercise" placeholder="New exercise" class="new-exercise-input">
				</form>
			</div>
		</div>`
		);
	recalculate();

	var numberInputs = inputs.length;

	inputs[numberInputs-1].focus();
}








var draggableExercises = document.querySelectorAll(".item li");

console.log(draggableExercises);

draggableExercises.forEach((exercise, index) => {
	dragElement(draggableExercises[index])
});

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(element.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}






