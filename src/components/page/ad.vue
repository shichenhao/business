<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="searchParam.agentId" placeholder="代理商名称">
                    <!--<el-option label="全部" value="0"></el-option>-->
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
            </el-form-item>
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
                prop="agentName"
                label="所属代理商">
            </el-table-column>
            <el-table-column
                prop="imgUrl"
                label="图片"
                min-width="120"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.imgUrl" alt="">
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
                min-width="60"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row.id)" size="small">编辑</el-button>
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

        <el-dialog title="广告" :visible.sync="dialogFormVisible">
            <el-form :model="addParam" :rules="rules" ref="addParam" v-loading="addLoading">
                <el-form-item label="跳转地址" prop="gotoUrl" :label-width="formLabelWidth">
                    <label class="adFile">
                        上传图片
                        <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                    </label>
                </el-form-item>
                <el-form-item label="跳转地址" prop="gotoUrl" :label-width="formLabelWidth">
                    <el-input v-model="addParam.gotoUrl"></el-input>
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
            return {
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                fileList:[],
                list,
                searchParam: {
                },
                addParam:{},
                rules: {
                    merchantId: [
                        { required: true, message: '请选择商家', trigger: 'change' }
                    ],
                    serviceDay: [
                        { required: true, message: '请选择服务日期', trigger: 'change' }
                    ],
                    serviceTime: [
                        { required: true, message: '请填写取件时段', trigger: 'change' }
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
                this.$axios.post("/express/manageClient/findExpressBannerListByPage",addToken(this.searchParam)).then((res)=>{
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
                        this.$axios.post("/express/manageClient/createOrMergeExpressBanner",addToken(this.addParam)).then((res)=>{
                            this.addLoading=false;
                            if(res.data.success){
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit();
                                this.onSearch();
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
                this.addInit(true);
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                if(id){
                    this.addLoading = true;
                    this.$axios.post('/express/manageClient/findExpressBanner',addToken({id})).then((res)=>{
                        this.addLoading = false;
                        console.log(res.data)
                        this.addParam=res.data.value
                    })
                }
            },
            update(e){
                this.addLoading = true;
                this.file=e.target.files[0];
                let formData = new FormData();
                formData.append('file', this.file)
                this.multipart.post('/express/public/upLoadFile', formData)
                    .then(res => {
                        this.addLoading = false;
                        if(res.data.success){
                            this.$message.success('上传成功');
                            this.addParam.imgUrl=res.data.value
                        }
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
