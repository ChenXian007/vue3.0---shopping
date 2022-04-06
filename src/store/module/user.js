export default {
  namespaced: true,
  state () {
    return {
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      redirectUrl: '/'
    }
  },
  mutations: {
    setUser (state, pl) {
      state.profile = pl
    },
    setUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
