<template>
	<div>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class VariantEditDescription extends Vue {
}
</script>
