<template>
<div class="cont">
    <video id="video-element" autoplay="autoplay" loop="loop">
      <source :src="`static/features/video/${this.modifier}.webm`"/>
    </video>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'video-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      }),
      ...mapGetters([
        'getModifierState'
      ])
    },

    mounted: function () {
      this.watcher = this.$store.watch(
        () => this.getModifierState,
        () => { document.getElementById('video-element').load() }
      )
    },

    beforeDestroy: function () {
      this.watcher()
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
    height: 100vh;
    width: 100%;
  }
</style>
