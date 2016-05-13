$(document).ready(function(){
  var inversionType;
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

  var playCompTriad2 = function(){

    if (inversionType2 === "Random-Inversion"){

      play(0, note2, 0.5, function () {
        $(id(key1Symbol)).addClass("playing")
      });
      play(0.25, note3, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
      play(0.5, note2, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
      play(0.75, note1, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
      play(1, note3, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
      play(1.25, note1, 0.5, function () {
        $(id(key3Symbol)).addClass("playing");
      }, function () {
        $(id(key1Symbol)).removeClass("playing");
        $(id(key2Symbol)).removeClass("playing");
        $(id(key3Symbol)).removeClass("playing");
      });

    } else if (inversionType2 === "Third-Inversion"){

      play(0, note3, 0.5, function () {
        $(id(key1Symbol)).addClass("playing")
      });
      play(1, note2, 0.5, function () {
        $(id(key2Symbol)).addClass("playing");
      });
      play(2, note1, 0.5, function () {
        $(id(key3Symbol)).addClass("playing");
      }, function () {
        $(id(key1Symbol)).removeClass("playing");
        $(id(key2Symbol)).removeClass("playing");
        $(id(key3Symbol)).removeClass("playing");
      });

    } else {

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

    }

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

  $("#playCompTriad2").on('click', function(){

    inputKey = ($('#inputKey').val()).toLowerCase();
    $(".rootNote").html(inputKey.toUpperCase());
    octave = parseInt($('#selectedOctave2').val()) + 2
    console.log("octave: ", octave)
    octaveUp = (parseInt(octave) + 1).toString();

    scaleType = $('#scaleType').val()
    inversionType2 = $('#inversionType2').val();
    console.log(inversionType2);

    if (inversionType2 === "Random-Inversion"){
      key1Symbol = (inputKey + octaveUp)
    } else {
      key1Symbol = (inputKey + octave)
    }

    key1 = teoria.note(key1Symbol);
    scaleResult = key1.scale(scaleType).simple();

    if (inputKey === "f" || inputKey === "f#" || inputKey === "g" || inputKey === "g#"){

      if (inversionType2 === "Third-Inversion"){
        key2Symbol = (scaleResult[2] + octave)
        key3Symbol = (scaleResult[4] + octave)
      } else{
        key2Symbol = (scaleResult[2] + octave)
        key3Symbol = (scaleResult[4] + octaveUp)
      }

    } else if (inputKey === "a" || inputKey === "a#" || inputKey === "b" || inputKey === "b#"){

      if (inversionType2 === "Third-Inversion"){
        key2Symbol = (scaleResult[2] + octaveUp)
        key3Symbol = (scaleResult[4] + octave)
      }else{
        key2Symbol = (scaleResult[2] + octaveUp)
        key3Symbol = (scaleResult[4] + octaveUp)
      }

    } else {
        key2Symbol = (scaleResult[2] + octave)
      // key2 = teoria.note(key2Symbol);
      if (inversionType2 === "Third-Inversion"){
        key3Symbol = (scaleResult[4] + (parseInt(octave) - 1).toString() )
      // key3 = teoria.note(key3Symbol);
    } else{
        key3Symbol = (scaleResult[4] + octave)
      }
    }

    key2 = teoria.note(key2Symbol);
    key3 = teoria.note(key3Symbol);

    note1 = key1.fq();
    note2 = key2.fq();
    note3 = key3.fq();

    scaleResult = scaleResult.join().toUpperCase().split(",");
      console.log(scaleResult)
    $("#scaleOutput").html(scaleResult.join(", "));

  });


  $('#playCompTriad2').click(function(){
    playCompTriad2();
  });

});
