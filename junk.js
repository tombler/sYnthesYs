    var SynthPad = (function() {
      // Variables
      var myCanvas;
      var frequencyLabel;
      var volumeLabel;



      // Notes
      var lowNote = 261.63; // C4
      var highNote = 493.88; // B4
 


    // Constructor
    var SynthPad = function() {
        myCanvas = document.getElementById('synth-pad');
        // frequencyLabel = document.getElementById('frequency');
        // volumeLabel = document.getElementById('volume');
      
      
        SynthPad.setupEventListeners();
      };
      
      
      // Event Listeners
      SynthPad.setupEventListeners = function() {
      
        // Disables scrolling on touch devices.
        document.body.addEventListener('touchmove', function(event) {
          event.preventDefault();
        }, false);
      
        myCanvas.addEventListener('mousedown', SynthPad.playSound);
        myCanvas.addEventListener('touchstart', SynthPad.playSound);
      
        myCanvas.addEventListener('mouseup', SynthPad.stopSound);
        document.addEventListener('mouseleave', SynthPad.stopSound);
        myCanvas.addEventListener('touchend', SynthPad.stopSound);
      };
      
      
      // Play a note.
      SynthPad.playSound = function(event) {
        $scope.source = context.createBufferSource();
        $scope.source.buffer = $scope.songBuffer;
        // Create the filter.
        $scope.filter = context.createBiquadFilter();
        //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
        $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
        SynthPad.updateFrequency(event);
        $scope.filter.frequency.value = SynthPad.calculateFrequency(event.y);
      
        
        $scope.filter.connect(context.destination);
        $scope.source.connect(context.destination);
        $scope.source.start(0);
        
        myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
        myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
      
        myCanvas.addEventListener('mouseout', SynthPad.stopSound);
      };
      
      
      // Stop the audio.
      SynthPad.stopSound = function(event) {
        $scope.source.stop();
      
        myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
        myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
        myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
      };
       
      
      // Calculate the note frequency.
      SynthPad.calculateNote = function(posY) {
        var filterFreq = 9000 - (posY * 30);
        return filterFreq;
      };
      
      
      
      // Fetch the new frequency and volume.
      SynthPad.calculateFrequency = function(y) {
        var noteValue = SynthPad.calculateNote(y);
      
        return noteValue;
    
      };
      
      
      // Update the note frequency.
      SynthPad.updateFrequency = function(event) {
        // console.log(event);
        if (event.type == 'mousedown' || event.type == 'mousemove') {
          SynthPad.calculateFrequency(event.y);
        } else if (event.type == 'touchstart' || event.type == 'touchmove') {
          var touch = event.touches[0];
          SynthPad.calculateFrequency(touch.pageX, touch.pageY);
        }
      };
      
      
      // Export SynthPad.
      return SynthPad;
    })();


    // Initialize the page.
    
      var synthPad = new SynthPad();
    


  On mousemove: updateFreq($event). if $event.type == mousedown and mousemove, calculateFreq($event.offsetY).
  calcualteFreq($event.offsetY). filterFreq = 9000 - $event.offsetY * 30. $scope.filter.frequency.value = filterFreq



    

    function playSound(buffer) {
      $scope.source = context.createBufferSource();
      $scope.source.buffer = buffer;
      $scope.source.connect(context.destination);
      $scope.source.start(0);
    }

    $scope.playSong = function () {
        playSound($scope.songBuffer);
    };

    $scope.pauseSong = function () {
        $scope.source.stop(context.currentTime);
    };

    $scope.delay = function(event) {
        // console.log(context.currentTime);
        synthSource = context.createBufferSource();
        synthSource.buffer = $scope.songBuffer;
        synthSource.loop = true;
        synthSource.start(context.currentTime);
        synthSource.connect(synthDelay);
        synthSource.connect(context.destination);
    };

    $scope.stopDelay = function(event) {
        synthSource.disconnect(synthDelay);
        // synthDelay.disconnect(context.destination);
        synthSource.stop();
    };


    On mousedown: do $scope.calcFreq = setInterval function to calculate frequency every millisecond
    On mouseup: clearInterval($scope.calcFreq)

    $scope.mouseDown = function ($event) {

        $scope.source = context.createBufferSource();
        $scope.source.buffer = $scope.songBuffer;
        // Create the filter.
        $scope.filter = context.createBiquadFilter();
        //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
        $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
        $scope.filter.frequency.value = setInterval(function ($event) {
            return (9000 - ($event.offsetY * 30));
        }, 10);
        // Connect $scope.source to $scope.filter, $scope.filter to destination.
      $scope.source.connect($scope.filter);
      $scope.filter.connect(context.destination);
      // Play!
      if (!$scope.source.start)
        $scope.source.start = $scope.source.noteOn;
      $scope.source.start(0);
      $scope.source.loop = true;
    }


    

    $scope.play = function() {
      // Create the source.
      $scope.source = context.createBufferSource();
      $scope.source.buffer = $scope.songBuffer;
      // Create the filter.
      $scope.filter = context.createBiquadFilter();
      //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
      $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
      $scope.filter.frequency.value = $scope.filterFreq;
      // Connect $scope.source to $scope.filter, $scope.filter to destination.
      $scope.source.connect($scope.filter);
      $scope.filter.connect(context.destination);
      // Play!
      if (!$scope.source.start)
        $scope.source.start = $scope.source.noteOn;
      $scope.source.start(0);
      $scope.source.loop = true;
      
    };

    $scope.stop = function() {
      if (!$scope.source.stop)
        $scope.source.stop = $scope.source.noteOff;
      $scope.source.stop(0);
      $scope.source.noteOff(0);
    };







              // $scope.loop = context.createDelay(context.currentTime + 2.0);
          // $scope.loop.delayTime.value = context.currentTime + 2.0;
          // $scope.source.connect($scope.loop);
          // $scope.loop.connect($scope.loop);
          // $scope.loop.connect(context.destination);



        // $scope.source = context.createBufferSource();
        // $scope.source.buffer = buffer;
        // $scope.source.connect(context.destination);
        // $scope.source.start(t);
        // $(elId).css('background-color', 'black');

        // $interval(function () {
        //     if (!$scope.breakLoop) {
        //         $scope.changePadColor = $interval(function () {
        //             if (!$scope.breakLoop) {
        //                 $(elId).css('background-color', 'black');
        //             }
        //         }, 2000);
        //       $scope.returnPadColor = $interval(function () {
        //             if (!$scope.breakLoop) {
        //                 $(elId).css('background-color', 'green');
        //             }
        //       }, 2020);

        //       $scope.source = context.createBufferSource();
        //       $scope.source.buffer = buffer;
        //       $scope.source.connect(context.destination);
        //       $scope.source.start(t);
        //     }
        // }, 2000);








