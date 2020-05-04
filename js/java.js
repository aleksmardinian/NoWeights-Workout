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

var x = 'here';


document.querySelector('.add-workout').addEventListener('click', event => {
	addWorkout();
});

sidebarToggler.addEventListener('click', event => {
	toggleSidebar();
});

// ADD ICONS TO EXISTING EXERCISES

$(".item li").each(function(index, exercise){
	icons($(exercise));
});

$(".set-border").each(function(index, set){
	sets($(set));
});

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
	displayIcons();
	editExercise();
	deleteExercise();
	addReps();
	addTime();
	addSet();
	numberSet();
	addWeight();
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
								<div class="reps">
									<i class='material-icons icon-weight'></i><span>Weight:&nbsp</span><span></span><span>kg</span>
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
									<i class='material-icons icon-weight'></i>
									<i class='material-icons icon-add-set'></i>
								</div>
							</div>`
		);
	}
}

function sets(set){
	if(set.find(".set-sidebar").length == 0){
		set.prepend(	`<div class="set-sidebar">
								<div class="set-icons-arrows material-icons icon-more-set"></div>
								<div class="set-icons">
									<span class="stack-icons material-icons icon-set"></span>
								    <span class="stack-icons number-sets">1</span>
								    <span class="stack-icons material-icons icon-clear-set"></span>	
								</div>
								<div class="set-icons-arrows material-icons icon-less-set"></div>	
							</div>`
					);
	}
}

function displayIcons(){
	$('.item li, .workout-title, .set-border').mouseenter(function(){
		var exercise = $(this);
		exercise.addClass('active');
		if (exercise.hasClass('set-border') && exercise.find('li').length<2){
			exercise.removeClass('active');
		}
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

// ADD WEIGHT

function addWeight(){
	$(".icon-weight").unbind().click(function(){
		event.stopImmediatePropagation();
		var exercise = $(this).closest("li");
		var editingExercise = exercise.find("span")[6];
		$(editingExercise).closest(".reps").css("display", "block");
		editContent(editingExercise);
		finishEdit(editingExercise);
	});
}

// ADD SET

function addSet(){
	$(".icon-add-set, .icon-rem-set").unbind().click(function(){
		event.stopImmediatePropagation();
		var icon = $(this)

		var exercise = $(this).closest("li");

		if (!exercise.parent().hasClass("set-border")){
			exercise.find('.icon-add-set').toggleClass('icon-add-set icon-rem-set');
			if(!exercise.prev().hasClass("set-border")){
				exercise.wrap("<div class='set-border' draggable='true'></div>");
				sets(exercise.parent());
				recalculate();
			}else{
				exercise.prev().addClass("active")
				exercise.prev().append(exercise);
			}
		}else{
			exercise.find('.icon-rem-set').toggleClass('icon-add-set icon-rem-set');
			exercise.insertAfter(exercise.parent().prev());
			if(exercise.next().find("li").length == 0){
				exercise.next().remove();
			}
		}
	});

	$(".set-border").children().each(function(index, child){
		if($(child).hasClass('set-border')){
			$(child).after($(child).children());
		}
	});

	$(".set-border").each(function(){
		if($(this).find("li").length == 0){
			$(this).remove();
		}
	});

	$(".item li").each(function(index, exercise){
		if ($(exercise).parent().hasClass('set-border') && $(exercise).find('.icon-add-set').length!=0){
			$(exercise).find('.icon-add-set').toggleClass('icon-add-set icon-rem-set');
		}
		if (!$(exercise).parent().hasClass('set-border') && $(exercise).find('.icon-rem-set').length!=0){
			$(exercise).find('.icon-rem-set').toggleClass('icon-add-set icon-rem-set');
		}
	});

}

// ADD OR REMOVE SET

function numberSet(){
	$(".icon-more-set").unbind().click(function(){
		event.stopImmediatePropagation();
		
		var icon = $(this)
		var set = icon.next().find('.number-sets')

		var setNumber = parseInt($.trim(set.html()));
		if(setNumber<99){
			$(set).html(++setNumber);
		}
	});

	$(".icon-less-set").unbind().click(function(){
		event.stopImmediatePropagation();
		
		var icon = $(this);
		var set = icon.prev().find('.number-sets');

		var setNumber = parseInt($.trim(set.html()));
		if(setNumber>1){
			$(set).html(--setNumber);
		}
	});

	$(".set-icons").unbind().click(function(){
		event.stopImmediatePropagation();
		var icon = $(this);
		var set = icon.closest('.set-border').children().not(':first');

		set.insertAfter(set.parent().prev());
		recalculate();
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

// TOGGLE SIDEBAR

function toggleSidebar() {
	var sidebar = document.querySelector('.exercises');

	$(".exercises").toggleClass("hide");
	
	if (sidebar.classList.contains('hide')) {
		$(".app").animate({left: "-250px"});
		$(".app").width("calc( 100vw + 250px");
		// $(".app").width("150vw");
		sidebarToggler.innerHTML = "Show Exercises";
	}
	else {
		$(".app").animate({left: "0px"});
		setTimeout(function(){ 
			$(".app").width("100vw"); 
		}, 500);
		// $(".app").width("100vw");
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
var shiftExercisesBool = true;
var shiftWorkoutsBool = true;
var addExercisesBool;
var dragExercisesSource;
var targetExercisesSource;
var cardHeight;
var destination;
var insertAbove;
var insertBelow;
var insertTopSet;
var insertBottomSet;
var deadZone;
var isPlaceholder;
var cardPlaceholderHTML;

function dragCheck(){
	$(".item li, .set-border").each(function(index, exercise) {
		$(exercise).off('dragstart');
		$(exercise).on('dragstart', event => dragStart(exercise));
	});
}



function dragStart(exercise) {
	event.stopImmediatePropagation();

	dragExercise = $(exercise);
	dragExercisesSource = dragExercise.closest('.item');
	cardHeight = dragExercise.outerHeight();
	cardPlaceholderHTML = `<div class="card-placeholder" style="height:${cardHeight}px"></div>`;

	setTimeout(() => (dragExercise.addClass('invisible')), 0);
	setTimeout(() => (exercise.insertAdjacentHTML('afterend', cardPlaceholderHTML)), 0);
	

	$(document).on('dragover', event => dragOver());
	$(".exercises").on('dragenter', event => enterExercises(dragExercise));
	
	$(".item li, .set-border").each(function(index, exercise) {
		$(exercise).on('dragover', event => dragEnter(event, exercise));
		$(exercise).on('dragend', event => dragEnd(exercise));
	});

}

function dragOver() {
	event.stopImmediatePropagation();
	event.preventDefault();

}

function enterExercises(dragExercise){
	event.stopImmediatePropagation();
	event.preventDefault();

	addExercisesBool = false;

	if (dragExercisesSource.hasClass('exercises')){
		var cardPlaceholder = document.querySelector('.card-placeholder');
		if ($(cardPlaceholder).closest('.item').hasClass('workout')){
			$('.card-placeholder').remove();
		}
		dragExercise.addClass('invisible');
		var cardPlaceholder = document.querySelector('.card-placeholder');
		if (cardPlaceholder == undefined){
			console.log('here');
			dragExercise.get(0).insertAdjacentHTML('afterend', cardPlaceholderHTML);
		}
	}
}

function dragEnd(exercise) {
	// event.preventDefault();
	// event.stopImmediatePropagation();

	dragExercise.on('dragend', function() {
		return true;
	});

	dragExercise.removeClass('invisible');
	dragExercise.removeClass('active');

	var cardPlaceholder = document.querySelector('.card-placeholder');
	
	if (cardPlaceholder != undefined){
		if (addExercisesBool){
			cardPlaceholder.replaceWith(exercise.cloneNode(true));
		}
		else{
			cardPlaceholder.replaceWith(exercise);
			$(cardPlaceholder).remove();
		}
	}

	if (dragExercise.parent().hasClass('set-border') && dragExercise.parent().find('li').length>1){
		dragExercise.parent().addClass('active');
	}

	$(".item li, .set-border").each(function(index, exercise) {
		$(exercise).off('dragstart');
		$(document).off('dragover');
		$(".exercises").off('dragenter');
		$(exercise).off('dragover');
		$(exercise).off('dragend');
	});

	// dragExercise.on('dragend', function() {
	// 	return true;
	// });
	
	shiftExercisesBool = true;
	shiftWorkoutsBool = true;
	addExercisesBool = false;
	recalculate()

}

function dragEnter(event, exercise) {
	event.preventDefault();
	event.stopImmediatePropagation();

	targetExercise = $(exercise);
	targetExercisesSource = targetExercise.closest('.item');
	shiftExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('exercises'));
	shiftWorkoutsBool = (dragExercisesSource.hasClass('workout')) && (targetExercisesSource.hasClass('workout'));
	addExercisesBool = (dragExercisesSource.hasClass('exercises')) && (targetExercisesSource.hasClass('workout'));
	insertBelow = (event.pageY) > (exercise.getBoundingClientRect().top + $(exercise).outerHeight()/3) && (event.pageY) < (exercise.getBoundingClientRect().top + $(exercise).outerHeight()/2)
	insertAbove = (event.pageY) < (exercise.getBoundingClientRect().bottom - $(exercise).outerHeight()/3) && (event.pageY) > (exercise.getBoundingClientRect().bottom - $(exercise).outerHeight()/2)
	
	deadZone = (!insertBelow && !insertAbove);

	insertBottomSet = false;
	insertTopSet = false;

	if (targetExercise.hasClass('set-border')){
		insertBelow = (event.pageY) < (exercise.getBoundingClientRect().bottom) && (event.pageY) > (exercise.getBoundingClientRect().bottom - 3)
		insertBottomSet = (event.pageY) < (exercise.getBoundingClientRect().bottom - 3) && (event.pageY) > (exercise.getBoundingClientRect().bottom - 7)
		insertTopSet = (event.pageY) > (exercise.getBoundingClientRect().top + 3) && (event.pageY) < (exercise.getBoundingClientRect().top + 7)
		insertAbove = (event.pageY) > (exercise.getBoundingClientRect().top) && (event.pageY) < (exercise.getBoundingClientRect().top +3)
		
		deadZone = (!insertBelow && !insertAbove && !insertTopSet && !insertBottomSet );
	}

	var cardPlaceholder = document.querySelectorAll('.card-placeholder');
	var cardPlaceholderSource = $(cardPlaceholder).closest('.item');
	isPlaceholder = (cardPlaceholder != undefined);
	var destination = targetExercise.get(0);

	if (addExercisesBool){
		dragExercise.removeClass('invisible');
		if (cardPlaceholderSource.hasClass('exercises')){
			$(cardPlaceholder).remove();
		}
	}
	else{
		dragExercise.addClass('invisible');
	}

	if (addExercisesBool || shiftExercisesBool || shiftWorkoutsBool){


		if (!deadZone){
			if (isPlaceholder){
				$(cardPlaceholder).remove();
			}
			if (insertBottomSet){
				destination.insertAdjacentHTML('beforeend', cardPlaceholderHTML);
			}
			if (insertTopSet){
				destination.insertAdjacentHTML('afterbegin', cardPlaceholderHTML);
			}
			if (insertAbove){
				destination.insertAdjacentHTML('beforebegin', cardPlaceholderHTML);
			}

			if (insertBelow){
				destination.insertAdjacentHTML('afterend', cardPlaceholderHTML);
			}
		}
	}

	$(".item li, .set-border").each(function(index, exercise) {
		$(exercise).removeClass('active');
	});
}

// THINGS WENT TITS UP

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

// INCASE JQUERY BREAKS
// http://www.jquerybyexample.net/2010/06/call-jquery-from-javascript-function.html

