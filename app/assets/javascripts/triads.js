
$(document).ready(function(){
  var inputKey;
  var octave;
  var key;

	$("#selectedKey").on('change',function(){
		//alert( $(this).val());
		osc.frequency.value = parseFloat( $(this).val() );
		// osc.detune.value = 500;
	})

	var audioContext = new AudioContext()
	var osc = audioContext.createOscillator()
	osc.frequency.value = 233.082
	osc.type = 'sine'
	osc.start();

	$('#playKey').click(function(){
		//osc.start(audioContext.currentTime)
		osc.connect(audioContext.destination)
	})
	$('#stopKey').click(function(){
		//osc.stop(audioContext.currentTime)
		osc.disconnect(audioContext.destination)
	})

	var playTriad = function(){
		var audioContext = new AudioContext()

			play(0, 3, 0.5);
			play(1, 10, 0.5);
			play(2, 15, 0.5);

		function play (delay, pitch, duration) {
		  var startTime = audioContext.currentTime + delay
		  var endTime = startTime + duration

		  var osc = audioContext.createOscillator();
		  osc.connect(audioContext.destination)
		  osc.detune.value = pitch * 100

		  osc.start(startTime)
		  osc.stop(endTime)
		}
	}
	$('#playTriad').click(function(){
		playTriad();
	})





  $("#inputKeyButton").on('click', function(){
    inputKey = ($('#inputKey').val()).toLowerCase();
    octave = $('#selectedOctave').val()
    key = inputKey + octave;
    console.log(key);
    console.log(teoria.chord(key));



  });



});
