import Vue from 'vue';
import root from './root.vue';

Vue.config.productionTip = false;

new Vue({
    el: '#root',
    render: h => h(root)
});
