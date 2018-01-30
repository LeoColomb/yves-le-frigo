const state = {
  current: 'init',
  modifier: 'white',
  action: 1
}

const mutations = {
  FEATURE_CHANGE (state, feature) {
    state.action = state.modifier === 'crea' ? state.action + 1 : 1
    state.current = feature.feature
    state.modifier = feature.modifier
  },
  ACTION_CHANGE (state, action) {
    switch (action) {
      case 2:
        state.action = (state.action + 1) % 2
        break
      case 3:
        state.current = 'black'
        state.modifier = 'black'
        break
      default:
        state.action = action
        break
    }
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
