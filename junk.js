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
