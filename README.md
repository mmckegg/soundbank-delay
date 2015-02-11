soundbank-delay
===

Basic delay processor AudioNode with feedback, filter and wet/dry AudioParams.

Intended for use as a processor in [soundbank](https://github.com/mmckegg/soundbank), but it is compatible with any [Web Audio API](https://developer.mozilla.org/en-US/docs/Web_Audio_API) AudioNode set up.

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

### node.sync (get/set)

When `true`, the delay rate is multiplied by `60 / node.tempo` to allow beat sync.

### node.time ([AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam))

Time the feedback should be delayed by. Maximum value is 4 seconds.

If `node.sync` is `true`, this is the number or fraction of beats the feedback should be delayed by.

### node.wet (AudioParam)

### node.dry (AudioParam)

### node.cutoff (AudioParam)

### `reverb.filterType` (get/set)

Defaults to `"lowpass"`.

Can be any of the filters types specified by [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode.type)

### node.feedback (AudioParam)

## Example

```js
var Delay = require('soundbank-delay')

var audioContext = new AudioContext()

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