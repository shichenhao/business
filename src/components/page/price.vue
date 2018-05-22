<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form style="padding: 0 0 20px">
                <el-button type="primary" :disabled="!multipleSelection.length" icon="el-icon-news" @click="deleteOrder()">删除</el-button>
                <el-form-item style="float: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="handleEdit()">新建</el-button>
                </el-form-item>
            </el-form>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="编号"
                width="60"
                align="center"
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="所属代理商"
                width="180">
            </el-table-column>
            <el-table-column
                prop="expressMerchantName"
                label="商户名称">
            </el-table-column>
            <el-table-column
                prop="consignerProvinceName"
                label="发货地区"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="consigneeProvinceName"
                label="收货地区"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="price"
                label="基础价格"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="weight"
                label="基础重量"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="addPrice"
                label="超出每公斤加价"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="modifyTime"
                label="更新时间"
                width="200"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="60"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row.id)" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData && tableData.total">
            <el-pagination
                background
                @current-change="onSearch"
                layout="prev, pager, next"
                :page-size="20"
                :total="tableData.total || 0">
            </el-pagination>
        </div>


        <el-dialog title="价格设置" :visible.sync="dialogFormVisible">
            <el-form :model="addParam" :rules="rules" ref="addParam" v-loading="addLoading">
                <el-form-item label="发货地区" prop="consignerProvince" :label-width="formLabelWidth">
                    <el-select def v-model="addParam.consignerProvince" placeholder="请选择">
                        <el-option v-for="item in list.province" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收货地区" prop="consigneeProvince" :label-width="formLabelWidth">
                    <el-select def v-model="addParam.consigneeProvince" placeholder="请选择">
                        <el-option v-for="item in list.province" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="基础价格" prop="price" :label-width="formLabelWidth" style="width: 300px">
                    <el-input v-model="addParam.price" form="number">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="基础重量" prop="weight" :label-width="formLabelWidth" style="width: 280px">
                    <el-input v-model="addParam.weight">
                        <template slot="append">公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="超出每公斤加价" prop="addPrice" :label-width="formLabelWidth" style="width: 350px">
                    <el-input v-model="addParam.addPrice">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd('addParam')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            let commissionAmtValidata = (rule, value, callback) => {
                let err = rule.field== 'weight' ? '重量' : '价格'

                let reg = /^(?:(?:(?:[1-9]\d{0,2}(?:,\d{3})*)|[1-9]\d*|0))(?:\.\d{1,2})?$/;
                if(!value || value == ''){
                    callback(new Error('请填写' + err));
                }else if(!reg.test(value)){
                    callback(new Error('请输入正确的' + err));
                }else{
                    callback();
                }
            };
            let commissionAmtValidata2 = (rule, value, callback) => {
                let err = rule.field== 'weight' ? '重量' : '价格'

                let reg = /^(?:(?:(?:[1-9]\d{0,2}(?:,\d{3})*)|[1-9]\d*|0))(?:\.\d{1,2})?$/;
                if(value === ''){
                    callback(new Error('请填写' + err));
                }else if(!reg.test(value)){
                    callback(new Error('请输入正确的' + err));
                }else{
                    callback();
                }
            };
            return {
                loginType:sessionStorage.getItem('loginType')==1 ? true : false,//登录权限 0 代理商 1 管理员
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                multipleSelection: [],
                list,
                searchParam: {},
                addParam:{
                    consignerProvince:'',
                    consigneeProvince:'',
                    weight:'',
                    addPrice:'',
                    price:''
                },
                form:{
                },
                rules: {
                    merchantId: [
                        { required: true, message: '请选择商家', trigger: 'change' }
                    ],
                    consignerProvince: [
                        { required: true, message: '请选发货地区', trigger: 'change' }
                    ],
                    consigneeProvince: [
                        { required: true, message: '请选收货地区', trigger: 'change' }
                    ],
                    price: [
                        { required: true, validator: commissionAmtValidata2,  trigger: 'change' }
                    ],
                    addPrice: [
                        { required: true, validator: commissionAmtValidata,  trigger: 'change' }
                    ],
                    weight: [
                        { required: true, validator: commissionAmtValidata,  trigger: 'change' }
                    ],
                },
                formLabelWidth: '140px'
            }
        },
        methods: {
            getMerchantName(){ // 获取商户名称
                this.$axios.post('/express/manageClient/findExpressMerchantDTOList',addToken({agentId:this.searchParam.agentId})).then((res)=>{
                    window.list.merchantName=res.data.value
                })
            },
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={
                    consignerProvince:'',
                    consigneeProvince:'',
                    weight:'',
                    addPrice:'',
                    price:''
                }
            },
            indexMethod(index) {//序号
                return index + 1;
            },
            handleAdd(formName) {//新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addLoading=true
                        this.$axios.post("/express/merchantClient/createOrMergeExpressPrice",addToken(this.addParam) ).then((res)=>{
                            this.addLoading=false
                            console.log(res.data,'创建成功')
                            if(res.data.success){
                                this.$refs['addParam'].resetFields()
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit();
                                this.onSearch(this.searchParam.start/20+1);
                            }else{
                                this.$message({
                                    message: res.data.message,
                                    type: 'success'
                                });
                            }
                        }).catch((error)=>{
                            this.addLoading=false
                            this.$message.error(error.response.data.message);
                        })
                    } else {
                        return false;
                    }
                });
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                //console.log('搜索条件',this.searchParam);
                this.$axios.post("/express/merchantClient/findExpressPriceList",addToken(this.searchParam) ).then((res)=>{
                    this.searchLoading=false;
                    //console.log('返回结果',res.data)
                    this.tableData=res.data.value
                })
            },
            handleEdit(id) {//修改
                this.addInit(true)
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                if(id){
                    this.addLoading = true;
                    this.$axios.post('/express/merchantClient/findExpressPrice',addToken({id})).then((res)=>{
                        this.addLoading = false;
                        this.addParam=res.data.value
                    })
                }
            },
            handleSelectionChange(val) {//选中的数据
                this.multipleSelection = val;
            },
            deleteOrder() {//删除
                let ids = this.multipleSelection.map(item=> item.id).toString()
                this.$axios.post('/express/merchantClient/batchRemoveExpressPrice', addToken({ids})).then((res)=>{
                    if(res.data.success){
                        this.$message.success('操作成功！');
                        this.onSearch(this.searchParam.start/20+1);
                    }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
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
