<template>
  <div id="halo"></div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'veille-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      }),
      ...mapGetters([
        'getModifierState'
      ])
    },

    mounted: async function () {
      this.color = {
        r: 40,
        g: 180,
        b: 215
      }
      this.halo()
      this.watcher = this.$store.watch(() => this.getModifierState, this.halo)
    },

    beforeDestroy: function () {
      this.watcher()
    },

    methods: {
      halo () {
        this.$el.style.cssText = `--color-r: ${this.color.r}; --color-g: ${this.color.g}; --color-b: ${this.color.b}`
      }
    }
  }
</script>

<style scoped>
  #halo {
    background-image: radial-gradient(circle, transparent 2%, black 35%);
    animation: 4s ease-in-out alternate infinite breath;
    border: none;
    width: 100%;
    height: 100vh;
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
