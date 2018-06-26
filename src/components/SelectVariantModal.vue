<template>
	<div class="modal-custom">
    <div class="overlay" @click="$close(false)"></div>
    <div class="modal-content content">
      <div class="modal-header">
				<h5 class="modal-title">Vyber variantu</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$close(false)">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="variant-wrapper" v-for="variant in variants" :key="variant.id" @click="$close(variant.id)">{{ `${variant.name} - ${variant.description}` }}</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="$close(false)">Zrušit</button>
			</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SelectVariantModal extends Vue {
	@Prop() private variants!: IVariant[]
}
</script>

<style scoped lang="scss">
	.variant-wrapper {
		cursor: pointer;
		margin-bottom: 10px;
	}

	.modal-custom {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		z-index: 100;
	}

  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
  }

  .content {
    background-color: #fff;
    z-index: 11;
    padding: 10px 30px 20px 30px;
    border-radius: 10px;
    max-height: 100%;
    overflow-y: auto;

    width: 80vw;
    max-width: 960px;
  }
</style>
