<template>
	<page-layout title="Písničky">
		<template slot="header-button">
			<router-link class="btn btn-primary" :to="{ name: 'variantCreate' }">Přidat novou píseň</router-link>
		</template>
		<div class="col-sm-12">
			<search-bar :onSearch="search"></search-bar>
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
					<router-link tag="tr" v-if="isReady" v-for="(song, i) in items" :key="song.id"
						:to="{ name: 'variantView', params: { songId: song.id, variantId: song.variants[0].id } }"
						class="list-item clickable">
						<td>{{ i + 1 + page * perPage }}</td>
						<td>{{ song.title }}</td>
						<td>{{ mapInterpretersNames(song.interpreters) }}</td>
						<td><router-link :to="{ name: 'variantEdit', params: { songId: song.id, variantId: song.variants[0].id } }" >Upravit</router-link></td>
					</router-link>
				</tbody>
			</table>
			<pagination :activePage="page" :lastPage="lastPage" :goToPage="goToPage" ></pagination>
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'

const songListModule = namespace('songList')
const interpreterModule = namespace('interpreter')

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
	@songListModule.State private perPage!: number

	@interpreterModule.State('items') private interpreters!: IInterpreter[]
	@interpreterModule.State('state') private interpretersState!: EStateTypes
	@interpreterModule.Action('fetch') private fetchInterpreters!: () => void;
	@interpreterModule.Getter('itemById') private interpreterById!: (id: string) => IInterpreter;

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

	private created () {
		this.fetchInterpreters()
		this.fetch()
	}
}
</script>

<style scoped>
	.clickable {
		cursor: pointer;
	}
</style>