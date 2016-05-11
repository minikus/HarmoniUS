$(document).ready(function(){

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var displayNoteTimeout;
var note;
var playedNotes = [];
var detune;
var pitch = null; //this shows the frequency of notes
var confidentToGuessNote = null;
var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = true;
var mediaStreamSource = null;
var detectorElem,
	canvasElem,
	waveCanvas,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount;

window.onload = function() {
	audioContext = new AudioContext();
	MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
	var request = new XMLHttpRequest();
	request.open("GET", "../assets/piano-C.wav", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  audioContext.decodeAudioData( request.response, function(buffer) {
	    	theBuffer = buffer;
		} );
	}
	request.send();

	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	DEBUGCANVAS = document.getElementById( "waveform" );
	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );

//why ondragenter when nothing is dragged?
	detectorElem.ondragenter = function () {
		this.classList.add("droptarget");
		return false; };
	detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
	detectorElem.ondrop = function (e) {
  		this.classList.remove("droptarget");
  		e.preventDefault();
		theBuffer = null;

	  	var reader = new FileReader();
	  	reader.onload = function (event) {
	  		audioContext.decodeAudioData( event.target.result, function(buffer) {
	    		theBuffer = buffer;
	  		}, function(){alert("error loading!");} );
	  	};
	  	reader.onerror = function (event) {
	  		alert("Error: " + reader.error );
		};
	  	reader.readAsArrayBuffer(e.dataTransfer.files[0]);
	  	return false;
	};
}

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );
		displayAveragePitch();
    updatePitch();
}

$('#playOscillator').on('click', function(){
	toggleOscillator();
	// this.innerText = "Stop Oscillator";
});
$('#playSample').on('click', function(){
	togglePlayback();
	// this.innerText = "Stop Sample";
});
$('#playLiveInput').on('click', function(){
	toggleLiveInput();
	// this.innerText = "Stop Live Input";
});

function toggleOscillator() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
				stopNoteDisplay();
				if (!window.cancelAnimationFrame){
					window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
				}
      	window.cancelAnimationFrame( rafID );
        return "Oscillator";
    }
    sourceNode = audioContext.createOscillator();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start(0);
    isPlaying = true;
    isLiveInput = false;
		displayAveragePitch();
    updatePitch();

    return "Stop Oscillator";
}

function toggleLiveInput() {
    if (isPlaying) {
        //stop playing and return
        // mediaStreamSource.close(); //sourceNode.stop( 0 );
        // mediaStreamSource = null; //sourceNode = null;
				//audioContext.close();
        analyser = null;
				mediaStreamSource.disconnect(); // disconnects the microphone stram on stop.
        isPlaying = false;
				stopNoteDisplay();
				if (!window.cancelAnimationFrame){
					window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
				}
        window.cancelAnimationFrame( rafID );
				return "Live Input"
    }
		isPlaying = true;
    getUserMedia(
    	{
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
				return "Stop Input"
}

function togglePlayback() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
				stopNoteDisplay();
				if (!window.cancelAnimationFrame){
					window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
				}
	      window.cancelAnimationFrame( rafID );
	      return "Sample";
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = theBuffer;
    sourceNode.loop = true;

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start( 0 );
    isPlaying = true;
    isLiveInput = false;
		displayAveragePitch();
    updatePitch();

    return "Stop Sample";
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Float32Array( buflen );

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.

function autoCorrelate( buf, sampleRate ) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1,
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}

function updatePitch( time ) {
	var cycles = new Array;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );
	// TODO: Paint confidence meter on canvasElem here.

	if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
		waveCanvas.clearRect(0,0,512,256);
		waveCanvas.strokeStyle = "blue";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,0);
		waveCanvas.lineTo(0,256);
		waveCanvas.moveTo(128,0);
		waveCanvas.lineTo(128,256);
		waveCanvas.moveTo(256,0);
		waveCanvas.lineTo(256,256);
		waveCanvas.moveTo(384,0);
		waveCanvas.lineTo(384,256);
		waveCanvas.moveTo(512,0);
		waveCanvas.lineTo(512,256);
		waveCanvas.stroke();
		waveCanvas.strokeStyle = "black";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,buf[0]);
		for (var i=1;i<512;i++) {
			waveCanvas.lineTo(i,128+(buf[i]*128));
		}
		waveCanvas.stroke();
	}

 	if (ac == -1) {
		confidentToGuessNote = false;
 	} else {
		confidentToGuessNote = true;
	 	pitch = ac;
		//console.log("ac: ", ac)
	 	note =  noteFromPitch( pitch );
		// console.log("note: ", note)
		detune = centsOffFromPitch( pitch, note );
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	}
	rafID = window.requestAnimationFrame( updatePitch );

}

var displayAveragePitch = function (){
	if (pitch){
	 //console.log(pitch);
		if (confidentToGuessNote === false) {
			detectorElem.className = "vague";
			pitchElem.innerText = "--";
			noteElem.innerText = "-";
			detuneElem.className = "";
			detuneAmount.innerText = "--";
		}else{
			// we ARE confident to output a guess
			detectorElem.className = "confident";
			pitchElem.innerText = Math.round( pitch ) ;
			noteElem.innerHTML = noteStrings[note%12];
			console.log(noteStrings[note%12]);
			//

			if (detune == 0 ) {
				detuneElem.className = "";
				detuneAmount.innerHTML = "--";
			} else {
				if (detune < 0) {
					detuneElem.className = "flat";
				} else {
					detuneElem.className = "sharp";
				}
				detuneAmount.innerHTML = Math.abs( detune );

			}
			playedNotes.push(noteStrings[note%12]);
			console.log( playedNotes );

			$('#recordedNotes').empty();

			for (var i = 0; i*3 < playedNotes.length; i++) {
				var notes = playedNotes.slice(i * 3, i * 3 + 3);
				var $group = $('<div/>').addClass('appendedTriads').addClass('appendedTriads' + i).text(notes.join(', '));
				$('#recordedNotes').prepend($group);
			}

		}
	}
	displayTimeout = setTimeout(displayAveragePitch, 500);

}

var stopNoteDisplay = function(){
	if (displayTimeout){
		clearTimeout(displayTimeout);
		displayTimeout = 0;
	}
}

// console.log("frequency: ", frequency);
// var chordNotesCount = 0;
// var chordList = [];
// var currentChord = [];
// ​
// currentChord[ chordNotesCount++ ] = note;
// ​
// if(chordNotesCount > 2) {
//   chordList.push( currentChord );
//   chordNotesCount = 0;
// }

// var group2Notes = function(){
// 	if
// }


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-35593052-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

});
