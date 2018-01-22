const state = {
  current: 'init',
  modifier: 'white',
  action: 'play'
}

const mutations = {
  FEATURE_CHANGE (state, feature) {
    state.current = feature.feature
    state.modifier = feature.modifier
    state.action = state.modifier === 'crea' ? (isNaN(parseFloat(state.action)) ? 1 : ++state.action) : feature.action
  },
  ACTION_CHANGE (state, action) {
    state.action = action
  }
}

const actions = {}

const getters = {
  getModifierState: state => state.modifier,
  getActionState: state => state.action
}

export default {
  state,
  mutations,
  actions,
  getters
}
