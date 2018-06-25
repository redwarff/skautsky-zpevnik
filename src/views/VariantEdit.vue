<template>
	<page-layout :title="isVariantNew ? 'Nová varianta písně' : 'Editace písně'">
    <template slot="header-button">
			<router-link v-if="!isNew && isReady && !isVariantNew" class="btn btn-primary" :to="{ name: 'songVariantCreate', params: { songId: song.id } }">Vytvořit novou variantu písně</router-link>
		</template>
		<div v-if="isLoading">
			<icon name="spinner" pulse></icon>
		</div>
		<div v-if="isReady" class="col-sm-12">
			<div>
				<div>
					<h4>{{ isNew ? 'Nová píseň' : songTitle }}</h4>
				</div>
				<div v-if="!isNew" class="variant-wrapper">
					<select v-if="!isVariantNew" v-model="variantId">
						<option v-for="(variant, i) in song.variants" :key="variant.id" :value="variant.id">Varianta {{ i + 1 }}</option>
					</select>
          <div v-else>Nová varianta</div>
					<div class="variant-desc">
						<strong>Popis varianty:</strong> {{ description }}
					</div>
				</div>
			</div>
      <div class="row">
        <div class="col-md-8 col-sm-12">
          <form>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Jméno písně:</label>
                  <input type="text" class="form-control" id="name" v-model="songTitle" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Interpret:</label>
                  <v-select multiple taggable v-model="selectedInterpreters" :options="mappedInterpreters" :closeOnSelect="false" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Autor hudby:</label>
                  <v-select multiple taggable v-model="selectedMusicAuthors" :options="mappedAuthors" :closeOnSelect="false" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Autor textu:</label>
                  <v-select multiple taggable v-model="selectedLyricsAuthors" :options="mappedAuthors" :closeOnSelect="false" />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Popis varianty:</label>
              <textarea class="form-control" rows="4" v-model="description"/>
            </div>
            <div class="form-check mb-10">
              <input type="checkbox" class="form-check-input" v-model="isPrivate">
              <label class="form-check-label">Soukromá</label>
            </div>
            <editor v-model="text"></editor>
            <button class="btn btn-primary" @click.prevent="save()" >
              Uložit
            </button>
          </form>
        </div>
        <div class="col-md-4 col-sm-12">
          <variant-edit-description></variant-edit-description>
        </div>
      </div>
		</div>
	</page-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import VariantEditDescription from '@/components/VariantEditDescription.vue'
import Editor from '@/components/Editor.vue'
import { namespace } from 'vuex-class'
import { EStateTypes } from '@/lib/enums'

const songModule = namespace('song')
const interpreterModule = namespace('interpreter')
const authorModule = namespace('author')

@Component({
	components: {
		PageLayout,
		VariantEditDescription,
		Editor,
	},
})
export default class VariantView extends Vue {
	@songModule.Action('fetch') private fetchSong!: (songId: string) => void
	@songModule.Action private updateVariant!: (variant: IVariant) => void
	@songModule.Action private createVariant!: (variant: Partial<IVariant>) => IVariant
	@songModule.Action private updateSong!: (song: Partial<ISong>) => void
	@songModule.Action private createSong!: (song: ICreateSong) => void
	@songModule.State('state') private songState!: EStateTypes
	@songModule.State private song!: ISong
	@songModule.Getter private variantById!: (variantId: string) => IVariant

	@interpreterModule.State('state') private interpretersState!: EStateTypes
	@interpreterModule.State('items') private interpreters!: IInterpreter[]
	@interpreterModule.Action('fetch') private fetchInterpreters!: () => void
	@interpreterModule.Action('create') private createInterpreter!: (name: string) => void
  @interpreterModule.Getter('itemById') private interpreterById!: (id: string) => IInterpreter
  @interpreterModule.Getter('itemByName') private interpreterByName!: (name: string) => IInterpreter
  
	@authorModule.State('state') private authorsState!: EStateTypes
	@authorModule.State('items') private authors!: IAuthor[]
	@authorModule.Action('fetch') private fetchAuthors!: () => void
	@authorModule.Action('create') private createAuthor!: (name: string) => void
	@authorModule.Getter('itemById') private authorById!: (id: string) => IAuthor
  @authorModule.Getter('itemByName') private authorByName!: (name: string) => IAuthor

  private variantId = ''
  private isNew = false
  private isVariantNew = false
  
  private songTitle = ''
  private selectedInterpreters = [] as ISelectOption[]
  private selectedMusicAuthors = [] as ISelectOption[]
  private selectedLyricsAuthors = [] as ISelectOption[]
  private description = ''
  private text = ''
  private isPrivate = false
  
