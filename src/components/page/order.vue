<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" :disabled="!multipleSelection.length" icon="el-icon-news" @click="clearOrder()">取件</el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="selectable"
            >
            </el-table-column>
            <el-table-column
                label="订单号"
                prop="id"
                width="160"
                align="center">
            </el-table-column>
            <el-table-column
                label="代理商"
                prop="agentName"
                min-width="120">
            </el-table-column>
            <el-table-column
                label="所属商家"
                prop="expressMerchantName"
                width="120">
            </el-table-column>
            <el-table-column
                label="发货人"
                prop="consignerName"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="发货地址"
                prop="consignerAddress"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="收货人"
                prop="consigneeName"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="收货地址"
                prop="consigneeAddress"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="取件时间"
                prop="modifyTime"
                width="110"
                align="center">
            </el-table-column>
            <el-table-column
                label="订单状态"
                prop="name"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersOrders(scope.row.status)}}
                </template>
            </el-table-column>
            <!--<el-table-column
                label="备注"
                width="120"
                prop="remark">
            </el-table-column>
            <el-table-column
                label="快递公司"
                prop="expressMerchantName"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="费用预估"
                prop="totalPrice"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="付款金额"
                prop="price"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="系统收益"
                prop="sysRateAmt"
                width="100"
                align="center">
            </el-table-column>-->
            <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status === 0 || scope.row.status === 1" @click="cancelOrder(scope.row.id)" size="small">取消订单</el-button>
                    <el-button type="text" v-if="scope.row.status === -1" @click="lookOrder(scope.row.cancelReason)" size="small">查看取消原因</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData && tableData.total">
            <el-pagination
                @current-change="onSearch"
                layout="prev, pager, next"
                :page-size="20"
                :total="tableData.total || 0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                list,
                searchParam: {},
                addParam:{},
                multipleSelection: [],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        methods: {
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                if(this.searchParam.data){
                    this.searchParam.startTime=this.searchParam.data[0]
                    this.searchParam.endTime=this.searchParam.data[1]
                    delete this.searchParam.data
                }
                this.$axios.post('/express/merchantClient/findExpressOrderList',addToken(this.searchParam)).then((res)=>{
                    this.searchLoading=false
                    //console.log(res.data.value)
                    this.tableData=res.data.value
                })
            },
            handleSelectionChange(val) {//选中的数据
                this.multipleSelection = val;
            },
            clearOrder(id) {//取件
                let ids = this.multipleSelection.map(item=> item.id).toString();
                this.dialogFormVisible=true
                this.$axios.post('/express/merchantClient/batchDoneExpressOrder',addToken({ids})).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
            cancelOrder(id) {//取消订单
                console.log(id)
                this.dialogFormVisible=true
                this.$axios.post('/express/merchantClient/cancelExpressOrder',addToken({id})).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
            lookOrder(txt){ // 查看取消原因
                this.$alert(txt , '取消原因', {
                    confirmButtonText: '确定'
                });
            },
            selectable(row){
                if(row.status === 2){
                    return true
                }else{
                    return false
                }

            }
        },
        created(){
            this.onSearch()
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
