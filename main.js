function plus(element) {
	var parent     = element.parentNode;
	var children   = parent.childNodes;
	var domPot     = children[3];
	var index      = domPot.getAttribute("data-channel");
	var type       = domPot.getAttribute("data-pot");
	var dataPot    = mixer[index][type];
	// Cannot go above 145
	if (dataPot.rotation == 150) { return; }
	// access pot in array
	dataPot.rotation += 5;
	if (type == "pan") {  
		dataPot.val += 0.032;
	}
	else {
		dataPot.val += 1;
	}
	dataPot.updateValue(type);
	// manipulate the DOM pot
	domPot.style.transform = 'rotate('+ dataPot.rotation + 'deg)';
}

function minus(element) {
	var parent     = element.parentNode;
	var children   = parent.childNodes;
	var domPot     = children[3];
	var index      = domPot.getAttribute("data-channel");
	var type       = domPot.getAttribute("data-pot");
	var dataPot    = mixer[index][type];
	// Cannot go below -145
	if (dataPot.rotation == -150) { return; }
	// access pot in array
	dataPot.rotation -= 5;
	if (type == "pan") {  
		dataPot.val -= 0.032;
	}
	else {
		dataPot.val -= 1;
	}
	dataPot.updateValue(type);
	// manipulate the DOM pot
	domPot.style.transform = 'rotate('+ dataPot.rotation + 'deg)';

}

function getFaderValue(element) {
	var index    = element.getAttribute("data-channel");
	var fraction = parseInt(element.value) / parseInt(element.max);
	var newValue = fraction * fraction;
	newValue*= 20;
	if (index == 7) {
		masterOut.updateValue(newValue);
	}
	else {
		mixer[index]["fader"].updateValue(newValue);
	}
}

function playPause(element) {
	var index   = element.getAttribute("data-channel");
	var channel = mixer[index];
	if (channel.track.isPlaying) {
		element.style.borderLeft = "24px solid #dee1e0";
		channel.pause();
		document.getElementById("masterPlayPause").style.borderLeft = "24px solid #dee1e0";
		var hr = document.getElementsByClassName("yellow");
		for (i = 0; i < 2; i++) {
			hr[i].style.backgroundColor = "#D3A30F";
		}
	}
	else {
		element.style.borderLeft = "24px solid green";
		channel.play();
	}
	sound = soundCheck();
}

function playAll(element) {
	var indexList = [0,1,2,3,4,5,6];
	var channel;
	var i;
	var playElements = document.getElementsByClassName("playPause");
	if (sound) {
		return;
	}
	else {
		for (i = 0; i < mixer.length; i++) {
			channel = mixer[indexList[i]];
			if (!channel.track.isPlaying) {
				playElements[i].style.borderLeft = "24px solid green";
				channel.play();
			}
		}
		element.style.borderLeft = "24px solid green";
		sound = soundCheck();
	}
}

function pauseAll(element) {
	var indexList = [0,1,2,3,4,5,6];
	var channel;
	var i;
	var playElements = document.getElementsByClassName("playPause");
	if (sound) {
		for (i = 0; i < mixer.length; i++) {
			channel = mixer[indexList[i]];
			if (channel.track.isPlaying) {
				playElements[i].style.borderLeft = "24px solid #dee1e0";
				channel.pause();
			}
		}
		var hr = document.getElementsByClassName("yellow");
		for (i = 0; i < 2; i++) {
			hr[i].style.backgroundColor = "#D3A30F";
		}
		document.getElementById("masterPlayPause").style.borderLeft = "24px solid #dee1e0";
		sound = soundCheck();
	}
	else {
		return;
	}
}

function reset() {
	mixer.forEach(function(channel) {
		channel.reset();
	});
	var playElements = document.getElementsByClassName("playPause");
	for (var i = 0; i < playElements.length; i++) {
		playElements[i].style.borderLeft = "24px solid #dee1e0";
	}
	document.getElementById("masterPlayPause").style.borderLeft = "24px solid #dee1e0";
	var hr = document.getElementsByClassName("yellow");
	for (i = 0; i < 2; i++) {
		hr[i].style.backgroundColor = "#D3A30F";
	}
	document.getElementById("masterPlayPause").style.borderLeft = "24px solid #dee1e0";
	sound = soundCheck();
}





