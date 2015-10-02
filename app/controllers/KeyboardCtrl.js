app.controller("KeyboardCtrl", ["$scope", "instruments", "storage", function ($scope, instruments, storage) {

    // Gets audio context for app from app.js.
    var context = storage.context,
        // Sets up keyboard settings
        settings = {
          id: 'keyboard',
          width: 800,
          height: 200,
          startNote: 'A2',
          whiteNotesColour: '#ff0',
          blackNotesColour: '#000',
          borderColour: '#000',
          activeColour: '#00AAAA',
          octaves: 2
        },
        // Creates new keyboard from Qwerty Hancock plugin.
        keyboard = new QwertyHancock(settings);

    // Gets gain for app from app.js.
    var gain = storage.gain;

    // $scope.waveType = "";
    $scope.waveTypeList = ['Sine', 'Sawtooth', 'Triangle'];
    $scope.placeholderWaveValues = [{value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}];
    $scope.customWaveValues = [];
    $scope.radioModel = 'Waves';
    $scope.instruments = instruments; // Grabs object from preProgrammed.js factory.
    // $scope.chosenInstrument = "";
    $scope.showTable = true;

    // Sets gain value and connects to computer speakers.
    gain.gain.value = 0.5;
    gain.connect(context.destination);
    nodes = [];
    // recordingFactory();
    // console.log(Recorder);
    
    // Unbinds events from other pages.
    $(document).unbind('keydown');
    $(document).unbind('keyup');

    // Disconnects oscillator and gain when leaving the page.
    $scope.closeAudio = function () {
        gain.disconnect(context.destination);
        $scope.vco = null;
        // $scope.waveType = '';
        // $scope.chosenInstrument = '';
    };

    // Sets oscillator values based on instrument chosen in select box.
    $scope.chooseInstrument = function (chosenInstrument) {

        // Modal progress bar to show while loading instrument.
        var $modal = $('.js-loading-bar'),
        $bar = $modal.find('.progress-bar');
        $modal.modal('show');
        $bar.addClass('animate');
        setTimeout(function() {
        $bar.removeClass('animate');
        $modal.modal('hide');
        }, 1500);

        // console.log(chosenInstrument)
        // console.log($scope.instruments[chosenInstrument]);
        setCustomWave($scope.instruments[chosenInstrument]);
    };

    // Function to show/hide legend for keystroke to notes.
    $scope.toggleTable = function () {
        if ($scope.showTable === false) {
            $scope.showTable = true;
        } else {
            $scope.showTable = false;
        }
    };
    
    // Creates custom sound wave based on user input.
    $scope.createWave = function (customWaveValues) {
        // console.log(customWaveValues);
        var finalCustomValues = [];
        var stringToNumber = (customWaveValues.map(Number));
        stringToNumber.map(function (value) {
            value = value / 100;
            finalCustomValues.push(value);
        });
        console.log(finalCustomValues);
        setCustomWave(finalCustomValues);

    };

    // Sets floating point array values for custom oscillator wave.
    function setCustomWave (values) {
        var realArray = new Float32Array(values);
        var imagArray = new Float32Array(realArray.length);
        $scope.customWave = context.createPeriodicWave(realArray, imagArray);
    }


    /* Connections */

    // Function from Qwerty Hancock library. Passes note freq to function based on which key is pressed.
    keyboard.keyDown = function (note, frequency) {
        // console.log(frequency);
        $scope.vco = context.createOscillator();
        // Checks which radio button is selected and sets oscillator values appropriately.
        if ($scope.radioModel === 'Waves') {
            // console.log($scope.waveType.toLowerCase());
            $scope.vco.type = $scope.waveType.toLowerCase()
        } else if ($scope.radioModel === 'Custom' || $scope.radioModel === 'Instrument') {
            $scope.vco.setPeriodicWave($scope.customWave);    
        }

        // Connects oscillator to gain node and starts oscillator.
        $scope.vco.frequency.value = frequency;
        $scope.vco.connect(gain);
        $scope.vco.start(0);
        // Gain nodes
        nodes.push($scope.vco);
        
    };

    keyboard.keyUp = function (note, frequency) {
        var new_nodes = [];
        for (var i = 0; i < nodes.length; i++) {
          if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0); // Stops that node from playing at the current moment, i.e. in 0 seconds.
            nodes[i].disconnect(); // Disconnects node from speakers.
          } else {
            new_nodes.push(nodes[i]);
          }
        }
        // console.log(nodes);
        // context.createMediaStreamSource(stream);
        nodes = new_nodes;

    };

    // Modal progress bar runs when select boxes change to give enough time for browser to load instruments.
    $scope.load = function () {
        var $modal = $('.js-loading-bar'),
        $bar = $modal.find('.progress-bar');

        $modal.modal('show');
        $bar.addClass('animate');

        setTimeout(function() {
            $bar.removeClass('animate');
            $modal.modal('hide');
        }, 1500);


    };
        
}]);

