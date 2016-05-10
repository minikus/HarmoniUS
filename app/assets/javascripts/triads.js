
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

  var playTriad = function(){
      var id = function (key) {
        return '#' + key.replace('#', '\\#');
      };

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
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
			play(0.5, note2, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
			play(1, note3, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(1.5, note4, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(2, note5, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(2.5, note6, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(3, note7, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(3.5, note8, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      });
      play(4, note9, 0.3, function(){
        $("#" +key1).css("background-color", "rgb(171, 200, 213)")
      }, function(){
        $("#" +key1).css("background-color", "white");
        $("#" +key2).css("background-color", "white");
        $("#" +key3).css("background-color", "white");
        $("#" +key4).css("background-color", "white");
        $("#" +key5).css("background-color", "white");
        $("#" +key6).css("background-color", "white");
        $("#" +key7).css("background-color", "white");
        $("#" +key8).css("background-color", "white");
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

    key1 = teoria.note(inputKey + octave);
    scaleResult = key1.scale(scaleType).simple();
    key2 = teoria.note(scaleResult[1] + octave);
    key3 = teoria.note(scaleResult[2] + octave);
    key4 = teoria.note(scaleResult[3] + octave);
    key5 = teoria.note(scaleResult[4] + octave);
    key6 = teoria.note(scaleResult[5] + octave);
    key7 = teoria.note(scaleResult[6] + octave);
    key8 = teoria.note(inputKey + octaveUp);


    if (inputKey !== "c" && inputKey !== "c#"){
      key7 = teoria.note(scaleResult[6] + octaveUp);

      if (inputKey !== "d" && inputKey !== "d#") {
        key6 = teoria.note(scaleResult[5] + octaveUp);

        if (inputKey !== "e" && inputKey !== "e#"){
          key5 = teoria.note(scaleResult[4] + octaveUp);

          if (inputKey !== "f" && inputKey !== "f#"){
            key4 = teoria.note(scaleResult[3] + octaveUp);

            if (inputKey !== "g" && inputKey !== "g#"){
              key3 = teoria.note(scaleResult[2] + octaveUp);

              if (inputKey !== "a" && inputKey !== "a#"){
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
