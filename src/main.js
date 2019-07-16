import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import './plugins/axios'
import './plugins/vuetify'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.filter('formatDateOnlyHour', function(value) {
  if (value) {
    return moment(String(value)).format('HH:mm')
  }
})
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD MM YYYY')
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
