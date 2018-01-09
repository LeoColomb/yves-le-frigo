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

      <feature-button feature="veille" modifier="" color="dark" full-name="Veille"/>
      <feature-button feature="veille" modifier="sortie" color="dark" full-name="Sortie de veille"/>
      <feature-button feature="veille" modifier="agitee" color="dark" full-name="Veille agitée"/>
      <feature-button feature="veille" modifier="degivre" color="dark" full-name="Veille dégivrante"/>

      <feature-button feature="visu" modifier="file" color="black" full-name="Lecture"/>
      <feature-button feature="visu" modifier="crea" color="black" full-name="Création"/>
      <feature-button feature="voix" modifier="" color="black" full-name="Choix de voix"/>

      <feature-button feature="anim" modifier="gateau" color="black" full-name="Gâteau"/>
      <feature-button feature="anim" modifier="3d" color="black" full-name="Femme en 3D"/>
      <feature-button feature="anim" modifier="cravate" color="black" full-name="Cravate"/>
      <feature-button feature="anim" modifier="produit" color="black" full-name="Produits"/>

      <feature-button feature="video" modifier="camera" color="black" full-name="Caméra"/>
      <feature-button feature="video" modifier="echecs" color="black" full-name="Jeu d'échecs"/>

      <feature-button feature="anim" modifier="battery" color="dark" full-name="Batterie faible"/>
    </main>
  </div>
</template>

<script>
  import FeatureButton from './LandingPage/FeatureButton'
  import { version } from '../../../package'

  export default {
    name: 'landing-page',
    components: { FeatureButton },

    mounted: function () {
      const el = document.getElementById('ver')
      el.innerText = version
      if ((version.split('.')[2]) > 0) {
        el.style.display = 'inherit'
      }
    }
  }
</script>

<style>
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
  }

  main > button {
    flex-grow: 1;
    min-width: 8em;
    margin-bottom: 1em;
    margin-right: 1em;
  }
</style>
