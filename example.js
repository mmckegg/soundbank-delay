var Delay = require('./index')

var audioContext = new AudioContext()

var delay = Delay(audioContext)
delay.connect(audioContext.destination)

addSlider('wet', delay.wet, 0.01, null, 4)
addSlider('dry', delay.dry, 0.01, null, 4)
addSlider('cutoff', delay.cutoff)
addSlider('feedback', delay.feedback, 0.01, null, 2)
addSlider('time', delay.time, 0.01, null, 4)

addButton('trigger source', function(){
  var source = audioContext.createOscillator()
  source.type = 'square'
  source.detune.value = -2400
  source.connect(delay)
  source.start()

  up = function(){
    source.stop()
  }

}, function(){
  up&&up()
})


function addButton(name, down, up){
  var button = document.createElement('button')
  button.onmousedown = down
  button.onmouseup = up
  button.textContent = name
  document.body.appendChild(button)
}

function addSlider(name, param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(name))
  var label = document.createTextNode(param.value)
  var slider = document.createElement('input')
  slider.type = 'range'

  var min = min != null ? min : (param.minValue || 0)
  var max = max != null ? max : (param.maxValue || 100)

  var range = max - min

  slider.min = min
  slider.max = max
  slider.step = step || (range / 100)

  slider.value = param.value
  slider.style.width = '300px'


  slider.oninput = function(){
    label.data = this.value
    param.value = parseFloat(this.value)
  }
  container.appendChild(slider)
  container.appendChild(label)
  document.body.appendChild(container)
}