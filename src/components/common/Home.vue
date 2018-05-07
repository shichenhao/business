<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    export default {
        components:{
            vHead
        },
        methods: {
            getCommon() {
                //查询省市区列表
                this.$axios.post('/express/public/findRegionDataDTOList').then((res)=>{
                    //sessionStorage.setItem('merchantId',1222)
                    window.list.province=res.data.value
                })

            }
        },
        mounted(){
          let token=getUrlParms("token") || this.$route.query.token
            if(token){
                sessionStorage.setItem("token",token)
            }
            this.getCommon()
        }
    }
</script>
