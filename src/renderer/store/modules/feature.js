const state = {
  current: 'init',
  modifier: null
}

const mutations = {
  FEATURE_CHANGE (state, feature) {
    state.current = feature.feature
    state.modifier = feature.modifier
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
