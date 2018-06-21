import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const userModule = {
	namespaced: true,
	state: {
		currentUser: undefined,
		state: EStateTypes.loading,
		items: [],
		error: undefined,
	} as IUserStoreState,
	mutations: {
		setCurrentUser (state: IUserStoreState, user: IUser) {
			state.currentUser = user
		},
		addUserName (state: IUserStoreState, user: IUserSimple) {
			state.items.push(user)
		},
		setState (state: IUserStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: IUserStoreState, error: any) {
			state.error = error
		},
	},
	getters: {
		userNameById: (state: IUserStoreState) => (id: string) => {
			const userName = state.items.find((item) => item.id === id)
			return userName ? userName.name : ''
		},
	},
	actions: {
		async getCurrentUser ({ commit }: { commit: any }) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getUser()
				commit('setCurrentUser', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async getUserName ({ commit }: { commit: any }, id: string) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getUsersName(id)
				commit('addUserName', { ...response, id })
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
	},
}

export default userModule
