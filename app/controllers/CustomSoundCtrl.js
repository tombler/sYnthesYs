app.controller("CustomSoundCtrl", ["$scope", "storage", "$document", "$http", "$firebaseArray", "$interval", function ($scope, storage, $document, $http, $firebaseArray, $interval) {

    
    // $(".input-id").fileinput();
    
    var context = storage.context;
    var buffer;

    // Run each $http call to get 4 separate files.
    // Store each buffer result as separate variable
    // add buffer argument to playSound function
    // Construct if statement in keypress event handler and pass diff buffers to playSound
    $http({
        url: 'sounds/click.wav',
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
        url: 'sounds/stab-kik.wav',
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
        url: 'sounds/piccolo-snare.wav',
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
        url: 'sounds/hi-hat-closed.wav',
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
        url: 'sounds/trap_kick.wav',
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
    var metronome;

    $scope.playMetronome = function () {
        // metronome = $interval(function () {playSound($scope.metronome);}, 500);
        $scope.metSource = context.createBufferSource();
        $scope.metSource.buffer = $scope.metronome;
        $scope.metLoop = context.createDelay(0.5);
        $scope.metLoop.delayTime.value = 0.5;
        $scope.metSource.connect($scope.metLoop);
        $scope.metLoop.connect($scope.metLoop);
        $scope.metLoop.connect(context.destination);
        $scope.metSource.start();
        // playMetronome();
    };

    $scope.pauseMetronome = function () {
        $scope.metLoop.disconnect(context.destination);
        $scope.metSource.stop();
    };

    
    $document.keydown(function (event) {
        // console.log(event);
        // Plays hi hat on "s" or "d" keypress
        if (event.which == 68) {
            playSound($scope.bufferPad1);
            // loop = $interval(function () {playSound($scope.bufferPad1);}, 2000);
            $('#pad1').css('background-color', 'black');
        }
        if (event.which == 70 || event.which == 83) {
            playSound($scope.bufferPad2);
            $('#pad2').css('background-color', 'black');
        }
        if (event.which == 74) {
            playSound($scope.bufferPad3);
            $('#pad3').css('background-color', 'black');
        }
        if (event.which == 75) {
            playSound($scope.bufferPad4);
            $('#pad4').css('background-color', 'black');
        }
        if (event.which == 88) {
            playSound($scope.bufferPad5);
            $('#pad5').css('background-color', 'black');
        }
        if (event.which == 67) {
            playSound($scope.bufferPad6);
            $('#pad6').css('background-color', 'black');
        }
        if (event.which == 78) {
            playSound($scope.bufferPad7);
            $('#pad7').css('background-color', 'black');
        }
        if (event.which == 77) {
            playSound($scope.bufferPad8);
            $('#pad8').css('background-color', 'black');
        }

    });

    $document.keyup(function (event) {
        // console.log(event);
        if (event.which == 68) {
            // Run stopSound ($scope.source.stop())
            // stopSound();
            $('#pad1').css('background-color', 'green');
        }
        if (event.which == 70 || event.which == 83) {
            // stopSound();
            $('#pad2').css('background-color', 'green');   
        }
        if (event.which == 74) {
            // stopSound();
            $('#pad3').css('background-color', 'green');
        }
        if (event.which == 75) {
            // stopSound();
            $('#pad4').css('background-color', 'green');
        }
        if (event.which == 88) {
            // stopSound();
            $('#pad5').css('background-color', 'green');
        }
        if (event.which == 67) {
            // stopSound();
            $('#pad6').css('background-color', 'green');
        }
        if (event.which == 78) {
            // stopSound();
            $('#pad7').css('background-color', 'green');
        }
        if (event.which == 77) {
            // stopSound();
            $('#pad8').css('background-color', 'green');
        }
    });


    // function playMetronome() {
    //     $scope.metSource = context.createBufferSource();
    //     $scope.metSource.buffer = $scope.metronome;
    //     $scope.metLoop = context.createDelay(0.5);
    //     $scope.metLoop.delayTime.value = 0.5;
    //     $scope.metSource.connect($scope.metLoop);
    //     $scope.metLoop.connect($scope.metLoop);
    //     $scope.metLoop.connect(context.destination);
    //     $scope.metSource.start();
    // }


// In order to fix bug of notes stopping play: write function that creates new variable for source and loop each time a key is pressed.
    function playSound(buffer) {
      $scope.source = context.createBufferSource();
      $scope.source.buffer = buffer;
      // $scope.delayGain = context.createGain();
      // $scope.delayGain.gain.value = 0;
      $scope.loop = context.createDelay(2.0);
      $scope.loop.delayTime.value = 2.0;

      $scope.source.connect($scope.loop);
      $scope.loop.connect($scope.loop);
      $scope.loop.connect(context.destination);

      // $scope.source.connect($scope.delayGain);
      // $scope.delayGain.connect($scope.loop);
      // $scope.loop.connect($scope.loop);
      // $scope.loop.connect(context.destination);
      // delayGain.connect(context.destination);
      $scope.source.connect(context.destination);
      var quant = (Math.floor(context.currentTime / 0.5)) * 0.5;
      $scope.source.start(quant);


    }

    function stopSound() {
        $scope.source.disconnect(context.destination);
        $scope.source.stop();
    }
    

    // Start metronome at static tempo 120 bpm through <audio loop=true>

    // Create 4 second loop (2 measures)


    
    // On each strike: run playSound() AND loopedSound()
        // loopedSound: create a delay that runs every 4 seconds, feedback on infinite.





}]);