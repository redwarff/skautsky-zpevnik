import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const songListModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
		items: [],
		searchQuery: '',
		page: 0,
		perPage: 50,
		total: 0,
		error: undefined,
	} as ISongListStoreState,
	getters: {
		lastPage: (state: ISongListStoreState) => {
			return Math.ceil(state.total / state.perPage) - 1
		},
		songById: (state: ISongListStoreState) => (id: string) => {
			return state.items.find((item) => item.id === id)
		},
	},
	mutations: {
		setPage (state: ISongListStoreState, page: number) {
			state.page = page
		},
		setTotal (state: ISongListStoreState, total: number) {
			state.total = total
		},
		setSearchQuery (state: ISongListStoreState, query: string) {
			state.searchQuery = query
		},
		setItems (state: ISongListStoreState, items: ISong[]) {
			state.items = items
		},
		setState (state: ISongListStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: ISongListStoreState, error: any) {
			state.error = error
		},
		reset (state: ISongListStoreState) {
			state.searchQuery = ''
			state.page = 0
		},
	},
	actions: {
		async fetch({ commit, state }: { commit: any, state: ISongListStoreState }) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getSongs({ query: state.searchQuery, page: state.page, perPage: state.perPage }) as any
				const data = response.data
				const total = data.count
				const items = data.data
				commit('setItems', items)
				commit('setTotal', total)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async goToPage ({ commit, dispatch }: { commit: any, dispatch: any }, page: number) {
			commit('setPage', page)
			await dispatch('fetch')
		},
		async search ({ commit, dispatch }: { commit: any, dispatch: any }, query: string) {
			commit('setSearchQuery', query)
			await dispatch('fetch')
		},
	},
}

export default songListModule
