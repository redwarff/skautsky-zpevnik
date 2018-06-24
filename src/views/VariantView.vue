<template>
	<page-layout title="Zobrazení písně">
		<div v-if="isLoading">
			<icon name="spinner" pulse></icon>
		</div>
		<div v-if="isReady" class="col-sm-12">
			<div>
				<div>
					<h4>{{ song.title }}</h4>
					<h5>{{ mapInterpretersNames(song.interpreters) }}</h5>
				</div>
				<div class="variant-wrapper">
					<select v-model="variantId">
						<option v-for="(variant, i) in song.variants" :key="variant.id" :value="variant.id">Varianta {{ i + 1 }}</option>
					</select>
					<div class="variant-desc">
						<strong>Popis varianty:</strong> {{ variantById(variantId).description }}
					</div>
				</div>
			</div>
			<div class="song-view">
				{{ formattedVariantText }}
			</div>
			<router-link tag="button" class="btn btn-default button-mr" :to="{ name: 'variantEdit', params: { songId: song.id, variantId } }">
				Upravit
			</router-link>
			<!-- <button class="btn btn-default button-mr" @click="exportVariant(variantId)">
				Zobrazit v pdf
			</button> -->
			<!-- <span v-if="exportLoading" class="alert alert-primary">Píseň se připravuje...</span>
			<span v-if="exportFailed" class="alert alert-danger">Píseň se nepodařilo zkompilovat.</span>
			<span v-if="exportReady" class="alert alert-success">
				Píseň je připravena! Stáhnout ji můžeš
				<a target="_blank" rel="noopener noreferrer" :href="exportLink"> zde</a>
			</span> -->
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'

const songModule = namespace('song')
const interpreterModule = namespace('interpreter')

@Component({
	components: {
		PageLayout,
	},
})
export default class VariantView extends Vue {
	@songModule.Action private fetch!: (songId: string) => void
	@songModule.State private state!: EStateTypes
	@songModule.State private song!: ISong
	@songModule.Getter private variantById!: (variantId: string) => IVariant

	@interpreterModule.State('state') private interpretersState!: EStateTypes
	@interpreterModule.Action('fetch') private fetchInterpreters!: () => void;
	@interpreterModule.Getter('itemById') private interpreterById!: (id: string) => IInterpreter;

	private variantId = ''

	private get isReady () {
		return this.state === EStateTypes.ready && this.interpretersState === EStateTypes.ready
	}

	private get isLoading () {
		return this.state === EStateTypes.loading || this.interpretersState === EStateTypes.loading
	}

	// private get exportLoading () {
	// 	return this.exportState === EStateTypes.loading
	// }

	// private get exportReady () {
	// 	return this.exportState === EStateTypes.ready
	// }

	// private get exportFailed () {
	// 	return this.exportState === EStateTypes.failed
	// }

	private get formattedVariantText () {
		const text = this.variantById(this.variantId).text.replace(/\[verse\]/ig, '')
		const lines = text
			.split(/[\n\r]/)
			.map((line) => line.trim())
		const chordRegex = /\[(.+?)\]/

		const printedLines = [] as string[]
		lines.forEach((line) => {
			let tempLine = line
			let result = chordRegex.exec(tempLine)
			const chords = [] as string[]
			while (result !== null) {
				const fullChord = result[0]
				const chord = result[1]
				const index = result.index
				const spaces: number = index - chords.reduce((acc, cur) => acc + cur.length, 0)
				chords.push((chord as any).padStart(spaces + chord.length))
				tempLine = tempLine.replace(fullChord, '')
				result = chordRegex.exec(tempLine)
			}
			if (chords.length > 0) {
				printedLines.push(chords.join(''))
			}
			printedLines.push(tempLine)
		})
		return printedLines.join('\n')
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
		this.fetch(this.$route.params.songId)
		this.variantId = this.$route.params.variantId
	}

	@Watch('$route')
	private onRouteChange (to: any, from: any) {
		if (to.params.songId !== from.params.songId) {
			this.fetch(this.$route.params.songId)
		}
		this.variantId = to.params.variantId
	}

	@Watch('variantId')
	private onVariantChange (to: string, from: string) {
		console.log(to, from)
		if (to && from && to !== from) {
			this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: to } })
		}
	}
}
</script>

<style scoped lang="scss">
	.song-view {
		white-space: pre;
		font-family: 'Courier New';
	}

	.button-mr {
		margin-right: 10px;
	}

	.variant-wrapper {
		margin-top: 10px;
	}

	.variant-desc {
		margin-top: 5px;
	}
</style>
