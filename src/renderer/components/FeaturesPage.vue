<template>
  <component :is="feature" :class="`hallo ${modifier}`"/>
</template>

<script>
  import { mapState } from 'vuex'

  import InitFeature from './FeaturesPage/InitFeature'
  import VisuFeature from './FeaturesPage/VisuFeature'
  import VideoFeature from './FeaturesPage/VideoFeature'
  import FullscreenFeature from './FeaturesPage/FullscreenFeature'

  export default {
    name: 'features-page',
    components: {
      InitFeature,
      VisuFeature,
      VideoFeature,
      FullscreenFeature
    },

    computed: mapState({
      feature: state => `${state.feature.current}-feature`,
      modifier: state => state.feature.modifier
    }),

    mounted: function () {
      this.$electron.ipcRenderer.on('send-feature', (event, feature) => {
        this.$store.commit('FEATURE_CHANGE', feature)
      })
    }
  }
</script>

<style scoped>
  .hallo {
    --color-r: 100;
    --color-g: 0;
    --color-b: 255;

    background-color: rgba(var(--color-r), var(--color-g), var(--color-b), 0);
    background-image: radial-gradient(circle, transparent 2%, black 35%);
    animation: 4s ease-in-out alternate infinite breath;
    transition: background-color 2s ease-in-out;
  }

  .hallo.black {
    --color-r: 0;
    --color-g: 0;
    --color-b: 0;
  }

  .hallo.white {
    --color-r: 255;
    --color-g: 255;
    --color-b: 255;

    animation: none;
  }

  .hallo.red {
    --color-r: 255;
    --color-g: 0;
    --color-b: 0;
  }

  .hallo.perso {
    --color-r: 255;
    --color-g: 200;
    --color-b: 0;
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
