import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'
import songListModule from '@/store/songList';

const api = new Api()

const songModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
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
		// setExportLink (state: ISongStoreState, link: string) {
		// 	state.exportLink = link
		// },
		setState (state: ISongStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		// setExportState (state: ISongStoreState, moduleState: EStateTypes) {
		// 	state.exportState = moduleState
		// },
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
		// async exportVariant({ commit, state }: { commit: any, state: ISongStoreState }, variantId: string) {
		// 	commit('setExportState', EStateTypes.loading)
		// 	try {
		// 		const response = await api.exportVariant(state.song!.id, variantId)
		// 		commit('setExportLink', 'https://zpevnik.skauting.cz/' + response.data.link)
		// 		commit('setExportState', EStateTypes.ready)
		// 	} catch (error) {
		// 		commit('setExportState', EStateTypes.failed)
		// 		commit('setError', error)
		// 		console.error(error)
		// 	}
		// },
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
		async updateVariant({ commit, state }: { commit: any, state: ISongStoreState }, variant: IVariant ) {
			commit('setState', EStateTypes.loading)
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
