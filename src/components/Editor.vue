<template>
	<div class="form-group editor-group">
		<label>Text varianty:*</label>
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
		<textarea ref="editor" class="form-control variant-text" rows="15" :value="value" @input="update()" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
	@Prop() private value!: string;

  private tabs = ['chorus', 'verse', 'rec']
  private chords = ['C', 'D', 'E', 'F', 'G', 'A', 'H']
  private shiftChords = false
	private mollChords = false
	
	private addEditorTag (tag: string) {
    const editor = this.$refs.editor as any
    const caretPosition = editor.selectionStart
    const text = editor.value

    editor.value = text.substring(0, caretPosition) + tag + text.substring(caretPosition)
    editor.selectionEnd = caretPosition + tag.length
    editor.focus()
    this.$emit('input', editor.value)
	}
	
	private update () {
    const editor = this.$refs.editor as any
		this.$emit('input', editor.value)
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
}
</script>

<style scoped lang="scss">
	.editor-control {
    display: flex;
    justify-content: space-between;
  }
</style>
