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
        action: state => state.feature.action,
        localOptions: state => {
          const opt = {
            null: {
              color: {
                r: 40,
                g: 180,
                b: 215
              },
              shockwave: false,
              factor: 1.1,
              moving: false,
              customLines: false,
              lineFactor: null,
              divider: 1,
              halo: true
            },
            peur: {
              color: {
                r: 207,
                g: 88,
                b: 90
              },
              shockwave: true,
              factor: 0.8,
              customLines: true
            },
            douce: {
              factor: 0.8
            },
            perso: {
              color: {
                r: 249,
                g: 163,
                b: 0
              },
              shockwave: true,
              customLines: true
            },
            file: {
              shockwave: true,
              moving: true
            },
            chant: {
              moving: true
            },
            emotion: {
              factor: 3,
              moving: true,
              lineFactor: 3
            },
            crea: {
              divider: 4
            },
            vince: {
              factor: 3,
              lineFactor: 10
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

      this.halo()
      this.watcher = this.$store.watch(() => this.getModifierState, this.halo)

      await this.constructer()
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
        this.audio.getTracks().forEach(stream => stream.stop())
      },

      halo: function () {
        if (this.localOptions.halo) {
          this.canvas.style.cssText = `--color-r: ${this.localOptions.color.r}; --color-g: ${this.localOptions.color.g}; --color-b: ${this.localOptions.color.b}`
        }
      },

      resizeCanvas: function () {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
      },

      frameLooper: function () {
        this.resizeCanvas()

        this.ctx.fillStyle = `rgba(${this.localOptions.color.r}, ${this.localOptions.color.g}, ${this.localOptions.color.b}, ${this.intensity * 0.0000125 - 0.4})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.rot = this.rot + this.intensity * 0.0000001
        this.reactX = 0
        this.reactY = 0
        this.intensity = 0

        this.analyser.getByteFrequencyData(this.fbcArray)

        for (let i = 0; i < this.bars; i++) {
          if (i > (this.bars / this.localOptions.divider) * this.action) {
            break
          }
          if (this.localOptions.lineFactor && (i % this.localOptions.lineFactor) - this.localOptions.lineFactor < -1) {
            continue
          }
          this.rads = Math.PI * 2 / this.bars

          this.barX = this.centerX
          this.barY = this.centerY

          let imp = this.modifier === 'peur' ? 4 : 3
          this.barH = Math.min(99999, Math.max((this.fbcArray[i] * imp - 200), 0))
          this.barW = this.barH * 0.02 * (this.localOptions.lineFactor ? this.localOptions.lineFactor : 1)

          this.barXTerm = (this.centerX + Math.cos(this.rads * i + this.rot) * (this.radius + this.barH))
          this.barYTerm = (this.centerY + Math.sin(this.rads * i + this.rot) * (this.radius + this.barH))

          // this.ctx.save()

          if (this.localOptions.customLines) {
            this.ctx.strokeStyle = 'rgb(' +
              (Math.round(this.fbcArray[i] + (this.fbcArray[i] * this.localOptions.color.r / 256))).toString() +
              ',' +
              (Math.round(this.fbcArray[i] + (this.fbcArray[i] * this.localOptions.color.g / 256))).toString() +
              ',' +
              (Math.round(this.fbcArray[i] + (this.fbcArray[i] * this.localOptions.color.b / 256))).toString() +
              ')'
          } else {
            this.ctx.strokeStyle = `rgb(${(this.fbcArray[i]).toString()}, ${(this.fbcArray[i]).toString()}, ${(this.fbcArray[i]).toString()})`
          }
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
        if (this.modifier === 'vince') {
          let path = new Path2D('M490.5,297.2c0.4,70.7-49.6,131.7-111.6,160.7c-81,38-180,50-260.8,6.6c-14.6-8.5-28.2-19.3-40.2-32.6\n' +
            ' c-78-86-32-224,25.8-312.5c8.3-11.6,17.5-22.5,27.6-32.6c10.2-10.1,21.4-19.3,33.6-27.5c13.1-8,27.7-14.6,44-19.3\n' +
            ' c13-3.8,26.1-5.3,39-5.1c12.9,0.2,25.7,2.3,38.2,5.7c100.8,32.3,173.8,128.3,202.2,227.6C489.8,277.8,490.5,287.4,490.5,297.2z')
          this.ctx.save()
          this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
          const reductor = 30 / this.radius
          this.ctx.translate(-527 * reductor / 2, -527 * reductor / 2)
          this.ctx.scale(reductor, reductor)
          this.ctx.fill(path)
          this.ctx.restore()
        } else {
          this.ctx.beginPath()
          this.ctx.arc(this.centerX, this.centerY, this.radius + 2, 0, Math.PI * 2, false)
          this.ctx.fill()
        }

        if (this.localOptions.shockwave) {
          // shockwave effect
          this.shockwave += 60

          this.ctx.lineWidth = 10
          this.ctx.strokeStyle = `rgb(${this.localOptions.color.r}, ${this.localOptions.color.g}, ${this.localOptions.color.b})`
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
    --color-r: 0;
    --color-g: 0;
    --color-b: 0;

    background-image: radial-gradient(circle, transparent 2%, black 35%);
    animation: 4s ease-in-out alternate infinite breath;
    border: none;
  }

  @keyframes breath {
    from {
      background-color: rgba(var(--color-r), var(--color-g), var(--color-b), 0.2);
    }

    to {
      background-color: rgba(var(--color-r), var(--color-g), var(--color-b), 0.5);
    }
  }
</style>
