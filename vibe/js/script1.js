const container = document.querySelector('#svg_container')
const clientContainer = container.getBoundingClientRect()

// const points = []
// const valuesSin = []

// // create Values to Seno's
// for(let g = 0; g < 360; g++) {
//   valuesSin.push(Math.sin(g * Math.PI / 180))
// }

console.log()

let config = {
  w: Number(container.getAttribute('width')),
  h: Number(container.getAttribute('height')),
  x: 0,
  y: Number(container.getAttribute('height')) / 2,
  numPoints: 100,
  oscillate: {
    velGrades: 1,
    maxGrades: 360-1,
    gradeOrigin: 0,
    sizeCrest: 20/2 // px
  }
}

let sizeC = {
  w: clientContainer.width,
  h: clientContainer.height
}

// oscillate
function oscillate ( vel = config.oscillate.velGrades, resistance = 0, sentido = true ) {
  /**
   * @param { number } resistance - disminuye la velocidad con la que se propagan los grados ( 0 - 1)
   */
  if(config.oscillate.velGrades != vel) config.oscillate.velGrades = vel

  config.oscillate.gradeOrigin += Math.round(config.oscillate.velGrades)
  
  if(config.oscillate.gradeOrigin > config.oscillate.maxGrades) {
    config.oscillate.gradeOrigin %= config.oscillate.maxGrades+1
  }

  container.innerHTML = ''

  let path = '<path d="M'
  const command = 'L'
  const endPath = '" fill="#0000" stroke="black" stroke-width="5" />'

  const rdx = 1 / config.numPoints
  const addGrades = config.oscillate.maxGrades * rdx * (1-resistance)

  for( let p = 0; p < config.numPoints; p++ ) {
    
    let grade = config.oscillate.gradeOrigin + addGrades * p
    
    if(grade > config.oscillate.maxGrades) 
      grade %= config.oscillate.maxGrades+1

    // y
    // let y = valuesSin[grade]
    let y = Math.sin(grade*Math.PI/180)

    const media = (config.numPoints - 1)/2

    y*= Math.sin(Math.PI * ( (media - (media - p)) / media ))
    // y *= ((config.numPoints-1)/2 - Math.abs((config.numPoints-1)/2 - p)) / (config.numPoints-1)/2
    y *= config.oscillate.sizeCrest
    y += config.y

    // x
    const x = rdx * p * config.w

    // point in the body
    const selectCommand = p == 0 ? '' : command

    if(isNaN(y)) console.log(y, p, grade)

    if(p + 1 < config.numPoints) {
      path += ` ${selectCommand}${x} ${y}`
      continue
    }

    // final point
    path += ` ${command}${x} ${y}` + ` ${endPath}`
  }
  
  container.innerHTML = path
}


const mlp = {
  t: { // (ms)
    init: 0, // initial for cicle
    last: 0, // util to create delta time
    act: 0 // actual time
  },
  fps: 0
}

function mainLoop (t = 0) {
  mlp.fps++

  if(t - mlp.t.init > 999) {
    mlp.t.init = t

    console.log(mlp.fps) // display frames per second
    mlp.fps = 0
  }

  oscillate(7, .46)
  // loop
  window.requestAnimationFrame(mainLoop)
}

mainLoop()