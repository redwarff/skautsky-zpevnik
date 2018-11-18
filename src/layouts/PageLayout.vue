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
						<div class="alert alert-info alert-dismissible fade show song-list-header" style="font-size: 13px;" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						    <span aria-hidden="true">&times;</span>
						  </button>
							<p>
								<b>Vítej ve Skautském zpěvníku - nástroji, kde si vytvoříš svůj zpěvník během pár minut.</b>
								<br /><br />
								Prosím, měj na zřeteli, že se zatím jedná o beta-verzi celého nástroje a proto se předem omlouváme, pokud by něco nefungovalo. Najdeš-li takovou věc, neváhej nám napsat, co nefunguje na <a href="mailto:zpevnik@skaut.cz">zpevnik@skaut.cz</a>. Stejně tak oceníme nápady či připomínky k čemukoliv, co už funguje.
								<br /><br />
								Abychom z beta-verze udělali finální verzi, potřebujeme ještě pomoct s dvěma body.
								<br /><br />
								1. Ve zpěvníku vidíte hodně písniček, ale část z nich ještě není přesně dle našeho formátu. Ty poznáte tak, že nemají označeného interpreta. Takže ty bez interpreta je třeba otevřít a upravit začátky slok/refrénů a akordy podle našeho formátu.
								Nápovědu, jak to má vypadat, najdete u každé editované písničky... a kdybyste si nevěděli rady.
								<br /><br />
								2. Žádáme autory o svolení s užitím jejich písní zde ve zpěvníku, a to přes OSA. Abychom jim mohli poslat žádost, musíme u každé skladny (písně) mít uvedeného autora textu i autora hudby. Tyto údaje se dají dohledat v databázi <a href="https://search.osa.cz">zde</a>. Pokud najdeš autora hudby/textu k dané psíni, zaznamenej to v této <a href="https://docs.google.com/spreadsheets/d/14Mymt6xNU-7n1ur5Vg0fTtO5QF-z8eekDtmubkTjnMI/edit?usp=sharing">tabulce</a>.
								<br /><br />
								Díky moc za pomoc,<br />
								tým Skautského zpěvníku
							</p>
						</div>
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
		return (user && user.currentUser) ? user.currentUser.name : ''
	}

	private get userLogoutLink () {
		const user = this.$store.state.user
		return (user && user.currentUser) ? user.currentUser.logout_link : ''
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
