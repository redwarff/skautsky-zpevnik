import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import song from './song'
import songList from './songList'
import interpreter from './interpreter'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		song,
		songList,
		interpreter,
	},
} as IRootStore)
