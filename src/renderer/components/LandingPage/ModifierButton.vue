<template>
  <button
    :class="`button is-medium is-${color}`"
    @click="open">
    <p>{{ fullName }} <small class="is-size-7">({{ shortkey }})</small></p>
  </button>
</template>

<script>
  export default {
    name: 'modifier-button',

    data () {
      return {
        imageUrl: `static/action/${this.action}.png`
      }
    },

    props: {
      action: {
        type: Number,
        required: true
      },
      shortkey: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      fullName: {
        type: String,
        required: true
      }
    },

    methods: {
      open () {
        this.$electron.remote.getCurrentWindow().getParentWindow().webContents.send('send-action', this.action)
      }
    }
  }
</script>

<style scoped>
  button {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    height: auto;
    text-align: center;
    text-wrap: normal;
  }

  button span {
    cursor: pointer;
  }

  button img {
    max-width: 60%;
    max-height: 4em;
    margin-top: 0.5em;
    margin-bottom: 0.2em;
    cursor: pointer;
  }

  button:disabled span,
  button:disabled img {
    cursor: not-allowed;
  }
</style>
