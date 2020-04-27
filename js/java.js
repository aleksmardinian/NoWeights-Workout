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
var sidebarToggler = document.querySelector('#sidebar-toggler');
var editableItems;
var editIcons;
var deleteIcons;
var editingExercise;



document.querySelector('.add-workout').addEventListener('click', event => {
	addWorkout();
});

sidebarToggler.addEventListener('click', event => {
	toggleSidebar();
});

// ADD ICONS TO EXISTING EXERCISES

icons($(".item li"));

//FUNCTIONS TO BE RUN AT THE START

recalculate();

document.addEventListener('submit', event => {
	event.stopImmediatePropagation();
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
	dragClone();
	displayIcons();
	editExercise();
	deleteExercise();
	addReps();
	addTime();
	addSet();
}




// DISPLAY ICONS

function icons(exercise){
	if (exercise.find(".icons").length == 0){
		exercise.append(	`<div class="exercise-properties">
									<div class="reps">
										<i class='material-icons icon-rep'></i><span>Reps:&nbsp</span><span></span>
									</div>
									<div class="reps">
										<i class='material-icons icon-time'></i><span>Time:&nbsp</span><span></span><span>s</span>
									</div>
								</div>
								<div class="icons">
									<div class="main-icons">
										<i class='material-icons icon-edit'></i>
										<i class='material-icons icon-more'></i>
									</div>
									<div class="more-icons">
										<i class='material-icons icon-edit'></i>
										<i class='material-icons icon-delete'></i>
										<i class='material-icons icon-time'></i>
										<i class='material-icons icon-rep'></i>
										<i class='material-icons icon-set'></i>
									</div>
								</div>`
		);
	}
}

function displayIcons(){
	$('.item li, .workout-title').mouseenter(function(){
		var exercise = $(this);
		exercise.addClass('active');
		exercise.mouseleave(function(){
			exercise.removeClass('active');
		});
		$(".icon-more").click(function(){
			event.stopImmediatePropagation();
			
			var moreMenu = $(this).parent().next();
			
			moreMenu.addClass('show');
			// moreMenu.animate({width: "50px"});

			$(moreMenu).mouseleave(function(){
				moreMenu.removeClass('show');
			});
			$(moreMenu.parent()).mouseleave(function(){
				moreMenu.removeClass('show');
			});
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
		var exercise = $(this).closest("li");
		var editingExercise = exercise.find("span")[1];
		$(editingExercise).closest(".reps").css("display", "block");
		editContent(editingExercise);
		finishEdit(editingExercise);
	});
}

// ADD TIME

function addTime(){
	$(".icon-time").unbind().click(function(){
		event.stopImmediatePropagation();
		var exercise = $(this).closest("li");
		var editingExercise = exercise.find("span")[3];
		$(editingExercise).closest(".reps").css("display", "block");
		editContent(editingExercise);
		finishEdit(editingExercise);
	});
}

// ADD SET

function addSet(){
	$(".icon-set, .icon-rem-set").unbind().click(function(){
		event.stopImmediatePropagation();
		var icon = $(this)

		var exercise = $(this).closest("li");

		// exercise.find('.icon-set, .icon-rem-set').toggleClass('icon-set icon-rem-set');


		if (!exercise.parent().hasClass("set-border")){
			exercise.find('.icon-set').toggleClass('icon-set icon-rem-set');
			if(!exercise.prev().hasClass("set-border")){
				exercise.removeClass
				exercise.wrap("<div class='set-border'></div>");
			}else{
				exercise.prev().append(exercise);
			}
		}else{
			exercise.find('.icon-rem-set').toggleClass('icon-set icon-rem-set');
			exercise.insertAfter(exercise.parent().prev())
		}

		$(".set-border").each(function(){
			if($(this).is(":empty")){
				$(this).remove();
			}
		});
	});

	$(".set-border").each(function(){
		$(this).find('.icon-set').toggleClass('icon-set icon-rem-set');
		if($(this).find("li").length == 0){
			$(this).remove();
		}
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

	$(".exercises").toggleClass("hide");
	
	if (sidebar.classList.contains('hide')) {
		$(".app").animate({left: "-250px"})
		sidebarToggler.innerHTML = "Show Exercises";
	}
	else {
		$(".app").animate({left: "0px"})
		sidebarToggler.innerHTML = "Hide Exercises";
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
						</li>`

	var formHTML = exercises[index].parentElement.querySelector('.new-exercise');

	$(formHTML).prev().append(exerciseHTML);

	newExercise = $(formHTML).prev().children().last();

	icons(newExercise);

    var scrollExercises = document.querySelectorAll(".scroll-exercises");
    scrollExercises[index].scrollTop = scrollExercises[index].scrollHeight;

    recalculate();
}


// ADD WORKOUT


function addWorkout(){
	var newWorkout = `<div class="item workout">
			<div class="workout-title">
				<h4>Workout ${numberWorkouts+1}</h4>
				<div class="title-icons">
					<i class='material-icons icon-delete'></i>
					<i class='material-icons icon-edit'></i>
				</div>
			</div>
			<ul class="list-unstyled exercise-list scroll-exercises">
			</ul>
				<form class="new-exercise">
					<input type="text" aria-label="New exercise" placeholder="New exercise" class="new-exercise-input">
				</form>
			</ul>
	</div>`;
	
	document.querySelector('.add-workout').insertAdjacentHTML('beforeBegin', newWorkout);

	recalculate();

	var numberInputs = inputs.length;

	inputs[numberInputs-1].focus();
}



// DRAGGING


var dragExercise;
var cloneExercise;
var targetExercise;
var exercisesBool;
var shiftExercisesBool;
var shiftWorkoutsBool;
var addExercisesBool;
var dragExercisesSource;
var targetExercisesSource;
var cardHeight;
var destination;
var x = 'here';

// $('.item li').on('dragstart', function() {
// 	return false;
// });

// function dragClone(){
// 	$(".item li, .set-border").each(function(index, exercise) {
// 		$(exercise).on('mousedown', function(){
			
// 			cloneExercise = exercise.cloneNode(true);
// 			$('body').append(cloneExercise)

// 			var shiftX = event.pageX - exercise.getBoundingClientRect().left;
// 			var shiftY = event.pageY - exercise.getBoundingClientRect().top;

// 			cloneExercise.style.position = 'absolute';
// 			cloneExercise.style.width = "216px";
// 			cloneExercise.style.zIndex = 1000;
// 			cloneExercise.style.left = event.pageX - shiftX + 'px';
// 			cloneExercise.style.top = event.pageY - shiftY + 'px';

// 			setTimeout(() => ($(exercise).addClass('invisible')), 0);

// 			$(document).on('mouseup', function(){
// 				$(cloneExercise).remove();
// 				$(exercise).removeClass('invisible');
// 				$(document).off('mousemove');
// 				$(document).off('mouseup');
// 			});

// 			$(document).on('mousemove', function(){
// 				event.preventDefault();
// 				cloneExercise.style.left = event.pageX - shiftX + 'px'; //NEED TO FIX SIDEBAR
// 				cloneExercise.style.top = event.pageY - shiftY + 'px';
// 			});
// 		});
// 	});
// }

// function dragCheck(){
// 	$(".item li, .set-border").each(function(index, exercise) {
// 		$(exercise).on('mousedown', function(){

// 			dragExercise = $(exercise);
// 			cloneExercise = exercise.cloneNode(true);
// 			$('body').append(cloneExercise)

// 			var shiftX = event.pageX - exercise.getBoundingClientRect().left;
// 			var shiftY = event.pageY - exercise.getBoundingClientRect().top;

// 			cloneExercise.style.position = 'absolute';
// 			cloneExercise.style.width = "216px";
// 			cloneExercise.style.zIndex = 1000;
// 			cloneExercise.style.left = event.pageX - shiftX + 'px';
// 			cloneExercise.style.top = event.pageY - shiftY + 'px';

// 			$(document).on('mouseup', function(){
// 				$(document).off('mousemove');
// 				$(document).off('mouseup');
// 			});
// 			$(document).on('mousemove', event => dragStart(event, cloneExercise, exercise, shiftX, shiftY));
// 			$(exercise).on('mouseover', event => dragEnter(event, exercise));
// 			$(exercise).on('mouseup', event => dragEnd(exercise));

// 		});
// 	});
// }

// function dragStart(event, cloneExercise, exercise, shiftX, shiftY) {
	
// 	event.preventDefault();

// 	dragExercisesSource = $(exercise).closest('.item');
// 	cardHeight = $(exercise).outerHeight();

// 	setTimeout(() => ($(exercise).addClass('invisible')), 0);
	
// 	// SET POSITION AND STYLE OF EXERCISE

// 	cloneExercise.style.left = event.pageX - shiftX + 'px'; //NEED TO FIX SIDEBAR
// 	cloneExercise.style.top = event.pageY - shiftY + 'px';

	
// }

// function dragEnter(event, exercise) {

// 	targetExercise = $(exercise);
// 	targetExercisesSource = targetExercise.closest('.item');
// 	shiftExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('exercises'));
// 	shiftWorkoutsBool = (dragExercisesSource.hasClass('workout')) && (targetExercisesSource.hasClass('workout'));
// 	addExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('workout'));
	
// 	console.log(x);

// 	if (addExercisesBool){
// 		dragExercise.removeClass('invisible');
// 	}
// 	else{
// 		dragExercise.addClass('invisible');
// 	}

// 	if (addExercisesBool || shiftExercisesBool || shiftWorkoutsBool){


// 		var cardPlaceholderHTML = `<li class="card-placeholder" style="height:${cardHeight}px"></li>`;

// 		event.preventDefault();

// 		var cardPlaceholder = document.querySelector('.card-placeholder');

// 		var destination = targetExercise.get(0);

// 		if (cardPlaceholder != undefined){
// 			cardPlaceholder.remove();
// 			if (targetExercise.get(0).tagName == "FORM"){
// 				destination = targetExercise.prev().get(0);
// 				destination.insertAdjacentHTML('beforeend', cardPlaceholderHTML);
// 			}else{
// 				destination.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
// 			}
			
// 		}else {
// 			if (targetExercise.get(0).tagName == "FORM"){
// 				destination = targetExercise.prev().get(0);
// 				destination.insertAdjacentHTML('beforeend', cardPlaceholderHTML);
// 			}else{
// 				destination.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
// 			}
// 		}

// 	cardPlaceholder = document.querySelector('.card-placeholder');

// 	cardPlaceholder.addEventListener('dragleave', event => dragLeave(cardPlaceholder));
// 	cardPlaceholder.addEventListener('dragover', event => dragOver(event));
// 	// cardPlaceholder.addEventListener('dragdrop', event => dragDrop());
// 	}
// 	exercise.off('mouseover');
// }


// function dragOver(event) {
// 	event.preventDefault();
// }

// function dragLeave(cardPlaceholder) {
// 	if (cardPlaceholder != undefined){
// 		cardPlaceholder.remove();
// 	}
// }

// function dragEnd(exercise) {

// 	event.preventDefault();
// 	event.stopImmediatePropagation();

// 	console.log('here');
	
// 	// dragExercise.removeClass('invisible');
// 	$(dragExercise).removeClass('active');

// 	var cardPlaceholder = document.querySelector('.card-placeholder');
	
// 	if (cardPlaceholder != undefined){
// 		if (shiftWorkoutsBool || shiftExercisesBool){
// 			cardPlaceholder.replaceWith(exercise);
// 		}
// 		else{
// 			cardPlaceholder.replaceWith(dragExercise);
// 		}
// 		recalculate()
// 	}

// 	$(document).off('mousemove');
// 	$(exercise).off('mouseup');

// 	// $(document).off('mouseover');
// 	// $(dragExercise).removeAttr('style');

// }





// NEW DRAG CODE

// $('.item li').on('dragstart', function() {
// 	return false;
// });

// $('.item li').draggable({
// 	// revert: 'false',
// 	appendTo: "body",
// 	class:
// 	zindex: 1000,
// 	helper: 'clone',
// 	width: "200px",
// });

// $('.exercise-list').sortable({
// 	addClasses:false,
// 	connectWith: ".exercise-list",
// 	connectWith: ".set-border"
// 	// receive: function (e, ui) {
//  	//   copyHelper = null;
//     // }
// });

// $('.set-border').sortable({
// 	connectWith: ".exercise-list"
// });

// $('.exercises-exercise-list').sortable({
// 	connectWith: ".exercise-list",
// 	forcePlaceholderSize: false,
//     helper: function (e, li) {
//         copyHelper = li.clone().insertAfter(li);
//         return li.clone();
//     },
//     stop: function () {
//         copyHelper && copyHelper.remove();
//     }
// });

// $('.item li').on('mousedown', function(event) {
// 	var shiftX = event.clientX - exercise.getBoundingClientRect().left;
// 	var shiftY = event.clientY - exercise.getBoundingClientRect().top;

// 	exercise.style.position = 'absolute';
// 	exercise.style.width = "216px";
// 	exercise.style.zIndex = 1000;
// 	// document.body.append(exercise);

// 	// moveAt(event.pageX, event.pageY);

// 	// moves the exercise at (pageX, pageY) coordinates
// 	// taking initial shifts into account
// 	function moveAt(pageX, pageY) {
// 		exercise.style.left = pageX - shiftX + 'px';
// 		exercise.style.top = pageY - shiftY + 'px';
// 	}

// 	function onMouseMove(event) {
// 		moveAt(event.pageX, event.pageY);
// 	}

// 	$(document).on('mousemove', onMouseMove);

// 	drop the exercise, remove unneeded handlers
// 	$(document).on('mouseup', function() {
// 		$(document).off('mousemove');
// 		$(document).off('mouseup');
// 	});

// });


//  OLD CODE IN CASE EVERYTHING GOES TITS UP

function dragCheck(){
	$(".item li, .set-border").each(function(index, exercise) {
		$(exercise).on('dragstart', event => dragStart(exercise));
	});
}

function dragStart(exercise) {
	dragExercise = $(exercise);
	dragExercisesSource = dragExercise.closest('.item');
	cardHeight = dragExercise.outerHeight();

	setTimeout(() => (dragExercise.addClass('invisible')), 0);
	
	$(".item li, .set-border, form").each(function(index, exercise) {
		$(exercise).on('dragenter', event => dragEnter(event, exercise));
		$(exercise).on('dragend', event => dragEnd(exercise));
	});
}

function dragEnd(exercise) {
	dragExercise.removeClass('invisible');
	dragExercise.removeClass('active');

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

	targetExercise = $(exercise);
	targetExercisesSource = targetExercise.closest('.item');
	shiftExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('exercises'));
	shiftWorkoutsBool = (dragExercisesSource.hasClass('workout')) && (targetExercisesSource.hasClass('workout'));
	addExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('workout'));
	

	if (addExercisesBool){
		dragExercise.removeClass('invisible');
	}
	else{
		dragExercise.addClass('invisible');
	}

	if (addExercisesBool || shiftExercisesBool || shiftWorkoutsBool){

		var cardPlaceholderHTML = `<li class="card-placeholder" style="height:${cardHeight}px"></li>`;

		event.preventDefault();

		var cardPlaceholder = document.querySelector('.card-placeholder');

		var destination = targetExercise.get(0);

		if (cardPlaceholder != undefined){
			cardPlaceholder.remove();
			if (targetExercise.get(0).tagName == "FORM"){
				destination = targetExercise.prev().get(0);
				destination.insertAdjacentHTML('beforeend', cardPlaceholderHTML);
			}else{
				destination.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
			}
			
		}else {
			if (targetExercise.get(0).tagName == "FORM"){
				destination = targetExercise.prev().get(0);
				destination.insertAdjacentHTML('beforeend', cardPlaceholderHTML);
			}else{
				destination.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
			}
		}

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


// INCASE JQUERY BREAKS
// http://www.jquerybyexample.net/2010/06/call-jquery-from-javascript-function.html

