<template>
	<div class="container-fluid">
		<nav class="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center">
			<router-link class="navbar-brand" :to="{ name: 'songList' }">
				<img src="../assets/logo.svg" alt="" class="logo" />
			</router-link>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse no-grow" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item active">
						<router-link :to="{ name: 'songList' }" class="nav-link">Písně</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" :to="{ name: 'songbookList' }">Zpěvníky</router-link>
					</li>
				</ul>
			</div>
		</nav>
		<div class="row">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageLayout extends Vue {}
</script>

<style scoped lang="scss">
	.no-grow {
		flex-grow: 0;
	}

	.logo {
		width: 40px;
		margin-right: 10px;
	}
</style>