	private get isReady () {
		return this.songState === EStateTypes.ready && this.interpretersState === EStateTypes.ready && this.authorsState === EStateTypes.ready
	}

	private get isLoading () {
		return this.songState === EStateTypes.loading || this.interpretersState === EStateTypes.loading || this.authorsState === EStateTypes.loading
  }
  
  private get mappedInterpreters () {
    return this.interpreters.map(interpreter => ({ label: interpreter.name, value: interpreter.id }))
  }

  private get mappedAuthors () {
    return this.authors.map(author => ({ label: author.name, value: author.id }))
  }

	private async created () {
    if (!this.$route.params.songId) {
      this.isNew = true
    } else if (!this.$route.params.variantId) {
      this.isVariantNew = true
    }
		await Promise.all([
      this.fetchInterpreters(),
      this.fetchAuthors(),
      !this.isNew && this.fetchSong(this.$route.params.songId),
    ])
    this.variantId = this.$route.params.variantId
    this.formInit()
  }
  
  private formInit () {
    if (!this.isNew) {
      this.songTitle = this.song.title
      this.selectedInterpreters = this.song.interpreters.map(inter => ({ value: inter, label: this.interpreterById(inter).name })) || []
      this.selectedMusicAuthors = (this.song.authors && this.song.authors.music) ? this.song.authors.music.map(author => ({ value: author, label: this.authorById(author).name })) : []
      this.selectedLyricsAuthors = (this.song.authors && this.song.authors.lyrics) ? this.song.authors.lyrics.map(author => ({ value: author, label: this.authorById(author).name })) : []

      if (!this.isVariantNew) {
        this.description = this.variantById(this.variantId).description
        this.text = this.variantById(this.variantId).text
        this.isPrivate = this.variantById(this.variantId).visibility === 0 ? true : false
      }
    }
  }

  private async save () {
    const newInterpreters = this.selectedInterpreters
      .map(selectOptionItem => selectOptionItem.value || selectOptionItem.label)
      .filter(interpreter => !this.interpreters.find(_inter => _inter.id === interpreter))
    const newAuthors = this.selectedMusicAuthors
      .concat(this.selectedLyricsAuthors)
      .map(selectOptionItem => selectOptionItem.value || selectOptionItem.label)
      .filter(author => !this.authors.find(_author => _author.id === author))

    await Promise.all(
      newInterpreters.map(this.createInterpreter)
        .concat(newAuthors.map(this.createAuthor))
    )

    await Promise.all([
        this.fetchAuthors(),
        this.fetchInterpreters(),
    ])

    const song = {
      title: this.songTitle,
      authors: {
        music: this.selectedMusicAuthors.map(selectOptionItem => selectOptionItem.value ? selectOptionItem.value : this.authorByName(selectOptionItem.label).id),
        lyrics: this.selectedLyricsAuthors.map(selectOptionItem => selectOptionItem.value ? selectOptionItem.value : this.authorByName(selectOptionItem.label).id),
      },
      interpreters: this.selectedInterpreters.map(selectOptionItem => selectOptionItem.value ? selectOptionItem.value : this.interpreterByName(selectOptionItem.label).id),
    }

    const variant = {
      description: this.description,
      text: this.text,
      visibility: this.isPrivate ? 0 : 1,
    }

    if (this.isNew) {
      await this.createSong({ ...song, variant })
      this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: this.song.variants[0].id } })
    } else if (this.isVariantNew) {
      const newVariant = await this.createVariant(variant)
      await this.updateSong({ ...song, id: this.song.id })
      this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: newVariant.id } })
    } else {
      await this.updateVariant({ ...variant, id: this.variantId })
      await this.updateSong({ ...song, id: this.song.id })
      this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: this.variantId } })
    }
  }

	@Watch('$route')
	private onRouteChange (to: any, from: any) {
		if (to.params.songId !== from.params.songId) {
			this.fetchSong(this.$route.params.songId)
		}
    this.variantId = to.params.variantId
    if (!this.variantId) {
      this.isVariantNew = true
    } else {
      this.isVariantNew = false
    }
    this.formInit()
	}

	@Watch('variantId')
	private onVariantChange (to: string, from: string) {
		if (to && from && to !== from) {
			this.$router.push({ name: 'variantEdit', params: { songId: this.song.id, variantId: to } })
		}
	}
}
</script>

<style scoped lang="scss">
  .button-mr {
    margin-right: 10px;
  }

	.variant-wrapper {
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.variant-desc {
		margin-top: 10px;
		margin-bottom: 10px;
	}

  .mb-10 {
    margin-bottom: 10px;
  }
</style>
