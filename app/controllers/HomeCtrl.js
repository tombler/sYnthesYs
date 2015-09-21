app.controller("HomeCtrl", ["$scope", "instruments", "recordingFactory", "storage", function ($scope, instruments, recordingFactory, storage) {

    $scope.waveType = "";
    $scope.waveTypeList = ['Sine', 'Sawtooth', 'Triangle'];
    $scope.placeholderWaveValues = [{value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}, {value: "Enter a number 0-99"}];
    $scope.customWaveValues = [];
    $scope.radioModel = 'Waves';
    $scope.instruments = instruments;
    $scope.chosenInstrument = "";
    $scope.showTable = false;
    // recordingFactory();
    // console.log(Recorder);
    $(document).unbind('keydown');
    $(document).unbind('keyup');

    $scope.closeAudio = function () {
        gain.disconnect(context.destination);
        $scope.vco = null;
    };


    $scope.chooseInstrument = function (chosenInstrument) {
        // console.log(chosenInstrument)
        // console.log($scope.instruments[chosenInstrument]);
        setCustomWave($scope.instruments[chosenInstrument]);
    };

    $scope.toggleTable = function () {
        if ($scope.showTable === false) {
            $scope.showTable = true;
        } else {
            $scope.showTable = false;
        }
    };
    

    var context = storage.context,
        settings = {
          id: 'keyboard',
          width: 600,
          height: 150,
          startNote: 'A2',
          whiteNotesColour: '#fff',
          blackNotesColour: '#000',
          borderColour: '#000',
          activeColour: 'yellow',
          octaves: 2
        },
        keyboard = new QwertyHancock(settings);

    var gain = storage.gain;

    storage.addJunk("gain", gain);
    storage.addJunk("context", context);
    
    gain.gain.value = 0.3;
    gain.connect(context.destination);
    nodes = [];

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

    function setCustomWave (values) {
        var realArray = new Float32Array(values);
        var imagArray = new Float32Array(realArray.length);
        $scope.customWave = context.createPeriodicWave(realArray, imagArray);
    }

    function customOrNot (vco) {  
        if ($scope.radioModel === 'Waves') {
            $scope.vco.type = $scope.waveType.toLowerCase() || 'sine';    
        } else if ($scope.radioModel === 'Custom' || $scope.radioModel === 'Instrument') {
            $scope.vco.setPeriodicWave($scope.customWave);    
        }
    }
      
      
    /* Connections */

    keyboard.keyDown = function (note, frequency) {
        // console.log(frequency);
        $scope.vco = context.createOscillator();
        // var dest = context.createMediaStreamDestination();
        // var recorder = new Recorder(dest.stream);
        // $scope.vco.connect(dest);
        customOrNot($scope.vco);
        $scope.vco.frequency.value = frequency;
        $scope.vco.connect(gain);
        $scope.vco.start(0);


        nodes.push($scope.vco);
        
    };

    keyboard.keyUp = function (note, frequency) {

        var new_nodes = [];

        for (var i = 0; i < nodes.length; i++) {
          if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0); // Stops that node from playing at the current moment, i.e. in 0 seconds.
            nodes[i].disconnect(); // Presumably disconnects from destination? Actual code is maybe gain.disconnect(context.destination)?
          } else {
            new_nodes.push(nodes[i]);
          }
        }

        console.log(nodes);
        // context.createMediaStreamSource(stream);
        nodes = new_nodes;

    };
        
}]);

