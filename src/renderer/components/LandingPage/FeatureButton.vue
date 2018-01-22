<template>
  <button
    :class="`button is-medium is-${color}`"
    @click="open">
    <span>
      <img :src="imageUrl">
    </span>
    <span class="number"></span>
    {{ fullName }}
  </button>
</template>

<script>
  export default {
    name: 'feature-button',

    data () {
      return {
        imageUrl: `static/home/${this.modifier ? this.modifier : this.feature}.png`
      }
    },

    props: {
      feature: {
        type: String,
        required: true
      },
      modifier: {
        type: String,
        required: false,
        default: null
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
        this.$electron.remote.getCurrentWindow().getParentWindow().webContents.send('send-feature', {
          feature: this.feature,
          modifier: this.modifier
        })
        if (this.modifier === 'crea') {
          const el = this.$el.querySelector('.number')
          el.innerText = el.innerText + '*'
          if (!this.$el.classList.contains('crea-upped')) {
            this.$el.classList.add('crea-upped')
          }
        } else {
          const el = document.getElementsByClassName('crea-upped')[0]
          el.querySelector('.number').innerText = ''
          el.classList.remove('crea-upped')
        }
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

  .number {
    display: none;
    background: #000;
    margin: auto;
  }

  .crea-upped .number {
    display: inline-flex;
  }
</style>
