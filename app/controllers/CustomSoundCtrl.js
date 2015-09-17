app.controller("CustomSoundCtrl", ["$scope", "storage", "$document", "$http", function ($scope, storage, $document, $http) {

    
    // $(".input-id").fileinput();
    
    var context = storage.context;
    var buffer;

    // Run each $http call to get 4 separate files. 
    $http({
        url: 'sounds/hi-hat-closed.wav',
        method: 'GET',
        responseType: 'arraybuffer'
    })
    .success(function (data) {
        // console.log(data);
        context.decodeAudioData(data, function (buffer) {
            $scope.buffer = buffer;
        });
    });
    


    $document.keypress(function (event) {
        // console.log(event);
        // Plays hi hat on "s" or "d" keypress
        if (event.which == 100 || event.which == 115) {
            playSound();
        }
    });

    function playSound() {
      $scope.source = context.createBufferSource();
      $scope.source.buffer = $scope.buffer;
      $scope.source.connect(context.destination);
      $scope.source.start(0);
    }


}]);