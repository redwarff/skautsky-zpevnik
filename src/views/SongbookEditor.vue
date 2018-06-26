<template>
	<page-layout title="Editace zpěvníku">
		<template slot="header-button">
			<router-link v-if="!isNew" class="btn btn-primary" :to="{ name: 'songbookAddSongs', params: { songbookId: songbookId } }">Přidat písně</router-link>
		</template>
		<div class="col-sm-12 col-md-6">
			<form>
				<div class="form-group">
					<label>Jméno zpěvníku:</label>
					<input type="text" class="form-control" v-model="songbookTitle" />
				</div>
			</form>
		</div>
		<div v-if="isReady" class="col-sm-12 col-md-6 save-wrapper">
			<button :class="`btn btn-${isChanged ? 'primary' : 'default'}`" :disabled="!isChanged" @click="save()">Uložit</button>
		</div>
		<div v-if="isReady" class="col-sm-12 export-wrapper">
			<span v-if="exportLoading" class="alert alert-primary">Zpěvník se připravuje...</span>
			<span v-if="exportFailed" class="alert alert-danger">Zpěvník se nepodařilo zkompilovat.</span>
			<span v-if="exportReady" class="alert alert-success">
				Zpěvník je připraven! Stáhnout ho můžeš
				<a target="_blank" rel="noopener noreferrer" :href="exportLink"> zde</a>
			</span>
			<button class="btn btn-primary button-ml" :class="isChanged ? 'disabled' : ''" :disabled="isChanged" @click="exportSongbook()">
				Exportovat do pdf
			</button>
		</div>
		<div class="col-sm-12">
			<table class="table table-striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Píseň</th>
						<th>Interpret</th>
						<th>Akce</th>
					</tr>
				</thead>
					<tbody v-if="isLoading">
						<tr>
							<td colSpan={5}>
								<icon name="spinner" pulse></icon>
							</td>
						</tr>
					</tbody>
					<draggable element="tbody" @update="setSortChanged()" v-model="songs" :options="{group:'people'}" @start="drag=true" @end="drag=false">
						<tr v-if="isReady" v-for="(song, i) in songs" :key="song.variant_id" class="list-item">
							<td>{{ i + 1 }}</td>
							<td>{{ song.song.title }}</td>
							<td>{{ mapInterpretersNames(song.song.interpreters) }}</td>
							<td>
								<router-link :to="{ name: 'variantView', params: { songId: song.song.song_id, variantId: song.variant_id } }" class="button-mr">Zobrazit</router-link>
								<router-link :to="{ name: 'variantEdit', params: { songId: song.song.song_id, variantId: song.variant_id } }" class="button-mr">Upravit</router-link>
								<a @click="removeVariant(song.variant_id)" class="delete-button">Odebrat</a>
							</td>
						</tr>
					</draggable>
			</table>
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'
import Draggable from 'vuedraggable'

const songbookModule = namespace('songbook')
const interpreterModule = namespace('interpreter')

@Component({
	components: {
		PageLayout,
		Draggable,
	},
})
export default class SongbookEdit extends Vue {
	@songbookModule.Action private fetch!: (songbookId: string) => void
	@songbookModule.Action private update!: (songbook: ISongbook) => void
	@songbookModule.Action private create!: (title: string) => void
	@songbookModule.Action private exportSongbook!: () => void
	@songbookModule.State private state!: EStateTypes
	@songbookModule.State private exportState!: EStateTypes
	@songbookModule.State private exportLink!: string
	@songbookModule.State private songbook!: ISongbook

	@interpreterModule.State('state') private interpretersState!: EStateTypes
	@interpreterModule.Action('fetch') private fetchInterpreters!: () => void;
	@interpreterModule.Getter('itemById') private interpreterById!: (id: string) => IInterpreter;

	private songbookTitle = ''
	private songs = [] as ISongbookSong[]
	private songbookId = ''
	private isNew = false
	private drag = false
	private sortChanged = false

	private get isChanged () {
		return this.isNew || this.songbookTitle !== this.songbook.title || this.songs.length !== this.songbook.songs.length || this.sortChanged
	}

	private get isReady () {
		return this.state === EStateTypes.ready && this.interpretersState === EStateTypes.ready
	}

	private get isLoading () {
		return this.state === EStateTypes.loading || this.interpretersState === EStateTypes.loading
	}

	private get exportLoading () {
		return this.exportState === EStateTypes.loading
	}

	private get exportReady () {
		return this.exportState === EStateTypes.ready
	}

	private get exportFailed () {
		return this.exportState === EStateTypes.failed
	}

	private setSortChanged () {
		this.sortChanged = true
	}

	private mapInterpretersNames (ids: string[]) {
		if (!ids) {
			return
		}
		return ids.map((id) => this.interpreterById(id).name)
			.filter((int) => int)
			.join(', ')
	}

	private removeVariant (id: string) {
		this.songs = this.songs.filter((song) => song.variant_id !== id)
	}

	private async save () {
		if (this.isNew) {
			await this.create(this.songbookTitle)
			this.$router.push({ name: 'songbookEdit', params: { songbookId: this.songbook.id } })
		} else {
			this.update({
				id: this.songbookId,
				title: this.songbookTitle,
				songs: this.songs.map((song, i) => ({ ...song, order: i })),
				options: this.songbook.options,
			})
		}
		this.sortChanged = false
	}

	private async created () {
		if (!this.$route.params.songbookId) {
			this.isNew = true
		}
		if (!this.isNew) {
			this.fetchInterpreters()
			this.songbookId = this.$route.params.songbookId
			await this.fetch(this.songbookId)
			this.formInit()
		}
	}

	private formInit () {
		if (!this.isNew) {
			this.songbookTitle = this.songbook.title
			this.songs = this.songbook.songs.sort((a, b) => a.order - b.order)
			this.songbookId = this.songbook.id
		} else {
			this.songbookTitle = ''
			this.songs = []
			this.songbookId = ''
		}
	}

	@Watch('$route')
	private onRouteChange (to: any, from: any) {
		if (to.params.songbookId) {
			this.fetch(to.params.songbookId)
			this.isNew = false
		} else {
			this.isNew = true
		}
		this.formInit()
	}
}
</script>

<style scoped lang="scss">
	.save-wrapper {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.button-mr {
		margin-right: 10px;
	}

	.button-ml {
		margin-left: 10px;
	}

	.delete-button {
		cursor: pointer;
	}

	.export-wrapper {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
		align-items: center;
	}

	.alert {
		margin-bottom: 0;
		padding: 0.375rem 0.75rem;
	}
</style>
