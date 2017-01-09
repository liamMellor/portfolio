function Track(channel, buffer) {
	var source;
	this.buffer     = buffer;
	this.isPlaying  = false;
	var isStarted   = false;
	var timeElapsed = 0;
	var timeStarted = 0;
	var timePaused  = 0;

	this.play = function() {
		if (!isStarted) {
			timeStarted = Date.now();
			isStarted   = true;
		}
		this.isPlaying = true;
		source         = context.createBufferSource();
		source.buffer  = this.buffer
		source.connect(channel.high.filter);
		source.start(0, timeElapsed)

	}
	this.pause = function() {
		if (!this.isPlaying) return;
		this.isPlaying = false;
		source.stop(0);
		timePaused  = Date.now();
		timeElapsed = (timePaused - timeStarted) / 1000;
	}
	this.reset = function() {
		this.isPlaying = false;
		if (source != null) {
			source.stop(0);
		}
		timeElapsed = 0;
		isStarted   = false;
	}


}


function Potentiometer(channel, type) {
	this.type      = type;
	this.rotation  = 0;
	this.val       = 0;
	this.filter;
	this.next;
	if (this.type == "high") {
		this.next        = channel.mid.filter; 
		this.filter      = context.createBiquadFilter();
		this.filter.type = "highshelf"
		this.filter.frequency.value = 2000;
	}
	else if (this.type == "mid") {
		this.next        = channel.bass.filter;
		this.filter      = context.createBiquadFilter();
		this.filter.type = "peaking";
		this.filter.frequency.value = 1200; 
	}
	else if (this.type == "bass") {
		this.next        = channel.pan.filter;
		this.filter      = context.createBiquadFilter();
		this.filter.type = "lowshelf";
		this.filter.frequency.value = 200;
	}
	else {  // pan
		this.next   = channel.fader.filter;
		this.filter = context.createStereoPanner();
		this.filter.pan.value = 0;
	}
	
	this.connectNode = function() {
		this.filter.connect(this.next);
	}
	this.updateValue = function(type) {
		if (type == "pan") {
			this.filter.pan.value = this.val
		}
		else {
			// this.filter.frequency.value = this.val;
			this.filter.gain.value = this.val;
		}
	}
}


function Fader(isMaster) {
	this.filter  = context.createGain();
	this.filter.gain.value = 4.8;
	this.next;
	if (isMaster) {
		this.next = context.destination;
	}
	else {
		this.next = masterOut.filter;
	}

	this.updateValue  = function(num) {
		this.filter.gain.value = num;
	}
	this.connectNode = function() {
		this.filter.connect(this.next);
	}
}



function Channel(buffer) {
	this.track  = new Track(this, buffer)
	this.fader  = new Fader(false);
	this.pan    = new Potentiometer(this, "pan");
	this.bass   = new Potentiometer(this, "bass");
	this.mid    = new Potentiometer(this, "mid");
	this.high   = new Potentiometer(this, "high");	
	this.name   = buffer.name;
	
	// Methods
	this.play = function() {
		this.track.play();
	}
	this.pause = function() {
		this.track.pause();
	}
	this.connectAll = function() {
		this.high.connectNode();
		this.mid.connectNode();
		this.bass.connectNode();
		this.pan.connectNode();
		this.fader.connectNode();

	}
	this.reset = function() {
		this.track.reset();
	}
}


function soundCheck() {
	for (var i = 0; i < mixer.length; i++) {
		if (mixer[i].track.isPlaying) {
			var hr = document.getElementsByClassName("yellow");
			for (i = 0; i < 2; i++) {
				hr[i].style.backgroundColor = "#DEE1E0";
			}
			return true;
		}
	}
	return false;
}

