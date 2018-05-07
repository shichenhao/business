<template>
    <el-menu :default-active="onRoutes" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
        <template v-for="item in items">
            <el-menu-item :index="item.index">
                <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>
        </template>
    </el-menu>
</template>
<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'price',
                        title: '价格设置'
                    },
                    {
                        icon: 'el-icon-date',
                        index: 'homeData',
                        title: '期望上门时间'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'order',
                        title: '订单管理'
                    }
                ]
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
