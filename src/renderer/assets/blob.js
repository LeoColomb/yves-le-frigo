
/**
 * Blob for Graphism.fr
 * Copyright (c) 2016 Geoffrey Dorne SAS. All Rights Reserved.
 *
 * @author 2013 Dionysis Zindros (www.dionyziz.com)
 * @author 2016 Léo Colombaro (colombaro.fr)
 */
const NUM_WAVES = 7
const BLUR_RADIUS = 30
const THETA_RESOLUTION = 0.05

export class Blob {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param options
   */
  constructor (context, options = {}) {
    this.time = new Date() | 0

    this.localOptions = Object.assign({
      width: 80,
      height: 80,
      fillColor: '#ffffff',
      shadowColor: '#ffffff'
    }, options)

    this.context = context

    this.size()
    this.generateWaves()
  }

  size () {
    this.radius = window.innerWidth / 800
    this.context.shadowBlur = BLUR_RADIUS * this.radius
  }

  generateWaves () {
    this.waves = []
    for (let i = 0; i < NUM_WAVES; ++i) {
      this.waves[i] = new Wave()
    }
  }

  polarFunction (theta) {
    let r = this.radius

    for (let i = 0; i < NUM_WAVES; ++i) {
      let wave = this.waves[i]
      r += wave.alpha * Math.sin(wave.omega * theta + wave.phi)
    }
    return r * 2
  }

  drawFrame () {
    // this.context.shadowBlur = 20 * this.radius
    // this.context.fillStyle = 'rgba(0, 0, 0, 1)'
    // this.context.beginPath()
    // for (let theta = 0; theta < 2 * Math.PI; theta += THETA_RESOLUTION) {
    //   let r = 65 * this.polarFunction(theta)
    //   this.context.lineTo(
    //     window.innerWidth / 2 + r * Math.cos(theta) * 1.2,
    //     window.innerHeight / 2 + r * Math.sin(theta) * 1.2
    //   )
    // }
    // this.context.fill()

    this.context.shadowColor = this.localOptions.shadowColor
    this.context.shadowBlur = 10 * this.radius
    this.context.fillStyle = this.localOptions.fillColor
    this.context.beginPath()
    for (let theta = 0; theta < 2 * Math.PI; theta += THETA_RESOLUTION) {
      let r = 65 * this.polarFunction(theta)
      this.context.lineTo(
        window.innerWidth / 2 + r * Math.cos(theta),
        window.innerHeight / 2 + r * Math.sin(theta)
      )
    }
    this.context.fill()
  }

  integrate (dt) {
    for (let i = 0; i < NUM_WAVES; ++i) {
      let wave = this.waves[i]
      wave.phi += dt * wave.deltaPhi
      wave.alpha = wave.maxAlpha * Math.sin(Math.PI * wave.life / wave.lifeTime)

      wave.life += dt
      if (wave.life > wave.lifeTime) {
        this.waves[i] = new Wave()
      }
    }
  }

  render () {
    this.integrate((new Date() | 0) - this.time)
    this.time = new Date() | 0
    this.drawFrame()
  }
}

class Wave {
  constructor () {
    this.maxAlpha = Math.random() / 20
    this.alpha = 0
    this.omega = Math.floor(Math.random() * 10)
    this.phi = Math.random() * 2 * Math.PI
    this.deltaPhi = (0.5 - Math.random()) / 50
    this.life = 0
    this.lifeTime = 1000 + Math.random() * 1000
  }
}
