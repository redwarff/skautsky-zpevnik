<template>
	<page-layout title="Editace písně">
		<div v-if="isLoading">
			<icon name="spinner" pulse></icon>
		</div>
		<div v-if="isReady" class="col-sm-12">
			<div>
				<div>
					<h4>{{ isNew ? 'Nová píseň' : songTitle }}</h4>
				</div>
				<div v-if="!isNew" class="variant-wrapper">
					<select v-model="variantId">
						<option v-for="(variant, i) in song.variants" :key="variant.id" :value="variant.id">Varianta {{ i + 1 }}</option>
					</select>
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
            <div class="form-group editor-group">
              <label>Píseň:</label>
              <div class="editor-control">
                <div class="btn-group">
                  <button v-for="tab in tabs" :key="tab" class="btn btn-default" @click.prevent="onTabClick(tab)">{{ tab }}</button>
                </div>
                <div class="btn-group">
                  <button v-for="chord in chords" :key="chord" class="btn btn-default btn-chord" @click.prevent="onChordClick(chord)">{{ `${chord}${shiftChords ? '#' : ''}${mollChords ? 'mi' : ''}` }}</button>
                </div>
                <div class="btn-group">
                  <button class="btn btn-default btn-chord" @click.prevent="toggleShiftChords">#</button>
                  <button class="btn btn-default btn-chord" @click.prevent="toggleMollChords">mi</button>
                </div>
              </div>
              <textarea id="editor" class="form-control variant-text" rows="10" v-model="text" />
            </div>
            <button class="btn btn-default" @click.prevent="save()" >
              Uložit
            </button>
          </form>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="psm">
            <h4>Editor návod</h4>
            <p>Editor využívá značky pro zadávání akordů a částí písniček.</p>
            <ul>
              <li><b>[C]</b>/<b>[C#]</b>/<b>[Dmi]</b> - akordy</li>
              <li><b>[verse]</b> - sloka</li>
              <li><b>[chorus]</b> - refrén</li>
              <li><b>[rec]</b> - mluvené slovo</li>
              <li><b>[solo]</b>/<b>[intro]</b>/<b>[outro]</b>/<b>[bridge]</b>/<b>[intermezzo]</b> - další možné značky - všechny reprezentují nečíslovanou sloku.</li>
              <li><b>|:</b> ... <b>:|</b> - začátek a konec repetice</li>
            </ul>
            <p>Akordy můžeš psát i ty, které nejsou zde v návodu a nebo v editoru samotném. Zpěvník by měl akceptovat všechny existující akordy</p>
            <p>Značky vždy značí začátek části, konec je automaticky u další značky nebo na konci písně. Jediné omezení na značky je, že část se nemůže měnit uvnitř repetice a repetice nemohou být vnořené.</p>
            <p>Značka <b>[chorus]</b> se dá bez problému použít samotná a reprezentuje opakující se stejný refrén.</p>
            <p>Zpěvník má omezený množství znaků, které se mohou v písničce objevit. Kromě abecedy (malé i velké včetně češtiny) a čísel jsou to: <b>. , - + ? ! & # " ( ) [ ] | : '</b></p>
            <p>Do editoru můžeš zadávat značky ručně a nebo použít tlačítka v hlavičce.</p>
          </div>
          <div class="psm">
            <h4>Příklad písně</h4>
            <p>
              <b>[verse]</b><br />
              <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
              který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br /><br />
              <b>[chorus]</b><br />
              Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
              <b>|:</b> někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal. <b>:|</b><br /><br />
              <b>[verse]</b><br />
              První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />
            </p>
          </div>
        </div>
      </div>
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
const authorModule = namespace('author')

@Component({
	components: {
		PageLayout,
	},
})
export default class VariantView extends Vue {
	@songModule.Action('fetch') private fetchSong!: (songId: string) => void
	@songModule.Action private updateVariant!: (variant: IVariant) => void
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
  private tabs = ['chorus', 'verse', 'rec']
  private chords = ['C', 'D', 'E', 'F', 'G', 'A', 'H']
  private isNew = false
  private shiftChords = false
  private mollChords = false
  
  private songTitle = ''
  private selectedInterpreters = [] as ISelectOption[]
  private selectedMusicAuthors = [] as ISelectOption[]
  private selectedLyricsAuthors = [] as ISelectOption[]
  private description = ''
  private text = ''
  
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
      this.description = this.variantById(this.variantId).description
      this.text = this.variantById(this.variantId).text
      this.selectedInterpreters = this.song.interpreters.map(inter => ({ value: inter, label: this.interpreterById(inter).name })) || []
      this.selectedMusicAuthors = (this.song.authors && this.song.authors.music) ? this.song.authors.music.map(author => ({ value: author, label: this.authorById(author).name })) : []
      this.selectedLyricsAuthors = (this.song.authors && this.song.authors.lyrics) ? this.song.authors.lyrics.map(author => ({ value: author, label: this.authorById(author).name })) : []
    }
  }

  private addEditorTag (tag: string) {
    const editor = document.querySelector('#editor') as any
    const caretPosition = editor.selectionStart
    const text = editor.value

    editor.value = text.substring(0, caretPosition) + tag + text.substring(caretPosition)
    this.text = editor.value
    editor.selectionEnd = caretPosition + tag.length
    editor.focus()
  }

  private onTabClick (tab: string) {
    const tag = `[${tab}]`
    this.addEditorTag(tag)
  }

  private onChordClick (chord: string) {
    const tag = `[${chord}${this.shiftChords ? '#' : ''}${this.mollChords ? 'mi' : ''}]`
    this.addEditorTag(tag)
  }

  private toggleShiftChords () {
    this.shiftChords = !this.shiftChords
  }

  private toggleMollChords () {
    this.mollChords = !this.mollChords
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
      visibility: 0,
    }

    if (this.isNew) {
      await this.createSong({ ...song, variant })
      this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: this.song.variants[0].id } })
    } else {
      await this.updateVariant({ ...variant, id: this.variantId })
      await this.updateSong({ ...song, id: this.song.id })
      this.$router.push({ name: 'variantView', params: { songId: this.song.id, variantId: this.variantId } })
    }
  }

  private async saveAndLeave () {
    await this.save()
  }

	@Watch('$route')
	private onRouteChange (to: any, from: any) {
		if (to.params.songId !== from.params.songId) {
			this.fetchSong(this.$route.params.songId)
		}
		this.variantId = to.params.variantId
	}

	@Watch('variantId')
	private onVariantChange (to: string, from: string) {
		if (to && from && to !== from) {
			this.$router.push({ name: 'VariantView', params: { songId: this.song.id, variantId: to } })
		}
	}
}
</script>

<style scoped lang="scss">
	.editor-control {
    display: flex;
    justify-content: space-between;
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
