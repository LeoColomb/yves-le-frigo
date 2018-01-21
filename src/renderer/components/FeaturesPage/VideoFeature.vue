<template>
  <div class="cont">
    <video id="video-element" autoplay="autoplay" :loop="this.loop">
      <source type="video/mp4" :src="`static/features/video/${this.modifier}.mp4`"/>
    </video>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'video-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier,
        action: state => state.feature.action,
        loop: state => {
          const loop = [
            'battery',
            'cravate',
            'veille',
            'agitee',
            'birthday',
            'loader'
          ].indexOf(state.feature.modifier) >= 0
          return loop ? 'loop' : false
        }
      }),
      ...mapGetters([
        'getModifierState',
        'getActionState'
      ])
    },

    mounted: function () {
      this.watcher = this.$store.watch(
        () => this.getModifierState,
        () => {
          const el = document.getElementById('video-element')
          el.loop = this.loop
          el.load()
        }
      )

      this.actionWatcher = this.$store.watch(
        () => this.getActionState,
        value => {
          const el = document.getElementById('video-element')
          if (value === 'pause') {
            el.pause()
          } else {
            el.play()
          }
        }
      )
    },

    beforeDestroy: function () {
      this.watcher()
      this.actionWatcher()
    }
  }
</script>

<style scoped>
  .cont {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-around;
    height: 100vh;
    width: 100%;
  }

  .cont video {
    max-height: 100vh;
    height: 100vh;
    width: 100%;
  }
</style>
