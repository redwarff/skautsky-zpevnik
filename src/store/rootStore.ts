import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import song from './song'
import songbook from './songbook'
import songList from './songList'
import songbookList from './songbookList'
import interpreter from './interpreter'
import author from './author'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		song,
		songbook,
		songList,
		songbookList,
		interpreter,
		author,
	},
} as IRootStore)
