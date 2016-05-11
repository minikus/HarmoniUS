
$(document).ready(function(){
  var inputKey;
  var octave;
  var octaveUp;
  var key1;
  var key2;
  var key3;
  var scaleResult;
  var scaleType;
  var key1Symbol;
  var key2Symbol;
  var key3Symbol;
  var key4Symbol;
  var key5Symbol;
  var key6Symbol;
  var key7Symbol;
  var key8Symbol;

  var audioContext = new AudioContext()

///// Click Keyboard to Hear Sounds
$(".pianoKey").on('mousedown', function(event){
  event.stopPropagation();
  var osc = audioContext.createOscillator();
  var playedKey = $(this).find('p').first().text().toLowerCase();
  // console.log($(this).hasClass('kb2'));


  var startTime = audioContext.currentTime
  var duration = 0.5
  var endTime = startTime + duration
  var envelope = audioContext.createGain() //the envelope creates a trailing/hollow effect
  envelope.connect(audioContext.destination)
  envelope.gain.value = 0.2
  envelope.gain.setTargetAtTime(1, startTime, 0.1)
  envelope.gain.setTargetAtTime(0, endTime, 0.2)
  osc.connect(envelope)

  if ($(this).hasClass('kb2')){
    playedKey = (playedKey + 5).toString()
    console.log(playedKey)
  }
  osc.frequency.value = (teoria.note(playedKey)).fq();
  osc.type = 'triangle';

  osc.connect(audioContext.destination)
  osc.start(audioContext.currentTime)
  osc.stop(audioContext.currentTime + 1)
});


///// Play Single Notes

	$("#selectedKey").on('change',function(){
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
var id = function (key) {
  return '#' + key.replace('#', '\\#');
};

  var playTriad = function(){
			play(0, note1, 0.5, function () {
        $(id(key1Symbol)).addClass("playing")
      });
      play(1, note2, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
			play(2, note3, 0.5, function () {
        $(id(key3Symbol)).addClass("playing");
      }, function () {
        $(id(key1Symbol)).removeClass("playing");
        $(id(key2Symbol)).removeClass("playing");
        $(id(key3Symbol)).removeClass("playing");
      });


		function play (delay, frequency, duration, beforeCallback, afterCallback) {

		  var startTime = audioContext.currentTime + delay
		  var endTime = startTime + duration

		  var osc = audioContext.createOscillator();
		  osc.connect(audioContext.destination)
		  osc.frequency.value = frequency;

		  osc.start(startTime);
      setTimeout(beforeCallback, delay * 1000);
		  osc.stop(endTime)
      setTimeout(afterCallback, (delay * 1000) + (duration * 1000));


      console.log(key1Symbol, key2Symbol, key3Symbol)
		}
	}

  $("#playTriad").on('click', function(){
    inputKey = ($('#inputKey').val()).toLowerCase();
    $(".rootNote").html(inputKey.toUpperCase());
    octave = $('#selectedOctave').val()
    octaveUp = (parseInt(octave) + 1).toString();
    scaleType = $('#scaleType').val()

    key1Symbol = (inputKey + octave)
    key1 = teoria.note(inputKey + octave);
    scaleResult = key1.scale(scaleType).simple();

    if (inputKey === "f" || inputKey === "f#" || inputKey === "g" || inputKey === "g#"){

      key2Symbol = (scaleResult[2] + octave)
      key2 = teoria.note(key2Symbol);

      key3Symbol = (scaleResult[4] + octaveUp)
      key3 = teoria.note(key3Symbol);

    } else if (inputKey === "a" || inputKey === "a#" || inputKey === "b" || inputKey === "b#"){

      key2Symbol = (scaleResult[2] + octaveUp)
      key2 = teoria.note(key2Symbol);
      key3Symbol = (scaleResult[4] + octaveUp)
      key3 = teoria.note(key3Symbol);

    } else {
      key2Symbol = (scaleResult[2] + octave)
      key2 = teoria.note(key2Symbol);
      key3Symbol = (scaleResult[4] + octave)
      key3 = teoria.note(key3Symbol);
    }

    note1 = key1.fq();
    note2 = key2.fq();
    note3 = key3.fq();

    scaleResult = scaleResult.join().toUpperCase().split(",");
      console.log(scaleResult)
    $("#scaleOutput").html(scaleResult.join(", "));
  });



//////  play Scale

  var playScale = function(){

			play(0, note1, 0.3, function(){
        $(id(key1Symbol)).addClass("playing")
      });
			play(0.5, note2, 0.3, function(){
        $(id(key2Symbol)).addClass("playing")
      });
			play(1, note3, 0.3, function(){
        $(id(key3Symbol)).addClass("playing")
      });
      play(1.5, note4, 0.3, function(){
        $(id(key4Symbol)).addClass("playing")
      });
      play(2, note5, 0.3, function(){
        $(id(key5Symbol)).addClass("playing")
      });
      play(2.5, note6, 0.3, function(){
        $(id(key6Symbol)).addClass("playing")
      });
      play(3, note7, 0.3, function(){
        $(id(key7Symbol)).addClass("playing")
      });
      play(3.5, note8, 0.3, function(){
        $(id(key8Symbol)).addClass("playing")
      }, function(){
        $(id(key1Symbol)).removeClass("playing");
        $(id(key2Symbol)).removeClass("playing");
        $(id(key3Symbol)).removeClass("playing");
        $(id(key4Symbol)).removeClass("playing");
        $(id(key5Symbol)).removeClass("playing");
        $(id(key6Symbol)).removeClass("playing");
        $(id(key7Symbol)).removeClass("playing");
        $(id(key8Symbol)).removeClass("playing");

      });

      function play (delay, frequency, duration, beforeCallback, afterCallback) {
  		  var startTime = audioContext.currentTime + delay
  		  var endTime = startTime + duration

  		  var osc = audioContext.createOscillator();
  		  osc.connect(audioContext.destination)
  		  osc.frequency.value = frequency;

  		  osc.start(startTime);
        setTimeout(beforeCallback, delay * 1000);
  		  osc.stop(endTime)
        setTimeout(afterCallback, (delay * 1000) + (duration * 1000));
  		}
	}

  $("#playScale").on('click', function(){
    inputKey = ($('#inputKey').val()).toLowerCase();
    $(".rootNote").html(inputKey.toUpperCase());
    octave = $('#selectedOctave').val()
    octaveUp = (parseInt(octave) + 1).toString();
    scaleType = $('#scaleType').val()

    // debugger;
    key1Symbol = (inputKey + octave)
    key1 = teoria.note(inputKey + octave);
    scaleResult = key1.scale(scaleType).simple();

    key2Symbol = (scaleResult[1] + octave)
    key2 = teoria.note(key2Symbol);

    key3Symbol = (scaleResult[2] + octave)
    key3 = teoria.note(key3Symbol);

    key4Symbol = (scaleResult[3] + octave)
    key4 = teoria.note(key4Symbol);

    key5Symbol = (scaleResult[4] + octave)
    key5 = teoria.note(key5Symbol);

    key6Symbol = (scaleResult[5] + octave)
    key6 = teoria.note(key6Symbol);

    key7Symbol = (scaleResult[6] + octave)
    key7 = teoria.note(key7Symbol);

    key8Symbol = (inputKey + octaveUp)
    key8 = teoria.note(key8Symbol);

    if (inputKey !== "c" && inputKey !== "c#"){
      key7Symbol = (scaleResult[6] + octaveUp)
      key7 = teoria.note(key7Symbol);

      if (inputKey !== "d" && inputKey !== "d#") {
        key6Symbol = (scaleResult[5] + octaveUp)
        key6 = teoria.note(key6Symbol);

        if (inputKey !== "e" && inputKey !== "e#"){
          key5Symbol = (scaleResult[5] + octaveUp)
          key5 = teoria.note(scaleResult[4] + octaveUp);

          if (inputKey !== "f" && inputKey !== "f#"){
            key4Symbol = (scaleResult[3] + octaveUp)
            key4 = teoria.note(scaleResult[3] + octaveUp);

            if (inputKey !== "g" && inputKey !== "g#"){
              key3Symbol = (scaleResult[2] + octaveUp)
              key3 = teoria.note(scaleResult[2] + octaveUp);

              if (inputKey !== "a" && inputKey !== "a#"){
                key2Symbol = (scaleResult[1] + octaveUp)
                key2 = teoria.note(scaleResult[1] + octaveUp);
              }
            }
          }
        }
      }
    }
    note1 = key1.fq();
    note2 = key2.fq();
    note3 = key3.fq();
    note4 = key4.fq();
    note5 = key5.fq();
    note6 = key6.fq();
    note7 = key7.fq();
    note8 = key8.fq();

    scaleResult = scaleResult.join().toUpperCase().split(",");
      console.log(scaleResult)
    $("#scaleOutput").html(scaleResult.join(", "));
  });

  $('#playTriad').click(function(){
    playTriad();
    // osc.disconnect(audioContext.destination);
  });

  $('#playScale').click(function(){
    playScale();
    // osc.disconnect(audioContext.destination)
  });

  $('.blackKeys').hover(function () {
    $(this).closest('.whiteKeys').toggleClass('inactive');
  });

  $('.blackKeys').on('mousedown', function () {
    $(this).closest('.whiteKeys').addClass('unpressed');
  }).on('mouseup', function () {
    $(this).closest('.whiteKeys').removeClass('unpressed');
  });
});
