app.controller("DjCtrl", ["$scope", "instruments", "storage", "$http", "WaterModel", "audioSampleLoader", function ($scope, instruments, storage, $http, WaterModel, audioSampleLoader) {

    
// Modal instructions on page load.
    $scope.hideModal = false;
    $scope.hide = function () {
        $scope.hideModal = true;
    };

// Set up audio variables.
    var context = storage.context;
    var FilterSample = {
      FREQ_MUL: 7000,
      QUAL_MUL: 30,
      playing: false
    };
    var analyser = context.createAnalyser(); // For visuals.


// *********** SET UP RIPPLE CANVASES ****************** //

    var width = 700;
    var height = 500;

    var waterModelFilter = new WaterModel(width, height, {
        resolution:2.0,
        interpolate:false,
        damping:0.92,
        clipping:5,
        evolveThreshold:0.05,
        maxFps:30,
        showStats:true
    });

    var waterModelDelay = new WaterModel(width, height, {
        resolution:2.0,
        interpolate:false,
        damping:0.92,
        clipping:5,
        evolveThreshold:0.05,
        maxFps:30,
        showStats:true
    });
    
    var filterCanvas = new WaterCanvas(width, height, "filter", waterModelFilter, {
        backgroundImageUrl:"img/kraftwerk.jpg",
        lightRefraction:39.2,
        lightReflection:0.92,
        maxFps:20,
        showStats:true
    });

    var delayCanvas = new WaterCanvas(width, height, "delay", waterModelDelay, {
        backgroundImageUrl:"img/daft-punk.jpg",
        lightRefraction:9.0,
        lightReflection:0.92,
        maxFps:20,
        showStats:true
    });

    var finger = [
        [0.5, 1.0, 0.5],
        [1.0, 1.0, 1.0],
        [0.5, 1.0, 0.5]
    ];

// *********************Set up effects*********************** //
    
    // Filter
    $scope.filter = context.createBiquadFilter();
    //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
    $scope.filter.type = (typeof $scope.filter.type === 'string') ? 'bandpass' : 0; // LOWPASS
    $scope.filter.frequency.value = 1000;

    // Delay
    $scope.delayEffect = context.createDelay(2.0);



// ***************** GET SONG DATA **************** //

    $http({
        method: 'GET',
        url: 'app/data/songs.json'
    })
    .success(function (songData) {
        // console.log(songData);
        $scope.songData = songData;
        $scope.currentSongTitle = $scope.songData[0].title;
        $scope.currentSongArtist = $scope.songData[0].artist;
        $scope.currentSongImg = $scope.songData[0].img;
    });

// ***************** GET AUDIO ******************** //

    var bufferCounter = 0;
    $scope.songBuffers = [];
    var loader = new audioSampleLoader();

    loader.src = ['sounds/Clean-Bandit.mp3', 'sounds/fat-bottomed-girls.mp3', 'sounds/needYourHeart.mp3', 'sounds/Sabali.mp3'];
    loader.ctx = context;
    loader.onload = function () { 
        for (var i = 0; i < loader.response.length; i++) {
            $scope.songBuffers.push(loader.response[i]);
        }
    };
    loader.onerror = function () { 
        alert('Awwwwww snap!');
    };
    loader.send();

    $scope.nextSong = function () {
        // Create counter and add to it when nextSong is clicked.
        bufferCounter += 1;
        console.log($scope.source.buffer);
        // run $scope.pauseSong()
        if ($scope.masterGain.gain.value != 0) {
            $scope.pauseSong();
        }
        // run $scope.playSong($scope.songBuffers[bufferCounter]);
        $scope.playSong($scope.songBuffers[bufferCounter]);

        $scope.currentSongTitle = $scope.songData[bufferCounter].title;
        $scope.currentSongArtist = $scope.songData[bufferCounter].artist;
        $scope.currentSongImg = $scope.songData[bufferCounter].img;
    };

    $scope.prevSong = function () {
        bufferCounter -= 1;
        if ($scope.masterGain.gain.value != 0) {
            $scope.pauseSong();
        }
        $scope.playSong($scope.songBuffers[bufferCounter]);

        $scope.currentSongTitle = $scope.songData[bufferCounter].title;
        $scope.currentSongArtist = $scope.songData[bufferCounter].artist;
        $scope.currentSongImg = $scope.songData[bufferCounter].img;
    };

    // Creates buffer source and grabs songBuffer from $http call above. 
    $scope.playSong = function (buffer) {
        // console.log(buffer);
        $scope.source = context.createBufferSource();
        if (buffer == undefined) {
            $scope.source.buffer = $scope.songBuffers[0];    
        } else {
            $scope.source.buffer = buffer; 
        }
        $scope.masterGain = context.createGain();
        $scope.masterGain.gain.value = 1;
        $scope.source.connect(analyser);
        analyser.connect($scope.masterGain);
        $scope.masterGain.connect(context.destination); // Connects source to audio context
        $scope.source.start(0); // Starts playing

        // Create a 2nd instance of song playing for effects, set gain to 0.
        $scope.effectSource = context.createBufferSource();
        if (buffer == undefined) {
            $scope.effectSource.buffer = $scope.songBuffers[0];    
        } else {
            $scope.effectSource.buffer = buffer; 
        }      
        $scope.effectGainNode = context.createGain();
        $scope.effectGainNode.gain.value = 0;
        $scope.effectSource.connect(analyser);
        analyser.connect($scope.effectGainNode);
        $scope.effectGainNode.connect(context.destination);        
        $scope.effectSource.start(0); // Starts playing
    };

    $scope.pauseSong = function () {
        $scope.masterGain.gain.value = 0;
        $scope.source.disconnect(analyser);
        analyser.disconnect($scope.masterGain);
        $scope.masterGain.disconnect(context.destination);
        $scope.source.stop();
        $scope.effectSource.stop();
        $scope.selectedRangePercent = 100/3 + '%';
        $scope.selectedRange = '100';
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
            // console.log("X", $event.offsetX, "Y", $event.offsetY);
            var adjustedFreq = 1 - ($event.offsetY * 0.0029);
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
            var adjustedQ = 1 - ($event.offsetX * 0.00174);
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

    $scope.addDelay = function ($event) {
        if ($event.which == 1) {
            // Track mousepad movement for canvas ripples.
            waterModelDelay.touchWater($event.offsetX, $event.offsetY, 1.5, finger);

            // console.log("X", $event.offsetX, "Y", $event.offsetY);
            $scope.effectGainNode.disconnect(context.destination);
            //Sets delay time to number from 0.01 - 2.0
            $scope.delayEffect.delayTime.value = $event.offsetY * 0.00575;
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
        }, 1500);
        
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


    // Spotify Test

    // var my_client_id = '076ef4c8ecbc45ba94936575d48b7df8'; // Your client id
    // var my_secret = 'e4148233ddef4415b3889173be8e2174'; // Your secret
    // var redirect_uri = 'http://localhost:8000/#/dj/'; // Your redirect uri
    // var scopes = 'user-read-private user-read-email'

    

    // $http({
    //     url: 'https://accounts.spotify.com/authorize/?client_id=076ef4c8ecbc45ba94936575d48b7df8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=user-read-private%20user-read-email&state=34fFs29kd09',
    //     method: 'GET'
    // })
    // .success(function (data) {
    //     console.log(data);
    // });



}]);