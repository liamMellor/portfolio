// Our audio context for the application
var context    = new (window.AudioContext || window.webkitAudioContext)();
var sound      = false;

// Our local list of tracks
var trackList = [ "sounds/Snare.mp3",
                  "sounds/Drums.mp3",
                  "sounds/Bass.mp3",
                  "sounds/Chords.mp3", 
                  "sounds/Horns.mp3",
                  "sounds/BackingVocal.mp3",
                  "sounds/MainVocals.mp3",       ];

// Mixer will be an array of channel with passed in buffers for each channel
var mixer;
var masterOut;

BufferLoader.prototype.loadBuffer = function(songPath) {
    var songRequest          = new XMLHttpRequest();
    songRequest.open("GET", songPath, true);
    songRequest.responseType = "arraybuffer";

    var loader = this;

    songRequest.onload = function() {
        loader.context.decodeAudioData(songRequest.response, function(buffer) {
            var name = songPath;
            var newName = name.slice(7, -4);
            buffer.name = newName;
            console.log(buffer.name);
            loader.bufferList.push(buffer);
            if (++loader.loadCount == loader.trackList.length) {
                loader.onload(loader.bufferList);
            }
        });
    }
    songRequest.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.trackList.length; ++i)
        this.loadBuffer(this.trackList[i]);
}

function BufferLoader(context, trackList, callback) {
    this.context    = context;
    this.trackList  = trackList;
    this.onload     = callback;
    this.bufferList = [];
    this.loadCount  = 0;
    this.load();
}

function loadedCallback(buffers) {
    masterOut =  new Fader(true);
    mixer     = [ new Channel(buffers[0]),
                  new Channel(buffers[1]), 
                  new Channel(buffers[2]), 
                  new Channel(buffers[3]), 
                  new Channel(buffers[4]),
                  new Channel(buffers[5]),
                  new Channel(buffers[6])  ];
    document.getElementById('name0').innerHTML = mixer[0].name;
    document.getElementById('name1').innerHTML = mixer[1].name;
    document.getElementById('name2').innerHTML = mixer[2].name;
    document.getElementById('name3').innerHTML = mixer[3].name;
    document.getElementById('name4').innerHTML = mixer[4].name;
    document.getElementById('name5').innerHTML = mixer[5].name;
    document.getElementById('name6').innerHTML = mixer[6].name;
    mixer.forEach(function(channel) {
        channel.connectAll();
    });
    masterOut.connectNode();
    document.getElementById("left").style.visibility = "visible";
}

// Inits bufferList with the buffers
var bufferLoader = new BufferLoader(context, trackList, loadedCallback);
