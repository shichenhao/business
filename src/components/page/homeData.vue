<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item style="float: right;">
                <el-button type="primary" icon="el-icon-plus" @click="handleEdit()">新建</el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            style="width: 100%">
            <el-table-column
                label="编号"
                width="60"
                align="center"
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                prop="serviceDay"
                label="服务日期"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersDay(scope.row.serviceDay)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="serviceTime"
                label="取件时段">
                <template slot-scope="scope">
                    {{scope.row.serviceTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态"
                width="60"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersSatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="modifyTime"
                label="更新时间"
                min-width="200"
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

        <el-dialog title="期望上门时间" :visible.sync="dialogFormVisible" v-loading="addLoading">
            <el-form :model="addParam" :rules="rules" ref="addParam">
                <el-form-item label="服务日期" prop="serviceDay" :label-width="formLabelWidth">
                    <el-select v-model="addParam.serviceDay" placeholder="请选择">
                        <el-option v-for="item in list.data" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务时间" prop="serviceTime" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入服务时间格式如（09:00-10:00,多个请用逗号隔开）"
                        v-model="addParam.serviceTime">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
                    <el-select v-model="addParam.status" placeholder="请选择">
                        <el-option v-for="item in list.status" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addInit()">取 消</el-button>
                <el-button type="primary" @click="handleAdd('addParam')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            let dateValidata = (rule, value, callback) => {
                let reg=/^([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])-([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])$/;
                let values = value.split(',')
                if(!value || value == ''){
                    callback(new Error('请填写取件时段'));
                }else if(values.some((item)=>{
                        console.log(reg.test(item),item)
                        return !reg.test(item)
                    })){
                    callback(new Error('请填写正确的取件时间段如:09:00-10:00多个请用逗号隔开如09:00-10:00,13:00-14:00'));
                }else if(value.split(',').length>8){
                    callback(new Error('取件时间最多只可设置8个时间段'));
                }else{
                    callback();
                }
            };
            return {
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                list,
                searchParam: {
                },
                addParam:{
                    agentId:'',
                },
                rules: {
                    agentId: [
                        { required: true, message: '请选择代理商', trigger: 'change' }
                    ],
                    merchantId: [
                        { required: true, message: '请选择商家', trigger: 'change' }
                    ],
                    serviceDay: [
                        { required: true, message: '请选择服务日期', trigger: 'change' }
                    ],
                    serviceTime: [
                        { required: true, validator: dateValidata,  trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                },
                form:{

                },
                formLabelWidth: '100px'
            }
        },
        methods: {
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={};
            },
            indexMethod(index) {//序号
                return index + 1;
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                //console.log('搜索条件',this.searchParam);
                this.$axios.post("/express/merchantClient/findExpressTimeListByPage",addToken(this.searchParam)).then((res)=>{
                    this.searchLoading=false;
                    //console.log(res.data);
                    this.tableData=res.data.value;
                })
            },
            handleAdd(formName) {//新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addLoading=true;
                        console.log(this.addParam);
                        this.$axios.post("/express/merchantClient/createOrMergeExpressTime",addToken(this.addParam)).then((res)=>{
                            this.addLoading=false;
                            if(res.data.success){
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit();
                                this.onSearch(this.searchParam.start/20+1);
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
            handleEdit(id) {//修改
                this.addInit(true)
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                if(id){
                    this.addLoading = true;
                    this.$axios.post('/express/merchantClient/findExpressTime',addToken({id})).then((res)=>{
                        this.addLoading = false;
                        console.log(res.data)
                        this.addParam=res.data.value
                    })
                }
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
