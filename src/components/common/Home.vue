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
                /*//获取权限
                this.$axios.post('/express/manageClient/findManageLoginType',addToken()).then((res)=>{
                    sessionStorage.setItem('loginType', res.data.value.loginType);

                    if(res.data.value.loginType === 0){
                        //查询商家列表
                        this.$axios.post('/express/manageClient/findExpressMerchantDTOList',addToken()).then((res)=>{
                            window.list.merchantName=res.data.value
                        })
                    }

                })*/
                //查询省市区列表
                this.$axios.post('/express/public/findRegionDataDTOList').then((res)=>{
                    //sessionStorage.setItem('merchantId',1222)
                    window.list.province=res.data.value
                })

            }
        },
        created(){
            let token=getUrlParms("token") || this.$route.query.token
            console.log(token);
            if(token){
                sessionStorage.setItem("token",token)
            }
            this.getCommon()
        }
    }
</script>
