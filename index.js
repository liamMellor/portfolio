
var rowsContainer = document.getElementsByClassName('projects__rows');
var rowsContainer = rowsContainer[0];
rowsContainer.addEventListener("mouseover", function() {
	rowsContainer.classList.add('projects__rows--active');
});
rowsContainer.addEventListener("mouseleave", function() {
	rowsContainer.classList.remove('projects__rows--active');
});

var rows = document.getElementsByClassName('projects__row');
Array.prototype.forEach.call(rows, function(element) {
	element.addEventListener("mouseover", function() {
		element.classList.add('projects__row--active');
	});
	element.addEventListener("mouseleave", function() {
		element.classList.remove('projects__row--active');
	});
});
