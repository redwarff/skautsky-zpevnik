import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import songList from './songList'
import interpreter from './interpreter'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		songList,
		interpreter,
	},
} as IRootStore)
