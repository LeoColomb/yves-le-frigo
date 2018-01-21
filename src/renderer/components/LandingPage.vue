<template>
  <div id="wrapper">
    <header>
      <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
      <p id="ver" class="tag is-danger" style="display: none;"></p>
    </header>
    <main>
      <feature-button feature="visu" modifier="" color="info" full-name="Voix normale"/>
      <feature-button feature="visu" modifier="peur" color="danger" full-name="Voix peur"/>
      <feature-button feature="visu" modifier="douce" color="primary" full-name="Voix douce"/>
      <feature-button feature="visu" modifier="perso" color="warning" full-name="Voix Julien Lepers"/>
      <feature-button feature="visu" modifier="emotion" color="success" full-name="Voix émotion"/>
      <feature-button feature="visu" modifier="chant" color="link" full-name="Voix chantée"/>

      <feature-button feature="video" modifier="veille" color="dark" full-name="Veille"/>
      <feature-button feature="video" modifier="sortie" color="dark" full-name="Sortie de veille"/>
      <feature-button feature="video" modifier="agitee" color="dark" full-name="Veille agitée"/>
      <feature-button feature="veille" modifier="degivre" color="dark" full-name="Veille dégivrante" disabled/>

      <feature-button feature="visu" modifier="file" color="black" full-name="Lecture"/>
      <feature-button feature="visu" modifier="crea" color="black" full-name="Création" disabled/>

      <feature-button feature="video" modifier="portraits" color="black" full-name="Choix de voix"/>
      <feature-button feature="video" modifier="birthday" color="black" full-name="Gâteau"/>
      <feature-button feature="fullscreen" modifier="nu" color="black" full-name="Femme en 3D"/>
      <feature-button feature="video" modifier="cravate" color="black" full-name="Cravate"/>
      <feature-button feature="video" modifier="produits" color="black" full-name="Produits"/>
      <feature-button feature="video" modifier="camera" color="black" full-name="Caméra"/>
      <feature-button feature="video" modifier="echecs" color="black" full-name="Jeu d'échecs"/>
      <feature-button feature="video" modifier="battery" color="dark" full-name="Batterie faible"/>
      <feature-button feature="video" modifier="loader" color="dark" full-name="Chargement"/>

      <feature-button feature="init" modifier="black" color="black" full-name="Eteint"/>
    </main>
  </div>
</template>

<script>
  import FeatureButton from './LandingPage/FeatureButton'

  export default {
    name: 'landing-page',

    components: { FeatureButton },

    mounted: function () {
      const version = this.$electron.remote.app.getVersion()
      const el = document.getElementById('ver')
      el.innerText = version
      if (Number(version.split('.')[2]) > 0 || Number(version.split('.')[0]) === 0) {
        el.style.display = 'inherit'
      }
    }
  }
</script>

<style scoped>
  #wrapper {
    height: 100vh;
    padding: 3em 3em;
    width: 100vw;
    background: white;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-right: 1em;
  }

  header > img {
    height: 3em;
  }

  main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-height: 100%;
    overflow: auto;
  }

  main > button {
    flex-grow: 1;
    min-width: 8em;
    margin-bottom: 1em;
    margin-right: 1em;
  }
</style>
