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
        modifier: state => state.feature.modifier
      }),
      ...mapGetters([
        'getModifierState'
      ])
    },

    mounted: async function () {
      this.canvas = document.getElementById('visualizer_render')
      this.ctx = this.canvas.getContext('2d')
      this.context = new AudioContext()
      this.analyser = this.context.createAnalyser()

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

        if (this.modifier) {
          this.audio = new Audio()
          this.audio.loop = false
          this.audio.autoplay = true
          // this.audio.src = `static/features/visu/${this.modifier}.mp3`
          this.audio.src = `static/features/visu/2.mp3`
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

        const grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
        grd.addColorStop(0, 'rgba(180, 140, 230, 1)')
        grd.addColorStop(1, 'rgba(102, 102, 255, 1)')

        this.ctx.fillStyle = grd
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.intensity * 0.0000125 - 0.4})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.rot = this.rot + this.intensity * 0.0000001
        this.reactX = 0
        this.reactY = 0
        this.intensity = 0

        this.analyser.getByteFrequencyData(this.fbcArray)

        for (let i = 0; i < this.bars; i++) {
          this.rads = Math.PI * 2 / this.bars

          this.barX = this.centerX
          this.barY = this.centerY

          this.barH = Math.min(99999, Math.max((this.fbcArray[i] * 2.5 - 200), 0))
          this.barW = this.barH * 0.02

          this.barXTerm = this.centerX + Math.cos(this.rads * i + this.rot) * (this.radius + this.barH)
          this.barYTerm = this.centerY + Math.sin(this.rads * i + this.rot) * (this.radius + this.barH)

          // this.ctx.save()

          this.ctx.strokeStyle = `rgb(${(this.fbcArray[i]).toString()}, 255, 255)`
          this.ctx.lineWidth = this.barW
          this.ctx.beginPath()
          this.ctx.moveTo(this.barX, this.barY)
          this.ctx.lineTo(this.barXTerm, this.barYTerm)
          this.ctx.stroke()

          this.reactX += Math.cos(this.rads * i + this.rot) * (this.radius + this.barH)
          this.reactY += Math.sin(this.rads * i + this.rot) * (this.radius + this.barH)

          this.intensity += this.barH
        }

        this.centerX = this.canvas.width / 2 - (this.reactX * 0.007)
        this.centerY = this.canvas.height / 2 - (this.reactY * 0.007)

        this.radiusOld = this.radius
        this.radius = 25 + (this.intensity * 0.002)
        this.deltarad = this.radius - this.radiusOld

        this.ctx.fillStyle = 'rgb(255, 255, 255)'
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, this.radius + 2, 0, Math.PI * 2, false)
        this.ctx.fill()

        // shockwave effect
        this.shockwave += 60

        this.ctx.lineWidth = 15
        this.ctx.strokeStyle = 'rgb(255, 255, 255)'
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.centerY, this.shockwave + this.radius, 0, Math.PI * 2, false)
        this.ctx.stroke()

        if (this.deltarad > 15) {
          this.shockwave = 0
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
          this.rot = this.rot + 0.4
        }

        return window.requestAnimationFrame(this.frameLooper)
      }
    }
  }
</script>

<style scoped>

</style>
