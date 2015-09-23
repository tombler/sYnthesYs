app.controller("CustomSoundCtrl", ["$scope", "storage", "$document", "$http", "$firebaseArray", "$interval", "$window", function ($scope, storage, $document, $http, $firebaseArray, $interval, $window) {
    
    var context = storage.context;
    var buffer;
    var elId;

    // Run each $http call to get 4 separate files.
    // Store each buffer result as separate variable
    // add buffer argument to playSound function
    
    $http({
        url: 'sounds/120bpm.mp3',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.metronome = buffer;
            // console.log(buffer);
            
        });
    });

    $http({
        url: 'sounds/909BD.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad1 = buffer;
            // console.log(buffer);
            
        });
    });

    $http({
        url: 'sounds/909clap.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad2 = buffer;
        });
    });

    $http({
        url: 'sounds/HT10.WAV',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad3 = buffer;
        });
    });

    $http({
        url: 'sounds/crash cymbal.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad4 = buffer;
        });
    });

    $http({
        url: 'sounds/flam_Fltom.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad5 = buffer;
        });
    });

    $http({
        url: 'sounds/crash choke.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad6 = buffer;
        });
    });

    $http({
        url: 'sounds/electronicHH.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad7 = buffer;
        });
    });

    $http({
        url: 'sounds/hi-hat-open.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.bufferPad8 = buffer;
        });
    });    



    // 8 buffers, 8 slots

    $scope.buffersObject = {
        slots: [
            {
                buffer: $scope.bufferPad1,
                name: "Bass drum"
            },
            {
                buffer: $scope.bufferPad2,
                name: "Piccolo snare"
            },
            {
                buffer: $scope.bufferPad3,
                name: "Closed hi hat"
            },
            {
                buffer: $scope.bufferPad4,
                name: "Crash cymbal"
            },
            {
                buffer: $scope.bufferPad5,
                name: "Floor tom"
            },
            {
                buffer: $scope.bufferPad6,
                name: "Trap kick"
            },
            {
                buffer: $scope.bufferPad7,
                name: "Electronic hi hat"
            },
            {
                buffer: $scope.bufferPad8,
                name: "Open hi hat"
            }
        ]
    };
    
    var loop;
    $scope.isDisabled = false;

    $scope.playMetronome = function ($event) {
        $scope.isDisabled = true;
        $scope.metSource = context.createBufferSource();
        $scope.metSource.buffer = $scope.metronome;
        // $scope.metLoop = context.createDelay(0.5);
        // $scope.metLoop.delayTime.value = 0.5;
        // $scope.metSource.connect($scope.metLoop);
        // $scope.metLoop.connect($scope.metLoop);
        // $scope.metLoop.connect(context.destination);
        $scope.metSource.connect(context.destination);
        $scope.metSource.start();
        // playMetronome();
    };

    $scope.pauseMetronome = function ($event) {
        $scope.isDisabled = false;
        $scope.metSource.disconnect(context.destination);
        $scope.metSource.stop();
    };

    // Construct if statement in keypress event handler and pass diff buffers to playSound
    $document.keydown(function (event) {
        if (event.which == 68) {
            elId = '#pad1';
            playSound($scope.bufferPad1, context.currentTime, elId);
        }
        if (event.which == 70 || event.which == 83) {
            elId = '#pad2';
            playSound($scope.bufferPad2, context.currentTime, elId);
        }
        if (event.which == 74) {
            elId = '#pad3';
            playSound($scope.bufferPad3, context.currentTime, elId);
        }
        if (event.which == 75) {
            elId = '#pad4';
            playSound($scope.bufferPad4, context.currentTime, elId);
        }
        if (event.which == 88) {
            elId = '#pad5';
            playSound($scope.bufferPad5, context.currentTime, elId);
        }
        if (event.which == 67) {
            elId = '#pad6';
            playSound($scope.bufferPad6, context.currentTime, elId);
        }
        if (event.which == 78) {
            elId = '#pad7';
            playSound($scope.bufferPad7, context.currentTime, elId);
        }
        if (event.which == 77) {
            elId = '#pad8';
            playSound($scope.bufferPad8, context.currentTime, elId);
        }
    });

    $document.keyup(function (event) {
        // console.log(event);
        $('#sp div').css('background-color', 'green');
    });

    $scope.breakLoop = false;

    function playSound(buffer, t, elId) {
        for (t; t < 100; t += 2) {     
          $(elId).css('background-color', 'black');
          $scope.changePadColor = $interval(function () {
            // Runs interval function to change pad color only if loop is not broken.
            if (!$scope.breakLoop) {
                $(elId).css('background-color', 'black');
            }
          }, 2000);
          $scope.returnPadColor = $interval(function () {
            // Runs interval function to return pad color only if loop is not broken.
            if (!$scope.breakLoop) {
                $(elId).css('background-color', 'green');
            }
          }, 2010);
          $scope.source = context.createBufferSource();
          $scope.source.buffer = buffer;
          $scope.source.connect(context.destination);
          $scope.source.start(t);
        }
    }

    $scope.reset = function () {
        $window.location.reload();
    };


    




}]);