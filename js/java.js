// alert("this alert box");

var forms;
var inputs;
var exercises;
var workouts;
var draggableExercises;
var cardHeight;
var sidebarToggler = document.querySelector('#sidebar-toggler');
var editableItems;
// DRAGGING FUNCTIONS
var dragStartElement;
var parentElement;
var shiftWorkoutsBool;
var shiftExercisesBool;
var addExercisesBool;
var exercisesBool;

//FUNCTIONS TO BE RUN AT THE START

recalculate();

document.querySelector('.add-workout').addEventListener('click', event => {
	addWorkout();
});

sidebarToggler.addEventListener('click', event => {
	toggleSidebar();
});

document.addEventListener('submit', event => {
	forms.forEach((form, index) => {
	  	event.preventDefault();
		var text = inputs[index].value.trim();
	  	if (text !== '') {
		    addExercise(text, index);
		    inputs[index].value = '';
		    inputs[index].focus();
			}
		});
});

function recalculate() {
	forms = document.querySelectorAll('.new-exercise');
	inputs = document.querySelectorAll('.new-exercise-input');
	exercises = document.querySelectorAll('.exercise-list');
	workouts = document.querySelectorAll('.workout');
	draggableExercises = document.querySelectorAll('.item li, .item form');
	dragCheck();
	editableItems = document.querySelectorAll('.item li, .workout h4');
	editableCheck();
}




// DISPLAY EDIT ICONS
function editableCheck(){
	editableItems.forEach(editableItem => {
		editableItem.addEventListener('mouseover', event => {
			displayEditIcon(editableItem);
		});
		editableItem.addEventListener('mouseout', event => {
			hideEditIcon(editableItem);
		});
	});
}


function displayEditIcon(editableItem){
	editableItem.classList.add('active');
}

function hideEditIcon(editableItem){
	editableItem.classList.remove('active');
}


// TOGGLE SIDEBAR

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


// ADD EXERCISE


function addExercise(text, index) {   

	var exercise = {
		text: text,
		reps: 0,
		time: "",
		id: Date.now()
	};

	var exerciseHTML =	`<li data-key= ${exercise.id} draggable="true"> ${exercise.text} </li>`
	var formHTML = exercises[index].querySelector('.new-exercise');

	formHTML.insertAdjacentHTML('beforebegin', exerciseHTML);

    var scrollExercises = document.querySelectorAll(".scroll-exercises");
    scrollExercises[index].scrollTop = scrollExercises[index].scrollHeight;

    recalculate();
}


// ADD WORKOUT


function addWorkout(){

	var numberWorkouts = workouts.length;
	
	document.querySelector('.add-workout').insertAdjacentHTML('beforeBegin',
	`<div class="item workout">
		<h4>Workout ${numberWorkouts+1}</h4>
		<div class="scroll-exercises">
			<ul class="list-unstyled exercise-list">
				<form class="new-exercise">
					<input type="text" aria-label="New exercise" placeholder="New exercise" class="new-exercise-input">
				</form>
			</ul>
		</div>
	</div>`
	);

	recalculate();

	var numberInputs = inputs.length;

	inputs[numberInputs-1].focus();
}






// DRAGGING


function dragCheck(){
	draggableExercises.forEach((exercise, index) => {
		exercise.addEventListener('dragstart', event => dragStart(exercise));
		});
}

function dragStart(exercise) {
	cardHeight = exercise.offsetHeight;
	setTimeout(() => (exercise.classList.add('invisible')), 0);
	dragStartElement = exercise;
	exercisesBool = dragStartElement.closest('.item').classList.contains('exercises');
	draggableExercises.forEach(exercise => {
		exercise.addEventListener('dragend', event => dragEnd(exercise));
		exercise.addEventListener('dragenter', event => dragEnter(event, exercise, exercisesBool));
	});
}

function dragEnd(exercise) {
	shiftExercisesBool = (dragStartElement.closest('.item').classList.contains('exercises')) && (parentElement.closest('.item').classList.contains('exercises'));
	exercise.classList.remove('invisible');
	exercise.classList.remove('active');

	var cardPlaceholder = document.querySelector('.card-placeholder');

	if (cardPlaceholder != undefined){
		if (shiftWorkoutsBool || shiftExercisesBool){
			cardPlaceholder.replaceWith(exercise);
		}
		else{
			cardPlaceholder.replaceWith(exercise.cloneNode(true));
		}
		recalculate()
	}

}

function dragEnter(event, exercise) {

	parentElement = exercise;
	shiftWorkoutsBool = (dragStartElement.closest('.item').classList.contains('workout')) && (parentElement.closest('.item').classList.contains('workout'));
	addExercisesBool = (dragStartElement.closest('.item').classList.contains('exercises')) && (parentElement.closest('.item').classList.contains('workout'));

	if (addExercisesBool){
		dragStartElement.classList.remove('invisible');
	}
	else{
		dragStartElement.classList.add('invisible');
	}

	if (exercisesBool || shiftWorkoutsBool){

		var cardPlaceholderHTML = `<li class="card-placeholder" style="height:${cardHeight}px"></li>`;

		event.preventDefault();

		var cardPlaceholder = document.querySelector('.card-placeholder');

		if (cardPlaceholder != undefined){
			cardPlaceholder.remove();
			exercise.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
		}
		else {
			exercise.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
		}

		// if (document.querySelector('.card-placeholder') == undefined){
		// 	exercise.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
		// }
	cardPlaceholder = document.querySelector('.card-placeholder');

	cardPlaceholder.addEventListener('dragleave', event => dragLeave(cardPlaceholder));
	cardPlaceholder.addEventListener('dragover', event => dragOver(event));
	// cardPlaceholder.addEventListener('dragdrop', event => dragDrop());
	}
}


function dragOver(event) {
	event.preventDefault();
}

function dragLeave(cardPlaceholder) {
	if (cardPlaceholder != undefined){
		cardPlaceholder.remove();
	}
}

// function dragDrop() {
// }



// INCASE JQUERY BREAKS
// http://www.jquerybyexample.net/2010/06/call-jquery-from-javascript-function.html


