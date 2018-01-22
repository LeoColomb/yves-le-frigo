<template>
  <canvas id="visualizer_render"></canvas>
</template>

<script>
  import { mapState } from 'vuex'
  import { Blob } from '../../assets/blob'

  export default {
    name: 'veille-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      })
    },

    mounted: async function () {
      this.canvas = document.getElementById('visualizer_render')
      this.ctx = this.canvas.getContext('2d')

      await this.constructer()
    },

    beforeDestroy: function () {
      this.destroyer()
    },

    methods: {
      constructer: async function () {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.blobs = []
        this.blobs.push(new Blob(this.ctx, {
          fillColor: 'red',
          shadowColor: 'red'
        }))
        this.blobs.push(new Blob(this.ctx, {}))

        this.frameRequestId = this.frameLooper()
      },

      destroyer: function () {
        window.cancelAnimationFrame(this.frameRequestId)
      },

      frameLooper: function () {
        this.ctx.clearRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        )

        this.blobs.forEach(blob => blob.render())

        return window.requestAnimationFrame(this.frameLooper)
      }
    }
  }
</script>

<style scoped>
  canvas {
    background: transparent;
    width: 100%;
    height: 100vh;
  }
</style>
