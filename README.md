soundbank-delay
===

Basic delay processor AudioNode with feedback, filter and wet/dry AudioParams.

## Install

```bash
$ npm install soundbank-delay
```

## API

```js
var Delay = require('soundbank-delay')
```

### Delay(audioContext)

Create and return an [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) instance.

### node.time

### node.wet

### node.dry

### node.cutoff

### node.feedback

## Example

```js
var Delay = require('soundbank-delay')

var audioContext = new webkitAudioContext()

var delay = Delay(audioContext)
delay.connect(audioContext.destination)

delay.time.value = 0.2 //seconds
delay.wet.value = 0.8
delay.dry.value = 1
delay.cutoff.value = 400 //Hz
delay.feedback.value = 0.6

setInterval(function(){
  var source = audioContext.createOscillator()
  source.connect(delay)
  source.start()
  source.stop(audioContext.currentTime + 0.5)
}, 2000)
```