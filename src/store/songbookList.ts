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
	} as ISongbookListStoreState,
	getters: {
		lastPage: (state: ISongbookListStoreState) => {
			return Math.ceil(state.total / state.perPage) - 1
		},
	},
	mutations: {
		setPage (state: ISongbookListStoreState, page: number) {
			state.page = page
		},
		setTotal (state: ISongbookListStoreState, total: number) {
			state.total = total
		},
		setSearchQuery (state: ISongbookListStoreState, query: string) {
			state.searchQuery = query
		},
		setItems (state: ISongbookListStoreState, items: ISongbook[]) {
			state.items = items
		},
		setState (state: ISongbookListStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: ISongbookListStoreState, error: any) {
			state.error = error
		},
	},
	actions: {
		async fetch({ commit, state }: { commit: any, state: ISongbookListStoreState }) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getSongbooks({ query: state.searchQuery, page: state.page, perPage: state.perPage }) as any
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
