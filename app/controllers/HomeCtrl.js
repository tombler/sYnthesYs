app.controller("HomeCtrl", function ($scope) {

  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  var context = new AudioContext(),
      settings = {
          id: 'keyboard',
          width: 800,
          height: 300,
          startNote: 'A2',
          whiteNotesColour: '#fff',
          blackNotesColour: '#000',
          borderColour: '#000',
          activeColour: 'yellow',
          octaves: 3
      },
      keyboard = new QwertyHancock(settings);

  // console.log(keyboard)
  var real = new Float32Array(2);
  var imag = new Float32Array(2);
  real[0] = 0;
  imag[0] = 0;
  real[1] = 1;
  imag[1] = 0;

  var wave = context.createPeriodicWave(real, imag);


  var gain = context.createGain();
  gain.gain.value = 0.3;
  gain.connect(context.destination);
  nodes = [];

  /* Connections */
  

  keyboard.keyDown = function (note, frequency) {
    // console.log(frequency);
    var vco = context.createOscillator();
    vco.setPeriodicWave(wave);
    // vco.type = 'custom';
    vco.frequency.value = frequency;
    vco.connect(gain);
    vco.start(0);
    

    nodes.push(vco);
    console.log(nodes);
  };

  keyboard.keyUp = function (note, frequency) {
    
    var new_nodes = [];

    for (var i = 0; i < nodes.length; i++) {
      if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
        nodes[i].stop(0); // Stops that node from playing at the current moment, i.e. in 0 seconds.
        nodes[i].disconnect(); // Presumably disconnects from destination? Actual code is maybe gain.disconnect(context.destination)?
      } else {
        new_nodes.push(nodes[i]);
      }
    }


    nodes = new_nodes;
  };

  // Function in QWERTY Library that  calculates freq of notes:

//   var getFrequencyOfNote = function (note) {
//     var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
//         key_number,
//         octave;

//     if (note.length === 3) {
//         octave = note.charAt(2);
//     } else {
//         octave = note.charAt(1);
//     }

//     key_number = notes.indexOf(note.slice(0, -1));

//     if (key_number < 3) {
//         key_number = key_number + 12 + ((octave - 1) * 12) + 1;
//     } else {
//         key_number = key_number + ((octave - 1) * 12) + 1;
//     }

//     return 440 * Math.pow(2, (key_number - 49) / 12);
// };




  // masterGain = context.createGain();
  // nodes = [];

  // masterGain.gain.value = 0.3;
  // masterGain.connect(context.destination); 

  // keyboard.keyDown = function (note, frequency) {
  //     var oscillator = context.createOscillator();
  //     oscillator.type = 'triangle';
  //     oscillator.frequency.value = frequency;
  //     oscillator.connect(masterGain);
  //     oscillator.start(0);

  //     nodes.push(oscillator);
  // };

  // keyboard.keyUp = function (note, frequency) {
  //     var new_nodes = [];

  //     for (var i = 0; i < nodes.length; i++) {
  //         if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
  //             nodes[i].stop(0);
  //             nodes[i].disconnect();
  //         } else {
  //             new_nodes.push(nodes[i]);
  //         }
  //     }

  //     nodes = new_nodes;
  // };

        
});