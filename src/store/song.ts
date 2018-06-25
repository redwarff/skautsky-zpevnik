import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'
import songListModule from '@/store/songList';

const api = new Api()

const songModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
		error: undefined,
	} as ISongStoreState,
	getters: {
		variantById: (state: ISongStoreState) => (id: string) => {
			return state.song!.variants.find((item) => item.id === id)
		},
	},
	mutations: {
		setSong (state: ISongStoreState, song: ISong) {
			state.song = song
		},
		setVariant (state: ISongStoreState, variant: IVariant) {
			state.song = { ...state.song, variants: state.song!.variants.map((_variant) => variant.id === _variant.id ? variant : _variant) } as ISong
		},
		addVariant (state: ISongStoreState, variant: IVariant) {
			state.song!.variants.push(variant)
		},
		setState (state: ISongStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setError (state: ISongStoreState, error: any) {
			state.error = error
		},
	},
	actions: {
		async fetch({ commit }: { commit: any }, songId: string) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getSong(songId)
				commit('setSong', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async updateSong({ commit }: { commit: any }, song: ISong) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.updateSong(song.id, song)
				commit('setSong', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async createSong({ commit }: { commit: any }, song: ICreateSong) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.createSong(song)
				commit('setSong', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async createVariant({ commit, state }: { commit: any, state: ISongStoreState }, variant: IVariant) {
			commit('setState', EStateTypes.loading)
			commit('setError', undefined)
			try {
				const response = await api.createVariant(state.song!.id, variant)
				commit('addVariant', response.data)
				commit('setState', EStateTypes.ready)
				return response.data
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async updateVariant({ commit, state }: { commit: any, state: ISongStoreState }, variant: IVariant ) {
			commit('setState', EStateTypes.loading)
			commit('setError', undefined)
			try {
				const response = await api.updateVariant(state.song!.id, variant.id, variant)
				commit('setVariant', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
	},
}

export default songModule
