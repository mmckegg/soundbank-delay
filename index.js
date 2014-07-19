var createAudioNode = require('custom-audio-node')
var extendTransform = require('audio-param-transform')

module.exports = Delay

function Delay(audioContext){

  var input = audioContext.createGain()
  var output = audioContext.createGain()

  var delay = audioContext.createDelay()
  var filter = audioContext.createBiquadFilter()
  var feedback = audioContext.createGain()

  var wet = audioContext.createGain()
  var dry = audioContext.createGain()

  extendTransform(delay.delayTime, audioContext)

  var delayTime = delay.delayTime.transform()
  var timeMultiplier = delay.delayTime.transform(multiplier)

  input.connect(dry)
  input.connect(delay)

  delay.connect(filter)

  filter.connect(wet)
  filter.connect(feedback)

  feedback.connect(delay)

  dry.connect(output)
  wet.connect(output)

  var node = createAudioNode(input, output, {
    wet: { defaultValue: 1, min: 0, target: wet.gain },
    dry: { defaultValue: 1, min: 0, target: dry.gain },
    cutoff: { defaultValue: 20000, min: 20, max: 20000, target: filter.frequency },
    feedback: { defaultValue: 0.6, min: 0, target: feedback.gain },
    time: { defaultValue: 0.25, min: 0.02, target: delayTime }
  }, onDestinationChange)

  Object.defineProperty(node, 'sync', {
    get: function(){
      return this._sync
    },
    set: function(value){
      this._sync = value
      refreshTimeMultiplier()
    }
  })

  function refreshTimeMultiplier(){
    if (node.sync && audioContext.scheduler){
      timeMultiplier.value = 120 / audioContext.scheduler.getTempo()
    } else {
      timeMultiplier.value = 1
    }
  }

  function onDestinationChange(count){
    if (count === 1){
      if (audioContext.scheduler){
        audioContext.scheduler.on('tempo', refreshTimeMultiplier)
      }
    } else if (count === 0){
      if (audioContext.scheduler){
        audioContext.scheduler.removeListener('tempo', refreshTimeMultiplier)
      }
    }
  }

  return node

}

function multiplier(a, b){
  return a * (b || 1)
}