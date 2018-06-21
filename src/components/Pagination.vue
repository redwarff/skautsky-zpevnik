<template>
	<nav>
		<ul class="pagination">
			<li class="page-item" :class="!canPrev ? 'disabled' : '' " @click="goToPage(activePage - 1)">
				<a class="page-link">
					<span>&laquo;</span>
				</a>
			</li>
			<li v-for="page in pages" :key="page" class="page-item" :class="page - 1 === activePage ? 'active' : ''" @click="goToPage(page - 1)">
				<a class="page-link">{{ page }}</a>
			</li>
			<li class="page-item" :class="!canNext ? 'disabled' : '' " @click="goToPage(activePage + 1)">
				<a class="page-link">
					<span>&raquo;</span>
				</a>
			</li>
		</ul>
	</nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Pagination extends Vue {
	@Prop() private activePage!: number
	@Prop() private goToPage!: (page: number) => void
	@Prop() private lastPage!: number

	private get pages () {
		const pages = []
		const pagesShownCount = Math.min(5, this.lastPage)
		const startingPage = Math.min(
			Math.max(this.activePage + 1 - Math.floor(pagesShownCount / 2), 1),
			this.lastPage + 1 - pagesShownCount + 1,
		)

		for (let i = startingPage; i < startingPage + pagesShownCount; i++) {
			pages.push(i)
		}
		return pages
	}

	private get canNext () {
		return this.activePage < this.lastPage
	}

	private get canPrev () {
		return this.activePage > 0
	}
}
</script>

<style scoped>
	.disabled {
		pointer-events: none;
	}
</style>