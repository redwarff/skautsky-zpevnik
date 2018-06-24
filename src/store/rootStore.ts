import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import song from './song'
import songList from './songList'
import interpreter from './interpreter'
import author from './author'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		song,
		songList,
		interpreter,
		author,
	},
} as IRootStore)
