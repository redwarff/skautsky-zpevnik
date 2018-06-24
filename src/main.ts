import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/rootStore'
import Icon from 'vue-awesome/components/Icon.vue'
import vSelect from 'vue-select'

import 'vue-awesome/icons'
import './lib/types'

Vue.config.productionTip = false
Vue.component('icon', Icon)
Vue.component('v-select', vSelect)

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
