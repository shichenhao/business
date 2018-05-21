String.prototype.filtersDay=function(state){
    let text=''
    switch (state){
        case 0:
            text='今天'
            break
        case 1:
            text='明天'
            break
        case 2:
            text='后天'
            break
        case 3:
            text='第三天'
            break
        case 4:
            text='第四天'
            break
        case 5:
            text='第五天'
            break
        case 6:
            text='第六天'
            break
        case 7:
            text='第七天'
            break
        default:
            text = ''
            break
    }
    return text
}
String.prototype.filtersSatus=function(state){
    let text=''
    switch (state){
        case 0:
            text='停用'
            break
        case 1:
            text='启用'
            break
        default:
            text = ''
            break
    }
    return text
}
String.prototype.filtersHasBinding=function(state){
    let text=''
    switch (state){
        case 0:
            text='否'
            break
        case 1:
            text='是'
            break
        default:
            text = ''
            break
    }
    return text
}
String.prototype.filtersOrders=function(state){
    let text=''
    switch (state){
        case -1:
            text='已取消'
            break
        case 0:
            text='创建订单'
            break
        case 1:
            text='待付款'
            break
        case 2:
            text='待确认'
            break
        case 3:
            text='待取件'
            break
        case 4:
            text='已完成'
            break
        default:
            text = ''
            break
    }
    return text
}
String.prototype.filtersHasBinding=function(state){
    let text=''
    switch (state){
        case 0:
            text='否'
            break
        case 1:
            text='是'
            break
        default:
            text = ''
            break
    }
    return text
}


window.list={
    merchantName:[],//商户名称
    agentName:[],//代理商名称
    agentNameAdd:[
        {
            name:'admin',
            id:1
        }
    ],//管理员代理商名称
    province:[],//省
    city:[],//市
    district:[],//区
    data:[{
        name:'今日',
        val:0
    }, {
        name:'明天',
        val:1
    }, {
        name:'第二天',
        val:2
    }, {
        name:'第三天',
        val:3
    }, {
        name:'第四天',
        val:4
    }, {
        name:'第五天',
        val:5
    }, {
        name:'第六天',
        val:6
    }, {
        name:'第七天',
        val:7
    }],
    status:[{
        name:'启用',
        val:1
    }, {
        name:'停用',
        val:0
    }],
    orderStatus:[{
        name:'已取消',
        val:-1
    }, {
        name:'创建订单',
        val:0
    }, {
        name:'待付款',
        val:1
    }, {
        name:'待确认',
        val:2
    }, {
        name:'待取件',
        val:3
    }, {
        name:'已完成',
        val:4
    }],
    hasBinding :[{
        name:'是',
        val:1
    }, {
        name:'否',
        val:0
    }],
    bankName :[{
        name:'中国银行',
        val:'中国银行'
    }, {
        name:'中国工商银行',
        val:'中国工商银行'
    }, {
        name:'中国农业银行',
        val:'中国农业银行'
    }, {
        name:'中国建设银行',
        val:'中国建设银行'
    }, {
        name:'中国邮政储蓄银行',
        val:'中国邮政储蓄银行'
    }],
    accountType :[{
        name:'公账',
        val:1
    }, {
        name:'私账',
        val:0
    }],
    commissionType :[{
        name:'按比例',
        val:1
    }, {
        name:'固定金额',
        val:2
    }],
    timeRange: [{
        value: '0',
        label: '9:00-10:00'
    }, {
        value: '1',
        label: '10:00-12:00'
    }, {
        value: '2',
        label: '11:00-12:00'
    }, {
        value: '3',
        label: '12:00-12:00'
    }, {
        value: '4',
        label: '13:00-12:00'
    }],
}
