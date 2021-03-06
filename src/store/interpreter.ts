import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const interpreterModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
		items: [],
		error: undefined,
	} as IInterpreterStoreState,
	getters: {
		itemById: (state: IInterpreterStoreState) => (id: string) => {
			return state.items.find((item) => item.id === id)
		},
		itemByName: (state: IInterpreterStoreState) => (name: string) => {
			return state.items.find((item) => item.name === name)
		},
	},
	mutations: {
		setItems (state: IInterpreterStoreState, items: IInterpreter[]) {
			state.items = items
		},
		setState (state: IInterpreterStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: IInterpreterStoreState, error: any) {
			state.error = error
		},
		addItem (state: IInterpreterStoreState, item: IInterpreter) {
			state.items.push(item)
		},
	},
	actions: {
		async fetch({ commit }: { commit: any }) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getInterpreters()
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
				const response = await api.createInterpreter(name)
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

export default interpreterModule
