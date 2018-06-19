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
			path: '/songbook/:id',
			name: 'songbook',
			component: SongbookEditor,
		},
		{
			path: '/song/variant/:id',
			name: 'variantView',
			component: VariantView,
		},
		{
			path: '/song/variant/:id/edit',
			name: 'variantEdit',
			component: VariantEdit,
		},
	],
});
