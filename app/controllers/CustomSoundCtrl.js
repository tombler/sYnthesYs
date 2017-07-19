app.controller("CustomSoundCtrl", ["$scope", "storage", "$document", "$http", "$interval", "$window", "audioSampleLoader", function ($scope, storage, $document, $http, $interval, $window, audioSampleLoader) {
    
    // Modal progress bar to show while loading instrument.
    var $modal = $('.js-loading-bar'),
    $bar = $modal.find('.progress-bar');
    $modal.modal('show');
    $bar.addClass('animate');
    setTimeout(function() {
        $bar.removeClass('animate');
        $modal.modal('hide');
    }, 1500);

    // Set up variables
    var context = storage.context;
    var elId;
    $scope.bufferPads = [];
    $scope.isDisabled = false;
    $scope.breakLoop = false;
    $scope.status = true;

// ******************** LOAD ALL SAMPLES FOR THE PAGE ********************//
    var loader = new audioSampleLoader();
    loader.src = ['sounds/120bpm.mp3', 'sounds/909BD.wav', 'sounds/909clap.wav', 'sounds/HT10.WAV', 'sounds/crash cymbal.wav', 'sounds/flam_Fltom.wav', 'sounds/crash choke.wav', 'sounds/electronicHH.wav', 'sounds/hi-hat-open.wav'];
    loader.ctx = context;
    loader.onload = function () { 
        for (var i = 0; i < loader.response.length; i++) {
            $scope.bufferPads.push(loader.response[i]);
        }
    };
    loader.onerror = function (err) { 
        console.log(err);
        // alert('Awwwwww snap!');
    };
    loader.send();

// ************************METRONOME FUNCTIONS ****************************//
    $scope.playMetronome = function ($event) {
        // Disable Play button
        $scope.isDisabled = true;
        $scope.metSource = context.createBufferSource();
        $scope.metSource.buffer = $scope.bufferPads[0];
        $scope.metSource.connect(context.destination);
        $scope.metSource.start();
    };

    $scope.pauseMetronome = function ($event) {
        // Enable play button
        $scope.isDisabled = false;
        $scope.metSource.disconnect(context.destination);
        $scope.metSource.stop();
    };


// ************************ KEYPRESS EVENTS ********************************//
    // Keypress events: for each keydown event, play associated sample.
    $document.keydown(function (event) {
        if (event.which == 68) {
            elId = '#pad1';
            playSound($scope.bufferPads[1], context.currentTime, elId);
        }
        if (event.which == 70 || event.which == 83) {
            elId = '#pad2';
            playSound($scope.bufferPads[2], context.currentTime, elId);
        }
        if (event.which == 74) {
            elId = '#pad3';
            playSound($scope.bufferPads[3], context.currentTime, elId);
        }
        if (event.which == 75) {
            elId = '#pad4';
            playSound($scope.bufferPads[4], context.currentTime, elId);
        }
        if (event.which == 88) {
            elId = '#pad5';
            playSound($scope.bufferPads[5], context.currentTime, elId);
        }
        if (event.which == 67) {
            elId = '#pad6';
            playSound($scope.bufferPads[6], context.currentTime, elId);
        }
        if (event.which == 78) {
            elId = '#pad7';
            playSound($scope.bufferPads[7], context.currentTime, elId);
        }
        if (event.which == 77) {
            elId = '#pad8';
            playSound($scope.bufferPads[8], context.currentTime, elId);
        }
    });

    // On keyup, returns pads to original color.
    $document.keyup(function (event) {
        // console.log(event);
        $('#sp div').css('background-color', '#d3d3d3');
    });

    


// ************************ LOOPING SAMPLES ****************************//

    // Toggles loop on/off
    $scope.changeStatus = function(){
        $scope.status = !$scope.status;
    };

    function playSound(buffer, t, elId) {
        // Check if loop switch is on.
        if ($scope.status === true) {
            // This is a temporary fix.
            // t = the time since the user has loaded the page. While that time is < 500 sec, the loop will run every 2 sec.
            // t += ___ corresponds to time in seconds for one measure.
            for (t; t < 200; t += 2) {
                // Changes background color for initial hit.     
                $(elId).css('background-color', '#00AAAA');
                // Runs interval function to change pad color every measure only if loop is not broken.  
                $scope.changePadColor = $interval(function () {
                    if (!$scope.breakLoop) {$(elId).css('background-color', '#00AAAA');}
                }, 2000);
                // Runs interval function to return pad color every measure only if loop is not broken.
                $scope.returnPadColor = $interval(function () {
                    if (!$scope.breakLoop) {$(elId).css('background-color', '#d3d3d3');}
                }, 2010);
                // Get sample buffer from argument of function and start loop.
                $scope.source = context.createBufferSource();
                $scope.source.buffer = buffer;
                $scope.source.connect(context.destination);
                $scope.source.start(t);
            }
        } else {
            // If loop switch is off.
            $(elId).css('background-color', '#00AAAA');
            $scope.source = context.createBufferSource();
            $scope.source.buffer = buffer;
            $scope.source.connect(context.destination);
            $scope.source.start(t);
        }
    }


    // Refreshes page to reset loop. Unable to break out of for loop ^^^, this is temporary solution.
    $scope.reset = function () {
        $window.location.reload();
    };

}]);

