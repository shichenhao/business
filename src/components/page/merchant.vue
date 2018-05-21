<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-select v-if="loginType" v-model="searchParam.agentId" placeholder="代理商名称" @change="getMerchantName()">
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchParam.name" placeholder="商户名称">
                    <el-option v-for="item in list.merchantName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchParam.state" placeholder="账户状态">
                    <el-option v-for="item in list.status" :key="item.val" :label="item.name" :value="item.val"></el-option>
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
                prop="id"
                label="ID"
                width="60"
                align="center">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="所属代理商">
            </el-table-column>
            <el-table-column
                prop="address"
                label="登录账户">
                <template slot-scope="scope">
                    {{scope.row.merchantUserDTO.loginName}}
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="商家名称">
            </el-table-column>
            <el-table-column
                prop="identityImg"
                label="标识"
                min-width="120"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.identityImg" />
                </template>
            </el-table-column>
            <el-table-column
                prop="hasBinding"
                label="是否关联已有商户"
                width="140"
                align="center">
                <template slot-scope="scope">
                    {{"是否关联已有商户".filtersHasBinding(scope.row.hasBinding)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态"
                width="80"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersSatus(scope.row.state)}}
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
                @current-change="onSearch"
                layout="prev, pager, next"
                :page-size="20"
                :total="tableData.total || 0">
            </el-pagination>
        </div>

        <el-dialog title="商家" :visible.sync="dialogFormVisible" v-loading="addLoading">
            <el-form :model="addParam" :rules="rules" ref="addParam">
                <el-form-item label="登录账号" prop="loginName" :label-width="formLabelWidth">
                    <el-input v-model="addParam.loginName"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="loginPwd" :label-width="formLabelWidth">
                    <el-input type="password" v-model="addParam.loginPwd"></el-input>
                </el-form-item>
                <el-form-item label="商户名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="addParam.name"></el-input>
                </el-form-item>
                <el-form-item label="标识" :label-width="formLabelWidth">
                    <label class="adFile">
                        上传图片
                        <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                    </label>
                </el-form-item>
                <el-form-item label="佣金抽取方式" :label-width="formLabelWidth">
                    <el-select v-model="addParam.commissionType">
                        <el-option v-for="item in list.commissionType" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="佣金比例" prop="commissionRate" :label-width="formLabelWidth" v-if="addParam.commissionType=='1'">
                    <el-input v-model="addParam.commissionRate"></el-input>
                </el-form-item>
                <el-form-item label="佣金固定金额" prop="commissionAmt" :label-width="formLabelWidth" v-if="addParam.commissionType=='2'">
                    <el-input v-model="addParam.commissionAmt"></el-input>
                </el-form-item>
                <el-form-item label="关联已有账号" :label-width="formLabelWidth">
                    <el-select v-model="addParam.hasBinding">
                        <el-option v-for="item in list.hasBinding" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户名称" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-input v-model="addParam.accountName"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-input v-model="addParam.mobile"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <select class="sch_select" v-model="addParam.province" placeholder="省" @change="handleProvince('city','province')" style="width: 120px;float: left;">
                        <option v-for="item in list.province" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                    <select class="sch_select" v-model="addParam.city" placeholder="市" @change="handleProvince('district','city')" style="width: 120px;float: left;margin:0 10px 15px;">
                        <option v-for="item in list.city" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                    <select class="sch_select" v-model="addParam.district" placeholder="区" style="width: 120px;float: left;">
                        <option v-for="item in list.district" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                    <el-input v-model="addParam.address"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-select v-model="addParam.accountType">
                        <el-option v-for="item in list.accountType" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行名称" prop="bankName" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-input v-model="addParam.bankName"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="bankCard" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-input v-model="addParam.bankCard"></el-input>
                </el-form-item>
                <el-form-item label="开户人" prop="bankPerson" :label-width="formLabelWidth" v-if="!addParam.hasBinding">
                    <el-input v-model="addParam.bankPerson"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="addParam.state" placeholder="请选择">
                        <el-option v-for="item in list.status" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
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
            let telValidata = (rule, value, callback) => {
                let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if(!value || value == ''){
                    callback(new Error('请输入手机号'));
                }else if(value.length!=11 || !reg.test(value)){
                    callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
                }
            };
            let commissionRateValidata = (rule, value, callback) => {
                if(!value || value == ''){
                    callback(new Error('请填写佣金比例'));
                }else if(value>100){
                    callback(new Error('佣金比例不能大于100'));
                }else{
                    callback();
                }
            };
            let commissionAmtValidata = (rule, value, callback) => {
                let reg = /^(?:(?:(?:[1-9]\d{0,2}(?:,\d{3})*)|[1-9]\d*|0))(?:\.\d{1,2})?$/;
                if(!value || value == ''){
                    callback(new Error('请填写佣金金额'));
                }else if(!reg.test(value)){
                    callback(new Error('请填写正确的佣金金额'));
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
                list,
                searchParam: {},
                rules: {
                    loginName: [
                        { required: true, message: '请填写登录账号', trigger: 'change' }
                    ],
                    loginPwd: [
                        { required: true, message: '请填写登录密码', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请填写商户名称', trigger: 'change' }
                    ],
                    commissionRate: [
                        { required: true, validator: commissionRateValidata,  trigger: 'blur' }
                    ],
                    commissionAmt: [
                        { required: true, validator: commissionAmtValidata,  trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, validator: telValidata,  trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请填写地址', trigger: 'change' }
                    ],
                    bankName: [
                        { required: true, message: '请填写银行名称', trigger: 'change' }
                    ],
                    bankCard: [
                        { required: true, message: '请填写银行卡号', trigger: 'change' }
                    ],
                    bankPerson: [
                        { required: true, message: '请填写开户人', trigger: 'change' }
                    ],
                },
                addParam:{
                    mobile:null,
                    accountName:null,
                    commissionType:1,
                    accountType:1,
                    hasBinding:1,
                    state:1,
                },
                formLabelWidth: '120px'
            }
        },
        methods: {

            init(){
                this.$axios.post('/express/manageClient/findExpressMerchantAndUser',addToken({id:1})).then((res)=>{
                    console.log(res.data)
                })
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                //console.log('搜索条件',this.searchParam);
                this.$axios.post('/express/manageClient/findExpressMerchantList',addToken(this.searchParam)).then((res)=>{
                    this.searchLoading=false
                    //console.log(res.data.value)
                    this.tableData=res.data.value
                })
            },// 创建成功后初始化数据
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={
                    commissionType:1,
                    accountType:1,
                    hasBinding:1,
                    state:1,
                }
            },
            handleAdd(formName) {//新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addLoading=true
                        delete this.addParam.merchantUserDTO

                        if(this.addParam.commissionType==1){
                            delete this.addParam.commissionAmt
                        }else{
                            delete this.addParam.commissionRate
                        }

                        if(this.addParam.hasBinding==1){
                            delete this.addParam.accountName
                            delete this.addParam.mobile
                            delete this.addParam.address
                            delete this.addParam.bankName
                            delete this.addParam.bankCard
                            delete this.addParam.bankPerson
                            delete this.addParam.accountType
                            delete this.addParam.province
                            delete this.addParam.city
                            delete this.addParam.district
                        }


                        this.$axios.post("/express/manageClient/createOrMergeExpressMerchant",addToken(this.addParam) ).then((res)=>{
                            this.addLoading=false
                            console.log(res.data,'创建成功')
                            if(res.data.success){
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit()
                                //if(this.addParam.id){
                                    this.onSearch();
                                //}
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
            handleProvince(type, parent, first){//省市区
                //console.log(type, parent, first)
                if(first){
                    this.addParam.province=window.list.province[0].id
                }else{
                    console.log(this.addParam.province)
                }
                this.$axios.post('/express/public/findRegionDataDTOList',{parentId:this.addParam[parent]}).then((res)=>{
                    //console.log(type, res.data)
                    window.list[type]=res.data.value
                    this.addParam[type]=res.data.value[0].id
                    if(res.data.value[0].level!==3){
                        this.handleProvince('district','city')
                    }
                })
            },
            handleEdit(id) {//修改
                console.log(this.addParam.hasBinding)
                this.addInit(true)
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                if(id){
                    this.addLoading = true;
                    this.$axios.post('/express/manageClient/findExpressMerchantAndUser',addToken({id})).then((res)=>{
                        this.addLoading = false;
                        this.addParam=Object.assign(res.data.value.merchantUserDTO,res.data.value)
                        delete this.addParam.identityImg
                        delete this.addParam.commissionAmt
                        this.handleProvince('city','province')

                    })
                }else{
                    this.handleProvince('city','province',true)
                }
            },
            handleDistrict(id){
                console.log(id)
                this.addParam.district=478
                console.log(this.addParam.district)
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
                            this.addParam.multipartFile=res.data.value
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
    .sch_select{
        width: 170px;
        border-radius:4px;
        border:1px solid #dcdfe6;
        height: 38px;
        color: #606266;
        padding: 0 10px;
    }
</style>
