<template>
	<div class="container-fluid">
		<nav class="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center">
			<div class="container">
				<router-link :to="{ name: 'songList' }">
					<img src="../assets/logo.svg" alt="" class="logo" />
				</router-link>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse d-flex" id="navbarNav">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item active">
							<router-link :to="{ name: 'songList' }" class="nav-link">Písně</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" :to="{ name: 'songbookList' }">Zpěvníky</router-link>
						</li>
					</ul>
					<ul class="navbar-nav">
						<li class="nav-item active">
							<a class="nav-link">{{ username }}</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" :href="userLogoutLink">Odhlásit</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<div class="row">
			<div class="container">
				<div class="row">
          <div class="col-md-12">
            <div class="song-list-header">
              <h4>{{ title }}</h4>
              <slot name="header-button"></slot>
            </div>
            <hr />
          </div>
				</div>
				<div class="row">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, namespace } from 'vuex-class'

const userModule = namespace('user')

@Component
export default class PageLayout extends Vue {
	@Prop() private title!: string;
	@userModule.Action private getCurrentUser!: () => void;

	private get username () {
		const user = this.$store.state.user
		return user ? user.name : ''
	}

	private get userLogoutLink () {
		const user = this.$store.state.user
		return user ? user.logout_link : ''
	}

	private created () {
		this.getCurrentUser()
	}
}
</script>

<style scoped lang="scss">
	.logo {
		width: 40px;
		margin-right: 10px;
	}

	.song-list-header {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}
</style>