// **********************TEMPO******************************


    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});

    var isPlaying = false;      // Are we currently playing?
    var startTime;              // The start time of the entire sequence.
    var current16thNote;        // What note is currently last scheduled?
    var tempo = 120.0;          // tempo (in beats per minute)
    var lookahead = 25.0;       // How frequently to call scheduling function 
                                //(in milliseconds)
    var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                                // This is calculated from lookahead, and overlaps 
                                // with next interval (in case the timer is late)
    var nextNoteTime = 0.0;     // when the next note is due.
    var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
    var noteLength = 0.05;      // length of "beep" (in seconds)
    var canvas,                 // the canvas element
        canvasContext;          // canvasContext is the canvas' context 2D
    var last16thNoteDrawn = -1; // the last "box" we drew on the screen
    var notesInQueue = [];      // the notes that have been put into the web audio,
                                // and may or may not have played yet. {note, time}
    var timerWorker = null;     // The Web Worker used to fire timer messages

    $scope.tempo = "120";

    function nextNote() {
        // Advance current note and time by a 16th note...
        var secondsPerBeat = 60.0 / $scope.tempo;    // Notice this picks up the CURRENT 
                                              // tempo value to calculate beat length.
        nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

        current16thNote++;    // Advance the beat number, wrap to zero
        if (current16thNote == 16) {
            current16thNote = 0;
        }
    }

    function scheduleNote( beatNumber, time ) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push( { note: beatNumber, time: time } );

        if ( (noteResolution==1) && (beatNumber%2))
            return; // we're not playing non-8th 16th notes
        if ( (noteResolution==2) && (beatNumber%4))
            return; // we're not playing non-quarter 8th notes

        // create an oscillator
        var osc = context.createOscillator();
        osc.connect( context.destination );
        if (beatNumber % 16 === 0)    // beat 0 == low pitch
            osc.frequency.value = 880.0;
        else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
            osc.frequency.value = 440.0;
        else                        // other 16th notes = high pitch
            osc.frequency.value = 220.0;

        osc.start( time );
        osc.stop( time + noteLength );
    }

    function scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (nextNoteTime < context.currentTime + scheduleAheadTime ) {
            scheduleNote( current16thNote, nextNoteTime );
            nextNote();
        }
    }

    $scope.playSolidMetronome = function (tempo) {
        // console.log(tempo);
        isPlaying = !isPlaying;

        if (isPlaying) { // start playing
            current16thNote = 0;
            nextNoteTime = context.currentTime;
            // timerWorker.postMessage("start");
            return "stop";
        } else {
            // timerWorker.postMessage("stop");
            return "play";
        }

    };
