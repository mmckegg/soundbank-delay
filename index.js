var createAudioNode = require('custom-audio-node')

module.exports = Delay

function Delay(audioContext){

  var input = audioContext.createGain()
  var output = audioContext.createGain()

  var delay = audioContext.createDelayNode()
  var filter = audioContext.createBiquadFilter()
  var feedback = audioContext.createGain()

  var wet = audioContext.createGain()
  var dry = audioContext.createGain()

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
    time: { defaultValue: 0.1, min: 0.02, target: delay.delayTime }
  })

  return node

}