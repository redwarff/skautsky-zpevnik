import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const interpreterModule = {
	namespaced: true,
	state: {
		state: EStateTypes.loading,
		items: [],
		error: undefined,
	} as IInterpreterStoreState,
	getters: {
		itemById: (state: IInterpreterStoreState) => (id: string) => {
			return state.items.find((item) => item.id === id)
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
	},
}

export default interpreterModule
