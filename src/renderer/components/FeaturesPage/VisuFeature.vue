<template>
  <canvas id="visualizer_render"></canvas>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

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
  export default {
    name: 'visu-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier,
        localOptions: state => {
          const opt = {
            null: {
              color: '40, 180, 215',
              shockwave: false,
              factor: 1.1,
              moving: false,
              file: false
            },
            peur: {
              color: '207, 88, 90',
              shockwave: true,
              factor: 0.8
            },
            douce: {
              factor: 0.8
            },
            perso: {
              color: '249, 163, 0',
              shockwave: true
            },
            file: {
              shockwave: true,
              moving: true,
              file: '2.mp3'
            },
            chant: {
              moving: true
            }
          }
          return Object.assign(opt[null], opt[state.feature.modifier] || {})
        }
      }),
      ...mapGetters([
        'getModifierState'
      ])
    },

    mounted: async function () {
      this.canvas = document.getElementById('visualizer_render')
      this.ctx = this.canvas.getContext('2d')

      await this.constructer()

      this.watcher = this.$store.watch(
        () => this.getModifierState,
        () => {
          this.destroyer()
          this.constructer()
        }
      )
    },

    beforeDestroy: function () {
      this.watcher()
      this.destroyer()
    },

    methods: {
      constructer: async function () {
        this.bars = 200
        this.reactX = 0
        this.reactY = 0
        this.radius = 0
        this.radiusOld = 0
        this.deltarad = 0
        this.shockwave = 0
        this.rot = 0
        this.intensity = 0

        this.context = new AudioContext()
        this.analyser = this.context.createAnalyser()

        if (this.localOptions.file) {
          this.audio = new Audio()
          this.audio.loop = false
          this.audio.autoplay = true
          this.audio.src = `static/features/visu/${this.localOptions.file}`
          this.source = this.context.createMediaElementSource(this.audio)
        } else {
          try {
            this.audio = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
          } catch (e) {
            this.resizeCanvas()
            this.ctx.font = '35px sans-serif'
            this.ctx.fillStyle = 'white'
            this.ctx.fillText('Aucune entrée son détectée...', this.canvas.width / 3, this.canvas.height / 2)
            return
          }
          this.source = this.context.createMediaStreamSource(this.audio)
        }

        // route audio playback
        this.source.connect(this.analyser)
        this.analyser.connect(this.context.destination)

        this.fbcArray = new Uint8Array(this.analyser.frequencyBinCount)

        this.frameRequestId = this.frameLooper()
      },

      destroyer: function () {
        window.cancelAnimationFrame(this.frameRequestId)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.close()
        if (this.audio.src) {
          this.audio.pause()
          this.audio.src = null
        } else {
          this.audio.getTracks().forEach(stream => stream.stop())
        }
      },

      resizeCanvas: function () {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
      },

      frameLooper: function () {
        this.resizeCanvas()

        this.ctx.fillStyle = `rgba(${this.localOptions.color}, ${this.intensity * 0.0000125 - 0.4})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.rot = this.rot + this.intensity * 0.0000001
        this.reactX = 0
        this.reactY = 0
        this.intensity = 0

        this.analyser.getByteFrequencyData(this.fbcArray)

        for (let i = 0; i < this.bars; i++) {
          if (this.modifier === 'emotion' && i % 2 === 0) {
            continue
          }
          this.rads = Math.PI * 2 / this.bars

          this.barX = this.centerX
          this.barY = this.centerY

          let imp = this.modifier === 'peur' ? 4 : 3
          this.barH = Math.min(99999, Math.max((this.fbcArray[i] * imp - 200), 0))
          this.barW = this.barH * 0.02

          this.barXTerm = (this.centerX + Math.cos(this.rads * i + this.rot) * (this.radius + this.barH))
          this.barYTerm = (this.centerY + Math.sin(this.rads * i + this.rot) * (this.radius + this.barH))

          // this.ctx.save()

          this.ctx.strokeStyle = `rgb(${(this.fbcArray[i]).toString()}, ${(this.fbcArray[i]).toString()}, ${(this.fbcArray[i]).toString()})`
          this.ctx.lineWidth = this.barW
          this.ctx.beginPath()
          this.ctx.moveTo(this.barX, this.barY)
          this.ctx.lineTo(this.barXTerm, this.barYTerm)
          this.ctx.stroke()

          this.reactX += Math.cos(this.rads * i + this.rot) * (this.radius + this.barH)
          this.reactY += Math.sin(this.rads * i + this.rot) * (this.radius + this.barH)

          this.intensity += this.barH
        }

        this.centerX = this.canvas.width / 2
        this.centerY = this.canvas.height / 2
        if (this.localOptions.moving) {
          this.centerX -= this.reactX * 0.007
          this.centerY -= this.reactY * 0.007
        }

        this.radiusOld = this.radius
        this.radius = (25 + (this.intensity * 0.002)) * this.localOptions.factor
        this.deltarad = this.radius - this.radiusOld

        this.ctx.fillStyle = 'rgb(255, 255, 255)'
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, this.radius + 2, 0, Math.PI * 2, false)
        this.ctx.fill()

        if (this.localOptions.shockwave) {
          // shockwave effect
          this.shockwave += 60

          this.ctx.lineWidth = 10
          this.ctx.strokeStyle = `rgb(${this.localOptions.color})`
          this.ctx.beginPath()
          this.ctx.arc(this.centerX, this.centerY, this.shockwave + this.radius, 0, Math.PI * 2, false)
          this.ctx.stroke()

          if (this.deltarad > 15) {
            this.shockwave = 0
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.rot = this.rot + 0.4
          }
        }

        return window.requestAnimationFrame(this.frameLooper)
      }
    }
  }
</script>

<style scoped>
  canvas {
    background: transparent;
  }
</style>
