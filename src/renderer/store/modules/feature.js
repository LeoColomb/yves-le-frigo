const state = {
  current: 'init',
  modifier: 'white'
}

const mutations = {
  FEATURE_CHANGE (state, feature) {
    state.current = feature.feature
    state.modifier = feature.modifier
  }
}

const actions = {}

const getters = {
  getModifierState: state => state.modifier
}

export default {
  state,
  mutations,
  actions,
  getters
}
