import axios from 'axios'

axios.defaults.baseURL = 'https://zpevnik.skauting.cz/api/v1/'
axios.defaults.withCredentials = true

const api = axios.create({
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
})

const exportApi = axios.create({
	headers: {
		'Content-Type': 'application/pdf',
		'Accept': 'application/pdf',
	},
})

export default class Api {

	public async getAuthors () {
		return api.get('authors')
	}

	public async getInterpreters () {
		return api.get('interpreters')
	}

	public async getUser () {
		return api.get('user')
	}

	public async getSongs ({ query = '', page = 1, perPage = 50 }: { query?: string, page?: number, perPage?: number }) {
		return api.get(`songs`, {
			params: {
				query,
				page,
				per_page: perPage,
			},
		})
	}

	public async getSongbooks ({ query = '', page = 1, perPage = 50 }: { query?: string, page?: number, perPage?: number }) {
		return api.get(`songbooks`, {
			params: {
				query,
				page,
				per_page: perPage,
			},
		})
	}

	public async getSong (id: string) {
		return api.get(`songs/${id}`)
	}

	public async getUsersName (id: string) {
		return api.get(`users/${id}`)
	}

	public async getSongbook (id: string) {
		return api.get(`songbooks/${id}`)
	}

	public async exportSongbook (id: string) {
		return exportApi(`songbooks/${id}`)
	}

	public async createAuthor (name: string) {
		return api.post('authors', { name })
	}

	public async createInterpreter (name: string) {
		return api.post('interpreters', { name })
	}

	public async deleteAuthor (id: string) {
		return api.delete(`authors/${id}`)
	}

	public async createSong (song: ICreateSong) {
		return api.post('songs', song)
	}

	public async createSongbook (title: string) {
		return api.post('songbooks', { title })
	}

	public async updateSong (id: string, song: ISong) {
		return api.put(`songs/${id}`, song)
	}

	public async createVariant (songId: string, variant: IVariant) {
		return api.post(`songs/${songId}/variants`, variant)
	}

	public async updateVariant (songId: string, variantId: string, variant: IVariant) {
		return api.put(`songs/${songId}/variants/${variantId}`, variant)
	}

	public async updateSongbook (id: string, songBook: ISongbook) {
		return api.put(`songbooks/${id}`, songBook)
	}

	public async deleteSongbook (id: string) {
		return api.delete(`songbooks/${id}`)
	}
}
