<template>
	<page-layout title="Zpěvníky">
		<template slot="header-button">
			<router-link class="btn btn-primary" :to="{ name: 'songbookCreate' }">Vytvořit nový zpěvník</router-link>
		</template>
		<div class="col-sm-12">
			<search-bar :onSearch="search" placeholder="Hledej zpěvník"></search-bar>
			<table class="table table-striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Zpěvník</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="isLoading">
						<td colSpan={5}>
							<icon name="spinner" pulse></icon>
						</td>
					</tr>
					<router-link tag="tr" v-if="isReady" v-for="(songbook, i) in items" :key="songbook.id"
						:to="{ name: 'songbookEdit', params: { songbookId: songbook.id } }"
						class="list-item clickable">
						<td>{{ i + 1 + page * perPage }}</td>
						<td>{{ songbook.title }}</td>
					</router-link>
				</tbody>
			</table>
			<pagination v-if="lastPage > 0" :activePage="page" :lastPage="lastPage" :goToPage="goToPage" ></pagination>
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'

const songbookListModule = namespace('songbookList')

@Component({
	components: {
		PageLayout,
		SearchBar,
		Pagination,
	},
})
export default class SongbookList extends Vue {
	@songbookListModule.Action private search!: (value: string) => void
	@songbookListModule.Action private fetch!: () => void
	@songbookListModule.Action private goToPage!: (page: number) => void
	@songbookListModule.State private state!: EStateTypes
	@songbookListModule.State private items!: ISongbook[]
	@songbookListModule.State private page!: number
	@songbookListModule.Getter private lastPage!: number
	@songbookListModule.State private perPage!: number

	private get isReady () {
		return this.state === EStateTypes.ready
	}

	private get isLoading () {
		return this.state === EStateTypes.loading
	}

	private async created () {
		await this.fetch()
	}
}
</script>

<style scoped>
	.clickable {
		cursor: pointer;
	}
</style>