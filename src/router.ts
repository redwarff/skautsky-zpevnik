import Vue from 'vue'
import Router from 'vue-router'
import SongbookEditor from './views/SongbookEditor.vue'
import SongbookList from './views/SongbookList.vue'
import SongList from './views/SongList.vue'
import VariantView from './views/VariantView.vue'
import VariantEdit from './views/VariantEdit.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'songList',
			component: SongList,
		},
		{
			path: '/songbook',
			name: 'songbookList',
			component: SongbookList,
		},
		{
			path: '/songbook/:songbookId',
			name: 'songbook',
			component: SongbookEditor,
		},
		{
			path: '/song/:songId/variant/:variantId',
			name: 'variantView',
			component: VariantView,
		},
		{
			path: '/song/new',
			name: 'variantCreate',
			component: VariantEdit,
		},
		{
			path: '/song/:songId/variant/:variantId/edit',
			name: 'variantEdit',
			component: VariantEdit,
		},
	],
});
