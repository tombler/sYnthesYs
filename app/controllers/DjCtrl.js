app.controller("DjCtrl", ["$scope", "instruments", "recordingFactory", "storage", "$http", "ngDraggable", function ($scope, instruments, recordingFactory, storage, $http, ngDraggable) {

    // Call to get audio.
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


    // Set up audio variables.
    var context = storage.context;
    var FilterSample = {
      FREQ_MUL: 7000,
      QUAL_MUL: 30,
      playing: false
    };

    // **************Set up effects****************
    
    // Filter
    $scope.filter = context.createBiquadFilter();
    //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
    $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'bandpass' : 0; // LOWPASS
    $scope.filter.frequency.value = 1000;

    // Delay
    $scope.delayEffect = context.createDelay(2.0);


    // Creates buffer source and grabs songBuffer from $http call above. 
    $scope.playSong = function () {
        $scope.source = context.createBufferSource();
        $scope.source.buffer = $scope.songBuffer;
        $scope.masterGain = context.createGain();
        $scope.masterGain.gain.value = 1;
        $scope.source.connect($scope.masterGain);
        $scope.masterGain.connect(context.destination); // Connects source to audio context
        $scope.source.start(0); // Starts playing

        // Create a 2nd instance of song playing for effects, set gain to 0.
        $scope.effectSource = context.createBufferSource();
        $scope.effectSource.buffer = $scope.songBuffer;      
        $scope.effectGainNode = context.createGain();
        $scope.effectGainNode.gain.value = 0;
        $scope.effectSource.connect($scope.effectGainNode);
        $scope.effectGainNode.connect(context.destination);        
        $scope.effectSource.start(0); // Starts playing
    };

    $scope.pauseSong = function () {
        $scope.source.stop(context.currentTime);
        $scope.effectSource.stop(context.currentTime);
    };


    $scope.connectEffectGain = function () {
        $scope.effectGainNode.disconnect(context.destination);
        $scope.effectGainNode.connect($scope.filter);
        $scope.filter.connect(context.destination);
        $scope.effectGainNode.gain.value = 5;
        $scope.masterGain.gain.value = 0;
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
        
        } 
    };

    $scope.removeEffects = function () {
        $scope.filter.disconnect(context.destination);
        $scope.effectGainNode.disconnect($scope.filter);

        $scope.effectGainNode.connect(context.destination);
        $scope.effectGainNode.gain.value = 0;
        $scope.masterGain.gain.value = 1;
    };

    $scope.connectDelayGain = function () {
        
    };

    $scope.addDelay = function ($event) {
        if ($event.which == 1) {
            // console.log("yes")
            $scope.effectGainNode.disconnect(context.destination);
            $scope.delayEffect.delayTime.value = $event.offsetY * 0.006633;
            $scope.effectGainNode.gain.value = 0.8;
            $scope.masterGain.gain.value = 0.5;

            $scope.effectSource.connect($scope.delayEffect);
            $scope.delayEffect.connect($scope.effectGainNode);
            $scope.effectGainNode.connect(context.destination);
            // $scope.effectSource.connect(context.destination);
        }
    };

    $scope.removeDelay = function ($event) {
        $scope.effectGainNode.gain.value = 0;
        $scope.masterGain.gain.value = 1;
    };

    $scope.changePlaybackRate = function (selectedRange) {
        // console.log(selectedRange);
        $scope.selectedRangePercent = ((parseInt(selectedRange) - 50) / 1.5) + "%";
        var calculatedPBV = selectedRange / 100;
        $scope.source.playbackRate.value = calculatedPBV;
        // Change effect source playback value:
        $scope.effectSource.playbackRate.value = calculatedPBV;

    };



    $scope.closeAudio = function () {
        $scope.masterGain.disconnect(context.destination);
    };

}]);




