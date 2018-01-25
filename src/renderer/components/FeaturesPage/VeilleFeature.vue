<template>
  <div :class="`halo ${this.modifier}`"></div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'veille-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      })
    }
  }
</script>

<style scoped>
  .halo {
    --color-r: 40;
    --color-g: 180;
    --color-b: 215;

    background-image: radial-gradient(circle, transparent 2%, black 35%);
    animation: 4s ease-in-out alternate infinite breath;
    transition: transform 2s ease-in-out, opacity 2s ease-in-out;
    border: none;
    width: 100%;
    height: 100vh;
  }

  .halo.sortie {
    opacity: 0;
    transform: scale(5);
  }

  .halo.agitee {
    animation-duration: 1s;
    background-image: radial-gradient(circle, transparent 2%, rgba(250, 0, 0, 0.4) 20%, black 35%);
  }

  .halo.degivre {
    transition-duration: 10s;
    transform: scaleY(3) translateY(20vh);
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
