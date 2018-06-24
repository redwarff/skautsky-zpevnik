import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const authorModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
		items: [],
		error: undefined,
	} as IAuthorStoreState,
	getters: {
		itemById: (state: IAuthorStoreState) => (id: string) => {
			return state.items.find((item) => item.id === id)
		},
		itemByName: (state: IInterpreterStoreState) => (name: string) => {
			return state.items.find((item) => item.name === name)
		},
	},
	mutations: {
		setItems (state: IAuthorStoreState, items: IAuthor[]) {
			state.items = items
		},
		setState (state: IAuthorStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: IAuthorStoreState, error: any) {
			state.error = error
		},
		addItem (state: IAuthorStoreState, item: IAuthor) {
			state.items.push(item)
		},
	},
	actions: {
		async fetch({ commit }: { commit: any }) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getAuthors()
				commit('setItems', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async create({ commit }: { commit: any }, name: string) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.createAuthor(name)
				commit('addItem', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
	},
}

export default authorModule
