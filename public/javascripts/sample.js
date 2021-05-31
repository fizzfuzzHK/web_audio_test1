window.onload = init;
var context;
var bufferLoader;

const inputElem = document.getElementById('tempo');
// 現在の値を出力
console.log(inputElem.value);

const tempoOnChange = (e) => {
    setTempo(e.target.value)
}

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../sounds/CH_808_01.wav',
      '../sounds/SD 909 A 01.wav',
      '../sounds/02_D_Kick2.wav'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {

var startTime = context.currentTime + 0.100;
var tempo = 130; // BPM (beats per minute)
var fourthNoteTime = (60 / tempo);
var eighthNoteTime = (60 / tempo) / 2;
const sixteenthNoteTime = (60 / tempo) / 4;


const kick = bufferList[2];
const snare = bufferList[1];
const hihat = bufferList[0];

let trigger = 0;

const tempoOnChange = (e) => {
    setTempo(e.target.value)
}

const setTempo = (value) => {
    trigger = value
}

inputElem.addEventListener('input', tempoOnChange); // スライダー変化時にイベントを発火
setTempo(inputElem.value);
  
const setTime = () => {
    setTimeout(() => {
        // playSound2(hihat)
        console.log("set")
        setTime()
    },trigger)
}

setTime()

for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    for (var i = 0; i < 4; ++i) {
        playSound(kick, time + i * fourthNoteTime);
      }
    // Play the snare drum on beats 3, 7
    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);
  
    // Play the hi-hat every eighth note.
    // for (var i = 0; i < 16; ++i) {
    //   playSound(hihat, time + i * sixteenthNoteTime);
    // }
  }
}


function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }

function playSound2(buffer) {
    
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  }

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }
  
  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  
    request.send();
  }
  
  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }
  