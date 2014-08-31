module.exports = Delay

function Delay(audioContext){

  var node = audioContext.createGain()
  node.output = audioContext.createGain()

  var live = audioContext.createGain()
  node.connect(live)
  node.output.connect(live)
  var voltage = flatten(live)

  var delay = audioContext.createDelay()
  var filter = audioContext.createBiquadFilter()
  var feedback = audioContext.createGain()

  var wet = audioContext.createGain()
  var dry = audioContext.createGain()

  var delayTimeVoltage = scale(voltage)
  var timeMultiplier = audioContext.createGain()
  timeMultiplier.gain.value = 1

  delayTimeVoltage.connect(timeMultiplier)
  timeMultiplier.connect(delay.delayTime)

  node.connect(dry)
  node.connect(delay)

  delay.connect(filter)

  filter.connect(wet)
  filter.connect(feedback)

  feedback.connect(delay)

  dry.connect(node.output)
  wet.connect(node.output)



  node.wet = wet.gain
  node.wet.value = 1

  node.dry = dry.gain
  node.dry.value = 1

  node.cutoff = filter.frequency
  node.cutoff.value = 20000

  node.feedback = feedback.gain
  node.feedback.value = 0.6

  node.time = delayTimeVoltage.gain
  node.time.value = 0.25

  node._scheduler = audioContext.scheduler
  this._syncing = false
  node._refreshTimeMultiplier = refreshTimeMultiplier.bind(node)
  node._timeMultiplier = timeMultiplier.gain

  Object.defineProperty(node, 'sync', {
    get: function(){
      return this._sync
    },
    set: function(value){
      this._sync = value
      node._refreshTimeMultiplier()
    }
  })

  node.connect = connect
  node.disconnect = disconnect

  return node

}

function connect(){
  if (!this._syncing && this._scheduler){
    this._scheduler.on('tempo', this._refreshTimeMultiplier)
    this._syncing = true
  }

  this.output.connect.apply(this.output, arguments)
}

function disconnect(){
  if (this._syncing){
    this._scheduler.removeListener('tempo', this._refreshTimeMultiplier)
    this._syncing = false
  }

  this.output.disconnect.apply(this.output, arguments)
}

function refreshTimeMultiplier(){
  if (this.sync && this._scheduler){
    this._timeMultiplier.value = 120 / this._scheduler.getTempo()
  } else {
    this._timeMultiplier.value = 1
  }
}

var flat = new Float32Array([1,1])
function flatten(node){
  var shaper = node.context.createWaveShaper()
  shaper.curve = flat
  node.connect(shaper)
  return shaper
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function multiplier(a, b){
  return a * (b || 1)
}