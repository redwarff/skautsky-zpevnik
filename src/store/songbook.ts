import Api from '../lib/api'
import { EStateTypes } from '../lib/enums'

const api = new Api()

const songbookModule = {
	namespaced: true,
	state: {
		state: EStateTypes.ready,
		songbook: undefined,
		exportState: undefined,
		exportLink: '',
	} as ISongbookStoreState,
	mutations: {
		setSongbook (state: ISongbookStoreState, songbook: ISongbook) {
			state.songbook = songbook
		},
		setExportLink (state: ISongbookStoreState, link: string) {
			state.exportLink = link
		},
		setState (state: ISongbookStoreState, moduleState: EStateTypes) {
			state.state = moduleState
		},
		setExportState (state: ISongbookStoreState, moduleState: EStateTypes) {
			state.exportState = moduleState
		},
		setError (state: ISongbookStoreState, error: any) {
			state.error = error
		},
	},
	actions: {
		async fetch({ commit }: { commit: any }, songbookId: string) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.getSongbook(songbookId)
				commit('setSongbook', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async exportSongbook({ commit, state }: { commit: any, state: ISongbookStoreState }) {
			commit('setExportState', EStateTypes.loading)
			try {
				const response = await api.exportSongbook(state.songbook!.id)
				commit('setExportLink', 'https://zpevnik.skauting.cz/' + response.data.link)
				commit('setExportState', EStateTypes.ready)
			} catch (error) {
				commit('setExportState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async update({ commit }: { commit: any }, songbook: ISongbook) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.updateSongbook(songbook.id, songbook)
				commit('setSongbook', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
		async create({ commit }: { commit: any }, title: string) {
			commit('setState', EStateTypes.loading)
			try {
				const response = await api.createSongbook(title)
				commit('setSongbook', response.data)
				commit('setState', EStateTypes.ready)
			} catch (error) {
				commit('setState', EStateTypes.failed)
				commit('setError', error)
				console.error(error)
			}
		},
	},
}

export default songbookModule
