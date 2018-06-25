<template>
	<div class="input-group mb-3">
		<div class="input-group-append" @click="onSearch(inputValue)">
			<span class="input-group-text">
				<icon name="search"></icon>
			</span>
		</div>
		<input type="text" class="form-control" :placeholder="placeholder" v-model="inputValue" @keypress.enter="onSearch(inputValue)">
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
	@Prop() private onSearch!: (value: string) => void;
	@Prop() private placeholder!: string;
	private inputValue = ''
}
</script>
