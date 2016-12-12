
var rows = document.getElementsByClassName('projects__row')
Array.prototype.forEach.call(rows, function(element) {
	element.addEventListener("click", function() {
		var classes = element.classList;
		classes.contains('projects__row--open') ? classes.remove('projects__row--open') : classes.add('projects__row--open');
	});
});



