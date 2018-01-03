<template>
  <canvas id="visualizer_render"></canvas>
</template>

<script>
  /**
   * Canvas audio animation
   *
   * Adapted from original web version
   * @author plore-0
   * @link https://plore-0.github.io/audiovisualizer/
   *
   * To vue-electron version
   * @author Léo Colombaro
   * @licence ISC
   */
  let rads, centerX, centerY, radius, radiusOld, deltarad, shockwave,
    bars, barX, barY, barXTerm, barYTerm, barW, barH, reactX, reactY,
    intensity, rot

  export default {
    name: 'visu-feature',

    mounted: async function () {
      bars = 200
      reactX = 0
      reactY = 0
      radius = 0
      deltarad = 0
      shockwave = 0
      rot = 0
      intensity = 0

      this.canvas = document.getElementById('visualizer_render')
      this.ctx = this.canvas.getContext('2d')

      // resizeCanvas();

      this.context = new AudioContext()
      this.analyser = this.context.createAnalyser()
      let source

      if (this.modifier) {
        this.audio = new Audio()
        this.audio.loop = false
        this.audio.autoplay = true
        this.audio.src = `static/features/visu/${this.modifier}.mp3`
        source = this.context.createMediaElementSource(this.audio)
      } else {
        this.audio = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
        source = this.context.createMediaStreamSource(this.audio)
      }

      // route audio playback
      source.connect(this.analyser)
      this.analyser.connect(this.context.destination)

      this.fbcArray = new Uint8Array(this.analyser.frequencyBinCount)

      this.frameRequestId = this.frameLooper()
    },

    beforeDestroy: function () {
      window.cancelAnimationFrame(this.frameRequestId)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.close()
      if (this.modifier) {
        this.audio.pause()
        this.audio.src = null
      } else {
        this.audio.getTracks().forEach(stream => stream.stop())
      }
    },

    methods: {
      resizeCanvas: function () {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
      },

      frameLooper: function () {
        this.resizeCanvas() // for some reason i have to resize the canvas every update or else the framerate decreases over time

        const grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
        grd.addColorStop(0, 'rgba(180, 140, 230, 1)')
        grd.addColorStop(1, 'rgba(102, 102, 255, 1)')

        this.ctx.fillStyle = grd
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.0000125 - 0.4})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        rot = rot + intensity * 0.0000001
        reactX = 0
        reactY = 0
        intensity = 0

        this.analyser.getByteFrequencyData(this.fbcArray)

        for (let i = 0; i < bars; i++) {
          rads = Math.PI * 2 / bars

          barX = centerX
          barY = centerY

          barH = Math.min(99999, Math.max((this.fbcArray[i] * 2.5 - 200), 0))
          barW = barH * 0.02

          barXTerm = centerX + Math.cos(rads * i + rot) * (radius + barH)
          barYTerm = centerY + Math.sin(rads * i + rot) * (radius + barH)

          this.ctx.save()

          this.ctx.strokeStyle = `rgb(${(this.fbcArray[i]).toString()}, 255, 255)`
          this.ctx.lineWidth = barW
          this.ctx.beginPath()
          this.ctx.moveTo(barX, barY)
          this.ctx.lineTo(barXTerm, barYTerm)
          this.ctx.stroke()

          reactX += Math.cos(rads * i + rot) * (radius + barH)
          reactY += Math.sin(rads * i + rot) * (radius + barH)

          intensity += barH
        }

        centerX = this.canvas.width / 2 - (reactX * 0.007)
        centerY = this.canvas.height / 2 - (reactY * 0.007)

        radiusOld = radius
        radius = 25 + (intensity * 0.002)
        deltarad = radius - radiusOld

        this.ctx.fillStyle = 'rgb(255, 255, 255)'
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2, false)
        this.ctx.fill()

        // shockwave effect
        shockwave += 60

        this.ctx.lineWidth = 15
        this.ctx.strokeStyle = 'rgb(255, 255, 255)'
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, shockwave + radius, 0, Math.PI * 2, false)
        this.ctx.stroke()

        if (deltarad > 15) {
          shockwave = 0
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
          rot = rot + 0.4
        }

        return window.requestAnimationFrame(this.frameLooper)
      }
    }
  }
</script>

<style scoped>

</style>
