var Delay = require('./index')

var audioContext = new webkitAudioContext()

var delay = Delay(audioContext)
delay.connect(audioContext.destination)

addSlider(delay.wet, 0.01, null, 4)
addSlider(delay.dry, 0.01, null, 4)
addSlider(delay.cutoff)
addSlider(delay.feedback, 0.01, null, 2)
addSlider(delay.time, 0.01, null, 4)

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

function addSlider(param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(param.name))
  var label = document.createTextNode(param.defaultValue)
  var slider = document.createElement('input')
  slider.type = 'range'
  slider.min = min != null ? min : (param.min || 0)
  slider.max = max != null ? max : (param.max || 100)
  slider.value = param.defaultValue

  slider.style.width = '300px'

  if (step){
    slider.step = step
  }

  slider.onchange = function(){
    label.data = this.value
    param.value = parseFloat(this.value)
  }
  container.appendChild(slider)
  container.appendChild(label)
  document.body.appendChild(container)
}