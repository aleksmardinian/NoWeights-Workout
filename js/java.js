// alert("this alert box");

var forms = document.querySelectorAll('.new-exercise');
var inputs = document.querySelectorAll('.new-exercise-input');
var exercises = document.querySelectorAll('.exercise-list');
var workouts = document.querySelectorAll('.workout');
var draggableExercises = document.querySelectorAll('.item li, .item form');
var cardHeight;
var exerciseList = [];
var sidebarToggler = document.querySelector('#sidebar-toggler');

sidebarToggler.addEventListener('click', event => {
	toggleSidebar();
	}
);

dragCheck();

function recalculate() {
	forms = document.querySelectorAll('.new-exercise');
	inputs = document.querySelectorAll('.new-exercise-input');
	exercises = document.querySelectorAll('.exercise-list');
	workouts = document.querySelectorAll('.workout');
	draggableExercises = document.querySelectorAll('.item li, .item form');
	dragCheck();
}

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

	workout = exercises[index];

	exerciseList.push(exercise);

	var exerciseHTML =	`<li data-key= ${exercise.id} draggable="true"> ${exercise.text} </li>`
	var formHTML = exercises[index].querySelector('.new-exercise');

	console.log(exerciseHTML);
	console.log(formHTML);
	console.log(exercises);
	console.log(index);

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
		exercise.addEventListener('dragstart', dragStart);
		exercise.addEventListener('dragend', event => dragEnd(exercise));
		exercise.addEventListener('dragenter', event => dragEnter(event, exercise));
	});
}

function dragStart() {
	cardHeight = this.offsetHeight;
	setTimeout(() => (this.classList.add('invisible')), 0);
}

function dragEnd(exercise) {
	exercise.classList.remove('invisible');
	var cardPlaceholder = document.querySelector('.card-placeholder');

	if (cardPlaceholder!= undefined){
		// cardPlaceholder.parentNode.insertBefore(exercise, null)
		cardPlaceholder.replaceWith(exercise);
	}
}

function dragEnter(event, exercise) {
	var cardPlaceholderHTML = `<li class="card-placeholder" style="height:${cardHeight}px"></li>`;

	event.preventDefault();
	if (document.querySelector('.card-placeholder') == undefined){
		exercise.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
		console.log(exercise);
	}
	var cardPlaceholder = document.querySelector('.card-placeholder');
	cardPlaceholder.addEventListener('dragleave', event => dragLeave());
	cardPlaceholder.addEventListener('dragover', event => dragOver(event));
	cardPlaceholder.addEventListener('dragdrop', event => dragDrop());
}


function dragOver(event) {
	event.preventDefault();
}

function dragLeave() {
	console.log(1)
	if (document.querySelector('.card-placeholder') != undefined){
		document.querySelector('.card-placeholder').remove();
	}
}

function dragDrop() {
	console.log("DROPPED");
}






