app.factory("recordingFactory", function () {
    return function () {
        // console.log("Linked");
        // var recLength = 0,
        //   recBuffers = [],
        //   sampleRate,
        //   numChannels;

        // this.onmessage = function(e){
        //   switch(e.data.command){
        //     case 'init':
        //       init(e.data.config);
        //       break;
        //     case 'record':
        //       record(e.data.buffer);
        //       break;
        //     case 'exportWAV':
        //       exportWAV(e.data.type);
        //       break;
        //     case 'getBuffer':
        //       getBuffer();
        //       break;
        //     case 'clear':
        //       clear();
        //       break;
        //   }
        // };

        // function init(config){
        //   sampleRate = config.sampleRate;
        //   numChannels = config.numChannels;
        //   initBuffers();
        // }

        // function record(inputBuffer){
        //   for (var channel = 0; channel < numChannels; channel++){
        //     recBuffers[channel].push(inputBuffer[channel]);
        //   }
        //   recLength += inputBuffer[0].length;
        // }

        // function exportWAV(type){
        //   var buffers = [];
        //   for (var channel = 0; channel < numChannels; channel++){
        //     buffers.push(mergeBuffers(recBuffers[channel], recLength));
        //   }
        //   if (numChannels === 2){
        //       var interleaved = interleave(buffers[0], buffers[1]);
        //   } else {
        //       var interleaved = buffers[0];
        //   }
        //   var dataview = encodeWAV(interleaved);
        //   var audioBlob = new Blob([dataview], { type: type });

        //   this.postMessage(audioBlob);
        // }

        // function getBuffer(){
        //   var buffers = [];
        //   for (var channel = 0; channel < numChannels; channel++){
        //     buffers.push(mergeBuffers(recBuffers[channel], recLength));
        //   }
        //   this.postMessage(buffers);
        // }

        // function clear(){
        //   recLength = 0;
        //   recBuffers = [];
        //   initBuffers();
        // }

        // function initBuffers(){
        //   for (var channel = 0; channel < numChannels; channel++){
        //     recBuffers[channel] = [];
        //   }
        // }

        // function mergeBuffers(recBuffers, recLength){
        //   var result = new Float32Array(recLength);
        //   var offset = 0;
        //   for (var i = 0; i < recBuffers.length; i++){
        //     result.set(recBuffers[i], offset);
        //     offset += recBuffers[i].length;
        //   }
        //   return result;
        // }

        // function interleave(inputL, inputR){
        //   var length = inputL.length + inputR.length;
        //   var result = new Float32Array(length);

        //   var index = 0,
        //     inputIndex = 0;

        //   while (index < length){
        //     result[index++] = inputL[inputIndex];
        //     result[index++] = inputR[inputIndex];
        //     inputIndex++;
        //   }
        //   return result;
        // }

        // function floatTo16BitPCM(output, offset, input){
        //   for (var i = 0; i < input.length; i++, offset+=2){
        //     var s = Math.max(-1, Math.min(1, input[i]));
        //     output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        //   }
        // }

        // function writeString(view, offset, string){
        //   for (var i = 0; i < string.length; i++){
        //     view.setUint8(offset + i, string.charCodeAt(i));
        //   }
        // }

        // function encodeWAV(samples){
        //   var buffer = new ArrayBuffer(44 + samples.length * 2);
        //   var view = new DataView(buffer);

        //   /* RIFF identifier */
        //   writeString(view, 0, 'RIFF');
        //   /* RIFF chunk length */
        //   view.setUint32(4, 36 + samples.length * 2, true);
        //   /* RIFF type */
        //   writeString(view, 8, 'WAVE');
        //   /* format chunk identifier */
        //   writeString(view, 12, 'fmt ');
        //   /* format chunk length */
        //   view.setUint32(16, 16, true);
        //   /* sample format (raw) */
        //   view.setUint16(20, 1, true);
        //   /* channel count */
        //   view.setUint16(22, numChannels, true);
        //   /* sample rate */
        //   view.setUint32(24, sampleRate, true);
        //   /* byte rate (sample rate * block align) */
        //   view.setUint32(28, sampleRate * 4, true);
        //   /* block align (channel count * bytes per sample) */
        //   view.setUint16(32, numChannels * 2, true);
        //   /* bits per sample */
        //   view.setUint16(34, 16, true);
        //   /* data chunk identifier */
        //   writeString(view, 36, 'data');
        //   /* data chunk length */
        //   view.setUint32(40, samples.length * 2, true);

        //   floatTo16BitPCM(view, 44, samples);

        //   return view;
        // }

    };
});





































    // function __log(e, data) {
    //   log.innerHTML += "\n" + e + " " + (data || '');
    // }

    // // var audio_context;
    // var recorder;

    // (function startUserMedia(stream) {
    //   var input = context.createMediaStreamSource(stream);
    //   __log('Media stream created.');

    //   // Uncomment if you want the audio to feedback directly
    //   //input.connect(audio_context.destination);
    //   //__log('Input connected to audio context destination.');
      
    //   recorder = new Recorder(input);
    //   __log('Recorder initialised.');
    // })();

    // $scope.startRecording = function (event) {
    //   console.log("Triggered start.");
    //   recorder && recorder.record();
    //   // event.target.disabled = true;
    //   // event.target.nextElementSibling.disabled = false;
    //   __log('Recording...');
    // }

    // function stopRecording(event) {
    //   console.log("Trigger stop");
    //   recorder && recorder.stop();
    //   // event.target.disabled = true;
    //   // event.target.previousElementSibling.disabled = false;
    //   __log('Stopped recording.');
      
    //   // create WAV download link using audio data blob
    //   createDownloadLink();
      
    //   recorder.clear();
    // }

    // function createDownloadLink() {
    //   recorder && recorder.exportWAV(function(blob) {
    //     var url = URL.createObjectURL(blob);
    //     var li = document.createElement('li');
    //     var au = document.createElement('audio');
    //     var hf = document.createElement('a');
        
    //     au.controls = true;
    //     au.src = url;
    //     hf.href = url;
    //     hf.download = new Date().toISOString() + '.wav';
    //     hf.innerHTML = hf.download;
    //     li.appendChild(au);
    //     li.appendChild(hf);
    //     recordingslist.appendChild(li);
    //   });
    // }

    // (function init() {
    //   // try {
    //   //   // webkit shim
    //   //   window.AudioContext = window.AudioContext || window.webkitAudioContext;
    //   //   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    //   //   window.URL = window.URL || window.webkitURL;
        
    //   //   audio_context = new AudioContext;
    //   //   __log('Audio context set up.');
    //   //   __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    //   // } catch (e) {
    //   //   alert('No web audio support in this browser!');
    //   // }

    //   // navigator.getUserMedia = ( navigator.getUserMedia ||
    //   //                  navigator.webkitGetUserMedia ||
    //   //                  navigator.mozGetUserMedia ||
    //   //                  navigator.msGetUserMedia);

      
    //   navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    //     __log('No live audio input: ' + e);
    //   });
      
    //   console.log("Init ffunction happened");
    // })();
