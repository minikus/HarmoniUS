
$(document).ready(function(){
  var inputKey;
  var octave;
  var key1;
  var key2;
  var key3;
  var scaleResult;
  var scaleType;

  var audioContext = new AudioContext()

///// Play Single Notes

	$("#selectedKey").on('change',function(){
		//alert( $(this).val());
		osc.frequency.value = parseFloat( $(this).val() );
		// osc.detune.value = 500;
	})

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


////// Play Triad

  var playTriad = function(){
			play(0, note1, 0.5);
			play(1, note2, 0.5);
			play(2, note3, 0.5);

		function play (delay, frequency, duration) {
		  var startTime = audioContext.currentTime + delay
		  var endTime = startTime + duration

		  var osc = audioContext.createOscillator();
		  osc.connect(audioContext.destination)
		  osc.frequency.value = frequency;

		  osc.start(startTime)
		  osc.stop(endTime)
		}
	}

  $("#playTriad").on('click', function(){
    inputKey = ($('#inputKey').val()).toLowerCase();
    octave = $('#selectedOctave').val()
    scaleType = $('#scaleType').val()

    key1 = teoria.note(inputKey + octave);
    scaleResult = key1.scale(scaleType).simple();

    if (inputKey === "f" || inputKey === "f#" || inputKey === "g" || inputKey === "g#"){
      key2 = teoria.note(scaleResult[2] + octave);
      octave = parseInt(octave) + 1
      key3 = teoria.note(scaleResult[4] + octave.toString());
    } else if (inputKey === "a" || inputKey === "a#" || inputKey === "b" || inputKey === "b#"){
      octave = parseInt(octave) + 1
      key2 = teoria.note(scaleResult[2] + octave);
      key3 = teoria.note(scaleResult[4] + octave.toString());

    } else {
      key2 = teoria.note(scaleResult[2] + octave);
      key3 = teoria.note(scaleResult[4] + octave);
    }

    note1 = key1.fq();
    note2 = key2.fq();
    note3 = key3.fq();

    scaleResult = scaleResult.join().toUpperCase().split(",");
      console.log(scaleResult)
    $("#scaleOutput").html(scaleResult.join(", "));

  });
  $('#playTriad').click(function(){
    playTriad();
    osc.disconnect(audioContext.destination);
  });



//////  play Scale

  // var playScale = function(){
	// 	var audioContext = new AudioContext()
	// 		play(0, note1, 0.3);
	// 		play(1, note2, 0.3);
	// 		play(2, note3, 0.3);
  //     play(3, note4, 0.3);
  //     play(4, note5, 0.3);
  //     play(5, note6, 0.3);
  //     play(6, note7, 0.3);
  //     play(7, note8, 0.3);
  //     play(8, note9, 0.3);
  //
  //
	// 	function play (delay, frequency, duration) {
	// 	  var startTime = audioContext.currentTime + delay
	// 	  var endTime = startTime + duration
  //
	// 	  var osc = audioContext.createOscillator();
	// 	  osc.connect(audioContext.destination)
	// 	  osc.frequency.value = frequency;
  //
	// 	  osc.start(startTime)
	// 	  osc.stop(endTime)
	// 	}
	// }
  //
  // $("#playScale").on('click', function(){
  //   inputKey = ($('#inputKey').val()).toLowerCase();
  //   octave = $('#selectedOctave').val()
  //   scaleType = $('#selectedScale').val()
  //
  //   key1 = teoria.note(inputKey + octave);
  //   scaleResult = key1.scale(scaleType).simple();
  //   key2 = teoria.note(scaleResult[2] + octave);
  //
  //   if (inputKey === "f"){
  //     octave += 1;
  //     key3 = teoria.note(scaleResult[4] + (octave);
  //   } else {
  //     key3 = teoria.note(scaleResult[4] + octave);
  //   }
  //
  //   note1 = key1.fq();
  //   note2 = key2.fq();
  //   note3 = key3.fq();
  //
  //   scaleResult = scaleResult.join().toUpperCase().split(",");
  //     console.log(scaleResult)
  //   $("#scaleOutput").append(scaleResult.join(", "));
  //
  // });
  // $('#playScale').click(function(){
  //   playScale();
  //   osc.disconnect(audioContext.destination)
  // });







});
