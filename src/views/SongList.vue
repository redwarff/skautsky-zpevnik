<template>
	<page-layout :title="songbookEditMode ? 'Přidávání písní do zpěvníku' : 'Písničky'">
		<template slot="header-button">
			<router-link v-if="!songbookEditMode" class="btn btn-primary" :to="{ name: 'variantCreate' }">Přidat novou píseň</router-link>
			<button v-else class="btn btn-primary" @click="save()">Uložit</button>
		</template>
		<div class="col-sm-12">
			<search-bar :onSearch="search" placeholder="Hledej píseň"></search-bar>
			<table class="table table-striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Píseň</th>
						<th>Interpret</th>
						<th>Akce</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="isLoading">
						<td colSpan={5}>
							<icon name="spinner" pulse></icon>
						</td>
					</tr>
					<router-link tag="tr" v-if="isReady && !songbookEditMode" v-for="(song, i) in items" :key="song.id"
						:to="{ name: 'variantView', params: { songId: song.id, variantId: song.variants[0].id } }" class="list-item clickable">
						<td>{{ i + 1 + page * perPage }}</td>
						<td>{{ song.title }}</td>
						<td>{{ mapInterpretersNames(song.interpreters) }}</td>
						<td><router-link :to="{ name: 'variantEdit', params: { songId: song.id, variantId: song.variants[0].id } }" >Upravit</router-link></td>
					</router-link>
					<tr v-if="isReady && songbookEditMode" v-for="(song, i) in items" :key="song.id" @click="toggleAddSongToSongbook(song.id)"
						class="list-item clickable" :class="isSongSelected(song.id) ? 'selected' : ''">
						<td>{{ i + 1 + page * perPage }}</td>
						<td>{{ song.title }}</td>
						<td>{{ mapInterpretersNames(song.interpreters) }}</td>
						<td><router-link :to="{ name: 'variantEdit', params: { songId: song.id, variantId: song.variants[0].id } }" >Upravit</router-link></td>
					</tr>
				</tbody>
			</table>
			<pagination v-if="lastPage > 0" :activePage="page" :lastPage="lastPage" :goToPage="goToPage" ></pagination>
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import SelectVariantModal from '@/components/SelectVariantModal.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'
import { create } from 'vue-modal-dialogs'

const songListModule = namespace('songList')
const songbookModule = namespace('songbook')
const interpreterModule = namespace('interpreter')

const variantModal = create(SelectVariantModal, 'variants')

@Component({
	components: {
		PageLayout,
		SearchBar,
		Pagination,
	},
})
export default class SongList extends Vue {
	@songListModule.Action private search!: (value: string) => void
	@songListModule.Action private fetch!: () => void
	@songListModule.Action private goToPage!: (page: number) => void
	@songListModule.State private state!: EStateTypes
	@songListModule.State private items!: ISong[]
	@songListModule.State private page!: number
	@songListModule.Getter private lastPage!: number
	@songListModule.Getter private songById!: (id: string) => ISong
	@songListModule.State private perPage!: number
	@songListModule.Mutation private reset!: () => void

	@interpreterModule.State('items') private interpreters!: IInterpreter[]
	@interpreterModule.State('state') private interpretersState!: EStateTypes
	@interpreterModule.Action('fetch') private fetchInterpreters!: () => void;
	@interpreterModule.Getter('itemById') private interpreterById!: (id: string) => IInterpreter;

	@songbookModule.Action('fetch') private fetchSongbook!: (songbookId: string) => void
	@songbookModule.Action private update!: (songbook: ISongbook) => void
	@songbookModule.State private songbookState!: EStateTypes
	@songbookModule.State private songbook!: ISongbook

	private songbookEditMode = false
	private songbookSongs = [] as ISongbookSong[]

	private get isReady () {
		return this.state === EStateTypes.ready && this.interpretersState === EStateTypes.ready
	}

	private get isLoading () {
		return this.state === EStateTypes.loading || this.interpretersState === EStateTypes.loading
	}

	private mapInterpretersNames (ids: string[]) {
		if (!ids) {
			return
		}
		return ids.map((id) => this.interpreterById(id).name)
			.filter((int) => int)
			.join(', ')
	}

	private async created () {
		this.reset()
		this.fetchInterpreters()
		this.fetch()
		if (this.$route.params.songbookId) {
			this.songbookEditMode = true
			await this.fetchSongbook(this.$route.params.songbookId)
			this.songbookSongs = this.songbook.songs
		}
	}

	private async toggleAddSongToSongbook (songId: string) {
		if (this.songbookSongs.find((songbookSong) => songbookSong.song.song_id === songId)) {
			this.songbookSongs = this.songbookSongs.filter((songbookSong) => songbookSong.song.song_id !== songId)
		} else {
			const song = this.songById(songId)
			let variantId = song.variants[0].id
			if (song.variants.length > 1) {
				variantId = await variantModal(song.variants)
				if (!variantId) {
					return
				}
			}
			this.songbookSongs.push({ order: this.songbookSongs.length, variant_id: variantId, song: { song_id: song.id } } as any)
		}
	}

	private isSongSelected (songId: string) {
		return Boolean(this.songbookSongs.find((songbookSong) => songbookSong.song.song_id === songId))
	}

	private async save () {
		await this.update({ ...this.songbook, songs: this.songbookSongs.map((ss) => ({ variant_id: ss.variant_id, order: ss.order } as any)) })
		this.$router.push({ name: 'songbookEdit', params: { songbookId: this.songbook.id } })
	}
}
</script>

<style scoped>
	.clickable {
		cursor: pointer;
	}
	.selected {
		background-color: rgba(0,255,0,0.2);
	}
	.selected:nth-of-type(odd) {
		background-color: rgba(50,205,50,0.2) !important;
	}
</style>