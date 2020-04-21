$(document).ready(function() {
    console.log( "ready!" );
});


// alert("this alert box");

var forms;
var inputs;
var exercises;
var workouts;
var numberWorkouts;
var draggableExercises;
var cardHeight;
var sidebarToggler = document.querySelector('#sidebar-toggler');
var editableItems;
var editIcons;
var deleteIcons;
var editingExercise;
// DRAGGING FUNCTIONS
var dragStartElement;
var parentElement;
var shiftWorkoutsBool;
var shiftExercisesBool;
var addExercisesBool;
var exercisesBool;


//FUNCTIONS TO BE RUN AT THE START

recalculate();


// HTML




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
	numberWorkouts = workouts.length;
	draggableExercises = document.querySelectorAll('.item li, .item form');
	dragCheck();
	displayIcons();
	editExercise();
	deleteExercise();
	addReps();
	addTime();
}




// DISPLAY ICONS

function displayIcons(){
	$('.item li, .workout-title').mouseenter(function(){
		$(this).addClass('active');
		$(this).mouseleave(function(){
			$(this).removeClass('active');
		});
	});

	$(".icon-more").mouseenter(function(){
		var moreMenu = $(this).parent().next();
		moreMenu.css("visibility", "visible");
		$(moreMenu).mouseleave(function(){
			moreMenu.css("visibility", "hidden");
		});
		$(moreMenu.parent()).mouseleave(function(){
			moreMenu.css("visibility", "hidden");
		});
	});
}

// ICONS CODE

// EDIT EXERCISE

function editExercise(){
	$(".icon-edit").click(function(){
		event.stopImmediatePropagation();
		var editingExercise = $(this).closest("li").children()[0];
		if (editingExercise==undefined){
			editingExercise = $(this).closest(".workout-title").children()[0];
		}
		
		editContent(editingExercise);

		$(editingExercise).keydown(function(){
			if (event.key == 'Enter' && !event.shiftKey){
			editingExercise.setAttribute("contentEditable", "false");
			}
		});
		$(document).one("click", function(){
			var isClickInside = editingExercise.contains(event.target);
			if (!isClickInside){
				editingExercise.setAttribute("contentEditable", "false");
			}
		});
	});
}
	// editIcons.forEach(icon => {
	// 	icon.addEventListener('click', event => {
	// 		event.stopImmediatePropagation();
	// 		editingExercise = icon.parentNode.parentNode.firstElementChild;
	// 		editingExercise.setAttribute("contentEditable", "true");
	// 		editingExercise.focus();
	// 		// Decide on where to place cursor
	// 		var range = document.createRange();
	// 		range.setStart(editingExercise.lastChild, editingExercise.lastChild.length);
	// 		// Set selection
	// 		var sel = window.getSelection();
	// 		sel.removeAllRanges();
	// 		sel.addRange(range);

	// 		window.addEventListener('click', event => exitEditExercise(event, editingExercise, {once:true}));
	// 		editingExercise.addEventListener('keydown', event => exitEditExercise(event, editingExercise, { once: true }));	

	// 	});
	// });


// function exitEditExercise(event, editingExercise){
// 	var isClickInside = editingExercise.contains(event.target);
// 	if (!isClickInside){
// 		editingExercise.setAttribute("contentEditable", "false");
// 	}
// 	if (event.key == 'Enter' && !event.shiftKey){
// 		editingExercise.setAttribute("contentEditable", "false");
// 	}
// }


// DELETE EXERCISE

function deleteExercise(){
	$(".icon-delete").unbind().click(function(){
		var deletingExercise = $(this).closest("li");
		if (deletingExercise.length==0){
			deletingExercise = $(this).closest(".workout");
		}
		deletingExercise.remove();
		recalculate();
	});
}

// ADD REPS

function addReps(){
	$(".icon-rep").unbind().click(function(){
		event.stopImmediatePropagation();
		var editingExercise = $(this).closest("li").find("span")[1];
		$(editingExercise).closest(".reps").css("display", "block");
		editContent(editingExercise);
		
		finishEdit(editingExercise);
	});
}

// ADD TIME

function addTime(){
	$(".icon-time").unbind().click(function(){
		event.stopImmediatePropagation();
		var editingExercise = $(this).closest("li").find("span")[3];
		$(editingExercise).closest(".reps").css("display", "block");
		
		editContent(editingExercise);
		
		finishEdit(editingExercise);
	});
}

// EDIT EXERCISE

function editContent(editingItem){
	editingItem.setAttribute("contentEditable", "true");
	editingItem.focus();
	if (editingItem.lastChild != null){
		// Decide on where to place cursor
		var range = document.createRange();
		range.setStart(editingItem.lastChild, editingItem.lastChild.length);
		// Set selection
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

function finishEdit(editingExercise){
		$(editingExercise).unbind().keydown(function(){
			event.stopImmediatePropagation();
			if (event.key == 'Enter' && !event.shiftKey){
				editingExercise.setAttribute("contentEditable", "false");
				checkContent(editingExercise);
			}
		});
		$(document).unbind().click(function(){
			var isClickInside = editingExercise.contains(event.target);
			if (!isClickInside){
				editingExercise.setAttribute("contentEditable", "false");
				checkContent(editingExercise);
			}
		});
}

function checkContent(editingItem){
	if (isNaN(editingItem.innerHTML)){
		alert('Please enter a number');
		editingItem.setAttribute("contentEditable", "false");
	}
	if (editingItem.innerHTML==""){
		$(editingItem).closest(".reps").css("display", "none");
	}
}

// function displayIcons(){
// 	editableItems.forEach(editableItem => {
// 		editableItem.addEventListener('mouseover', event => {
// 			displayIcons(editableItem);
// 		});
// 		editableItem.addEventListener('mouseout', event => {
// 			hideIcons(editableItem);
// 		});
// 	});
// }


// function displayIcons(editableItem){
// 	editableItem.classList.add('active');
// }

// function hideIcons(editableItem){
// 	editableItem.classList.remove('active');	
// }


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

	var exerciseHTML =	`<li data-key= ${exercise.id} draggable="true">
							<div>${exercise.text}</div>
							<div class="list-card-operation">
								<i class='material-icons icon-delete'></i>
								<i class='material-icons icon-edit'></i>
							</div>
						</li>`

	var formHTML = exercises[index].querySelector('.new-exercise');

	formHTML.insertAdjacentHTML('beforebegin', exerciseHTML);

    var scrollExercises = document.querySelectorAll(".scroll-exercises");
    scrollExercises[index].scrollTop = scrollExercises[index].scrollHeight;

    recalculate();
}


// ADD WORKOUT


function addWorkout(){
	var newWorkout = `<div class="item workout">
		<div class="workout-title">
			<h4>Workout ${numberWorkouts+1}</h4>
			<div class="list-card-operation">
				<i class='material-icons icon-delete'></i>
				<i class='material-icons icon-edit'></i>
			</div>
		</div>
		<div class="scroll-exercises">
			<ul class="list-unstyled exercise-list">
				<form class="new-exercise">
					<input type="text" aria-label="New exercise" placeholder="New exercise" class="new-exercise-input">
				</form>
			</ul>
		</div>
	</div>`;
	
	document.querySelector('.add-workout').insertAdjacentHTML('beforeBegin', newWorkout);

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


