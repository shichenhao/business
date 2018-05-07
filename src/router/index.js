import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/price'
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/price.vue'], resolve)
                },
                {
                    path: '/price',
                    component: resolve => require(['../components/page/price.vue'], resolve)
                },
                {
                    path: '/homeData',
                    component: resolve => require(['../components/page/homeData.vue'], resolve)
                },
                {
                    path: '/order',
                    component: resolve => require(['../components/page/order.vue'], resolve)
                }
            ]
        }
    ]
})
