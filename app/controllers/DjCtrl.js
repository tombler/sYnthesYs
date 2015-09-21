app.controller("DjCtrl", ["$scope", "instruments", "recordingFactory", "storage", "$http", "ngDraggable", function ($scope, instruments, recordingFactory, storage, $http, ngDraggable) {

    $http({
        url: 'sounds/needYourHeart.mp3',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.songBuffer = buffer;
            // console.log(buffer);
            
        });
    });

    var context = storage.context;
    var delayEffect = context.createDelay(2.0);
    var lowFilter = 1000; // C4
    var highFilter = 10000; // B4
    var myCanvas = document.getElementById('synth-pad');
    

    var FilterSample = {
      FREQ_MUL: 7000,
      QUAL_MUL: 30,
      playing: false
    };


    // Creates buffer source and grabs songBuffer from $http call above. 
    $scope.playSong = function () {
        $scope.source = context.createBufferSource();
        $scope.source.buffer = $scope.songBuffer;
        $scope.masterGain = context.createGain();
        $scope.masterGain.gain.value = 1;
        $scope.source.connect($scope.masterGain);
        $scope.masterGain.connect(context.destination); // Connects source to audio context
        $scope.source.start(0); // Starts playing

        // Create a 2nd source, i.e. 
        $scope.effectSource = context.createBufferSource();
        $scope.effectSource.buffer = $scope.songBuffer;
        // $scope.delaySource.connect(delayEffect); // Connects delay node
        // $scope.delaySource.connect(context.destination); // Connects delaySource to audio context


        // Create delayGainNode, set at 0. On mousedown/move set gain to 1.
        $scope.filter = context.createBiquadFilter();
        //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
        $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'bandpass' : 0; // LOWPASS
        $scope.filter.frequency.value = 1000;
        // $scope.filter.connect(context.destination);
        
        $scope.effectGainNode = context.createGain();
        $scope.effectGainNode.gain.value = 0;
        $scope.effectSource.connect($scope.effectGainNode);
        $scope.effectGainNode.connect($scope.filter);
        $scope.filter.connect(context.destination);
        $scope.effectSource.start(0); // Starts playing


    };

    $scope.pauseSong = function () {
        $scope.source.stop(context.currentTime);
    };

    $scope.addEffects = function ($event) {
        if ($event.which == 1) {
            
            // console.log("mousedown and moving");

            //Calculate freq value to a number between 0.01 and 1.
            var adjustedFreq = 1 - ($event.offsetY * 0.0033);
            // Clamp the frequency between the minimum value (40 Hz) and half of the
            // sampling rate.
            var minValue = 40;
            var maxValue = context.sampleRate / 2;
            // Logarithm (base 2) to compute how many octaves fall in the range.
            var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
            // Compute a multiplier from 0 to 1 based on an exponential scale.
            var multiplier = Math.pow(2, numberOfOctaves * (adjustedFreq - 1.0));
            // Get back to the frequency value between min and max.
            $scope.filter.frequency.value = maxValue * multiplier;
            $scope.frequencyDisplay = $scope.filter.frequency.value;

            // Calculate Q value to a number between 0.01 and 1.
            var adjustedQ = 1 - ($event.offsetX * 0.0033);
            $scope.filter.Q.value = adjustedQ * FilterSample.QUAL_MUL;
            $scope.effectGainNode.gain.value = 6;
            $scope.masterGain.gain.value = 0;
        } 
    };

    $scope.removeEffects = function () {
        $scope.effectGainNode.gain.value = 0;
        $scope.masterGain.gain.value = 1;
    };

    // Timing effects!!
    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
  


}]);




