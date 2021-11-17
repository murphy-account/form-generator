import common from '@/utils/common.js'
// 使用场景：对el-table中的某字段二次处理  
// 在el-table-column 上加  :formatter="fn1"

// 1 mapMethods()方法的返回值   { fn1: FN1, fn2: FN2 }
// 2 mapMethods()方法的参数  ['fn1', 'fn2'] // 数组元素为要混入的methods的名称
// ...mapMethods([
//     'filteredList'
// ])
// 
/**
 * 
 */
var methods = {
    //  时间格式化-- 2021-05-18T00:00:00 => 2021-05-18
    formatDate(row, column, cellValue, index){ 
        if(cellValue!==undefined){
            return common.formatDate(new Date(cellValue), 'yyyy-MM-dd')
        }else{
            return common.formatDate(new Date(row), 'yyyy-MM-dd')
        }
        
    },
    // 小数点保留num位
    fomatFloatandThousandFilter(v,num){
        return common.fomatFloatandThousandFilter(v,num)
    },
    // 负数颜色变红
    minusToRed(v,property){
        const arr = property
        for(let i = 0; i < arr.length; i++){
            if(v.column.property === arr[i] && v.row[arr[i]]<0){ // 进入的为要变红的prop
                return 'color:red'
            }
        }
    },
    // 鼠标变为点击样式
    cursorPointer(v,property){
        const arr = property
        for(let i = 0; i < arr.length; i++){
            if(v.column.property === arr[i]){ 
                return 'cursor:pointer'
            }
        }
    },
    //  操作方向对照表
    tradingDirection(cellValue){
        if(cellValue==='P6101'){
            return '有成交量，但没有多、空仓的席位'
        }else if(cellValue==='P6102'){
            return '有成交量，也有多仓，但没有空仓的席位'
        }else if(cellValue==='P6103'){
            return '有成交量，也有空仓，但没有多仓的席位'
        }else if(cellValue==='P6104'){
            return '有成交量，多、空仓都有的席位'
        }else {
            return cellValue
        }
    },
    rankType(row, column, cellValue, index){
        if(cellValue==='P6201'){
            return '各合约多头持仓排名'
        }else if(cellValue==='P6202'){
            return '各合约空头持仓排名'
        }else if(cellValue==='P6203'){
            return '各合约净多头排名'
        }else if(cellValue==='P6204'){
            return '各合约多头增仓排名'
        }else if(cellValue==='P6205'){
            return '各合约多头减仓排名'
        }else if(cellValue==='P6206'){
            return '各合约净空仓排名'
        }else if(cellValue==='P6207'){
            return '各合约空头增仓排名'
        }else if(cellValue==='P6208'){
            return '各合约空头减仓排名'
        }else {
            return cellValue
        }
    }
}
export var mapMethods = function(param){
    if(!Array.isArray(param)){
        throw new Error('mapMethods方法的参数应为数组')
    }
    let obj = {}
    for (let item of param) {
        if(methods[item]===undefined)throw new Error('mapMethods()方法的参数名有误')
        obj[item] = methods[item]
    }
    // console.log('objjjjjjjj', obj);
    return obj
    }
