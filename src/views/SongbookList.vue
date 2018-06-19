<template>
	<page-layout>
		Songbook list
	</page-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'

@Component({
	components: {
		PageLayout,
	},
})
export default class SongbookList extends Vue {

}
</script>