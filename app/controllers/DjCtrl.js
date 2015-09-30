app.controller("DjCtrl", ["$scope", "instruments", "storage", "$http", "WaterModel", function ($scope, instruments, storage, $http, WaterModel) {

    // Modal progress bar to show while loading song.
    var $modal = $('.js-loading-bar'),
    $bar = $modal.find('.progress-bar');
    $modal.modal('show');
    $bar.addClass('animate');
    setTimeout(function() {
        $bar.removeClass('animate');
        $modal.modal('hide');
    }, 1500);


// *********** SET UP RIPPLE CANVASES ****************** //

    var width = 300;
    var height = 300;

    var waterModelFilter = new WaterModel(width, height, {
        resolution:2.0,
        interpolate:false,
        damping:0.9,
        clipping:5,
        evolveThreshold:0.05,
        maxFps:30,
        showStats:true
    });

    var waterModelDelay = new WaterModel(width, height, {
        resolution:2.0,
        interpolate:false,
        damping:0.9,
        clipping:5,
        evolveThreshold:0.05,
        maxFps:30,
        showStats:true
    });
    
    var filterCanvas = new WaterCanvas(width, height, "filter", waterModelFilter, {
        backgroundImageUrl:"img/Adventure-Club.jpg",
        lightRefraction:9.0,
        lightReflection:0.1,
        maxFps:20,
        showStats:true
    });

    var delayCanvas = new WaterCanvas(width, height, "delay", waterModelDelay, {
        backgroundImageUrl:"img/Adventure-Club.jpg",
        lightRefraction:9.0,
        lightReflection:0.1,
        maxFps:20,
        showStats:true
    });

    var finger = [
        [0.5, 1.0, 0.5],
        [1.0, 1.0, 1.0],
        [0.5, 1.0, 0.5]
    ];


// ***************** GET AUDIO ******************** //

    // $http({
    //     url: 'sounds/needYourHeart.mp3',
    //     method: 'GET',
    //     responseType: 'arraybuffer'
    // })
    // .success(function (data) {
    //     // console.log(data);
    //     context.decodeAudioData(data, function (buffer) {
    //         $scope.songBuffer = buffer;
    //         // console.log(buffer);
            
    //     });
    // });

    $http({
        url: 'https://accounts.spotify.com/authorize/?client_id=076ef4c8ecbc45ba94936575d48b7df8&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09',
        method: 'GET'
    })
    .success(function (data) {
        console.log(data);
    });

    


    // Set up audio variables.
    var context = storage.context;
    var FilterSample = {
      FREQ_MUL: 7000,
      QUAL_MUL: 30,
      playing: false
    };
    var analyser = context.createAnalyser(); // For visuals.




// *********************Set up effects*********************** //
    
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
        $scope.source.connect(analyser);
        analyser.connect($scope.masterGain);
        $scope.masterGain.connect(context.destination); // Connects source to audio context
        $scope.source.start(0); // Starts playing

        // Create a 2nd instance of song playing for effects, set gain to 0.
        $scope.effectSource = context.createBufferSource();
        $scope.effectSource.buffer = $scope.songBuffer;      
        $scope.effectGainNode = context.createGain();
        $scope.effectGainNode.gain.value = 0;
        $scope.effectSource.connect(analyser);
        analyser.connect($scope.effectGainNode);
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
            // Track mousepad movement for canvas ripples.
            waterModelFilter.touchWater($event.offsetX, $event.offsetY, 1.5, finger);

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
            // Track mousepad movement for canvas ripples.
            waterModelDelay.touchWater($event.offsetX, $event.offsetY, 1.5, finger);

            $scope.effectGainNode.disconnect(context.destination);
            $scope.delayEffect.delayTime.value = $event.offsetY * 0.006633;
            $scope.effectGainNode.gain.value = 0.8;
            $scope.masterGain.gain.value = 0.5;

            $scope.effectSource.connect(analyser);
            analyser.connect($scope.delayEffect);
            $scope.delayEffect.connect($scope.effectGainNode);
            $scope.effectGainNode.connect(context.destination);
            // $scope.effectSource.connect(context.destination);
        }
    };

    $scope.removeDelay = function ($event) {
        // Let delay feedback for 1.5 seconds after mouse release.
        setTimeout(function () {
            $scope.effectGainNode.gain.value = 0;
            $scope.masterGain.gain.value = 1;
        }, 1500)
        
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