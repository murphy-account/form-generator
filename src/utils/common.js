// import XLSX from 'xlsx'
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k] :
                    ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}
const common = {
    fixData: function (data) {
        var o = ''
        var l = 0
        var w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
    },
    // 数据导出
    // downloadExcel: function(data, sheetName, fileName) {
    //     var wb = { SheetNames: [sheetName], Sheets: {}, Props: {}}
    //     var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
    //     wb.Sheets[sheetName] = XLSX.utils.json_to_sheet(data) // 通过json_to_sheet转成单页(Sheet)数据
    //     const obj = new Blob([common.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
    //     fileName = fileName + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType)
    //     var url = URL.createObjectURL(obj)
    //     if (this.isMsie()) {
    //         window.navigator.msSaveOrOpenBlob(obj, fileName)
    //     } else {
    //         //! IE  firefox和Chrome
    //         var tmpa = document.createElement('a')
    //         tmpa.download = fileName
    //         tmpa.href = url
    //         // 火狐兼容
    //         document.body.appendChild(tmpa)
    //         tmpa.style.display = 'none'
    //         tmpa.click() // 模拟点击实现下载
    //     }
    //     URL.revokeObjectURL(obj) // 释放object URL
    // },
    s2ab: function (s) {
        if (typeof ArrayBuffer !== 'undefined') {
            const buf = new ArrayBuffer(s.length)
            const view = new Uint8Array(buf)
            for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
            return buf
        } else {
            const buf = new Array(s.length)
            for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
            return buf
        }
    },
    // 转换时间格式
    GMTToStr: function (time) {
        if (!time || time === '') {
            return ''
        }
        const date = new Date(time)
        return date.format('yyyy-MM-dd')
    },
    isMsie: function () {
        return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false
    },
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    },
    isEmpty(obj) {
        obj = obj + ''
        if (typeof obj === 'undefined' || obj == null || obj.replace(/(^\s*)|(\s*$)/g, '') === '') {
            return true
        } else {
            return false
        }
    },
    // 格式化时间
    formatDate: function (date, format) {
        var v = ''
        if (typeof date === 'string' || typeof date !== 'object') {
            return
        }
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var weekDay = date.getDay()
        var ms = date.getMilliseconds()
        var weekDayString = ''

        if (weekDay === 1) {
            weekDayString = '星期一'
        } else if (weekDay === 2) {
            weekDayString = '星期二'
        } else if (weekDay === 3) {
            weekDayString = '星期三'
        } else if (weekDay === 4) {
            weekDayString = '星期四'
        } else if (weekDay === 5) {
            weekDayString = '星期五'
        } else if (weekDay === 6) {
            weekDayString = '星期六'
        } else if (weekDay === 7) {
            weekDayString = '星期日'
        }

        v = format
        // Year
        v = v.replace(/yyyy/g, year)
        v = v.replace(/YYYY/g, year)
        v = v.replace(/yy/g, (year + '').substring(2, 4))
        v = v.replace(/YY/g, (year + '').substring(2, 4))

        // Month
        var monthStr = ('0' + month)
        v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2))

        // Day
        var dayStr = ('0' + day)
        v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2))

        // hour
        var hourStr = ('0' + hour)
        v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2))
        v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2))

        // minute
        var minuteStr = ('0' + minute)
        v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2))

        // Millisecond
        v = v.replace(/sss/g, ms)
        v = v.replace(/SSS/g, ms)

        // second
        var secondStr = ('0' + second)
        v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2))
        v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2))

        // weekDay
        v = v.replace(/E/g, weekDayString)
        return v
    },
    /**
     * 格式化VTS时间
     * @param {*} cellValue 
     * @returns 
     */
    dateFormat(cellValue) {
        if (cellValue) {
            var sval = cellValue.toString()
            var sdate = []
            sdate[0] = sval.substring(0, 4)
            sdate[1] = sval.substring(4, 6)
            sdate[2] = sval.substring(6, 8)
            sdate[3] = sval.substring(8, 10)
            sdate[4] = sval.substring(10, 12)
            sdate[5] = sval.substring(12, 14)
            return sdate[0] + '/' + sdate[1] + '/' + sdate[2] + ' ' + sdate[3] + ':' + sdate[4] + ':' + sdate[5]
        }
    },
    getUrlKey: function (name) {
        // eslint-disable-next-line no-sparse-arrays
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
    },
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    },
    addUrlParm: function (url, key, value) {
        var returnUrl = ''
        if (url.indexOf('?') === -1) {
            returnUrl += url + '?' + key + '=' + value
        } else {
            if (url.indexOf('?' + key + '=') === -1 && url.indexOf('&' + key + '=') === -1) {
                returnUrl += url + '&' + key + '=' + value
            } else {
                var isDone = false
                var startIndex = 0
                var endIndex = url.length - 1
                var parm = '?' + key + '='
                for (var i = 0; i < url.length; i++) {
                    if (url.substr(i, parm.length) === parm) {
                        startIndex = i + parm.length
                        for (var j = startIndex; j < url.length; j++) {
                            if (url[j] === '&') {
                                endIndex = j
                                break
                            } else if (j === url.length - 1) {
                                endIndex = url.length
                            }
                        }
                        isDone = true
                        break
                    }
                }
                if (!isDone) {
                    parm = '&' + key + '='
                    for (let i = 0; i < url.length; i++) {
                        if (url.substr(i, parm.length) === parm) {
                            startIndex = i + parm.length
                            // eslint-disable-next-line no-redeclare
                            for (var j = startIndex; j < url.length; j++) {
                                if (url[j] === '&') {
                                    endIndex = j
                                    break
                                } else if (j === url.length - 1) {
                                    endIndex = url.length
                                }
                            }
                            break
                        }
                    }
                }
                var parmKeyValue = parm + url.substring(startIndex, endIndex)
                returnUrl = url.replace(parmKeyValue, parm + value)
            }
        }
        return returnUrl
    },
    getUpNodes: function (lines, ids, arr) {
        var ps = []
        ids.forEach(function (id) {
            lines.forEach(function (l) {
                if (l.to === id) {
                    ps.push(l.from)
                    arr.push(l.from)
                }
            })
        })
        // eslint-disable-next-line semi
        if (ps.length <= 0) return arr;
        return common.getUpNodes(lines, ps, arr)
    },
    setPorpsReadonly(props) {
        for (var col in props) {
            if (props[col].Columns && common.isArray(props[col].Columns)) {
                props[col].require = 'false'
                props[col].isImport = 'false'
                props[col].ReadOnly = 'true'
                props[col].Columns.forEach(e => {
                    e.readonly = 'true'
                })
            } else {
                for (var co in props[col]) {
                    props[col][co].readonly = 'true'
                }
            }
        }
        return props
    },
    // 根据表单里的 oldinstanceid 判断是否是非首次报备的单
    isFirstFormByOldInstanceId(value, instanceId) {
        var isfirst = true
        instanceId = instanceId + ''
        for (var col in value) {
            if (!common.isArray(value[col])) {
                if (value[col].oldflowinstanceid) {
                    if (value[col].oldflowinstanceid !== '' && value[col].oldflowinstanceid !== instanceId) {
                        isfirst = false
                        break
                    }
                }
            }
        }
        return isfirst
    },
    setPropNotFrist(props) {
        for (var col in props) {
            // eslint-disable-next-line no-empty
            if (props[col].Columns && common.isArray(props[col].Columns)) {

            } else {
                for (var co in props[col]) {
                    if (props[col][co].objectupdate !== 'true') {
                        props[col][co].readonly = 'true'
                    }
                }
            }
        }
        return props
    },
    valueAssign(value, props) {
        var rValue = {}
        var forms = Object.keys(props)
        forms.forEach((e) => {
            if (props[e] !== undefined && common.isArray(props[e].Columns)) {
                // 数组
                rValue[e] = []
                if (common.isArray(value[e])) {
                    value[e].forEach(row => {
                        props[e].Columns.forEach(f => {
                            if (row[f.field] === undefined) {
                                row[f.field] = ''
                            }
                        })
                        rValue[e].push(row)
                    })
                }
            } else {
                rValue[e] = value[e]
            }
        })
        return rValue
    },
    formatValues(values) {
        // 构造后端需要的数据格式
        var res = {}
        var forms = Object.keys(values)
        forms.forEach((e) => {
            console.log(e)
            if (common.isArray(values[e])) {
                res[e] = []
                values[e].forEach((el) => {
                    var cols = []
                    for (var col in el) {
                        // 多余字段去掉
                        if (col !== 'required') {
                            cols.push({
                                DataKey: col,
                                DataValue: el[col]
                            })
                        }
                    }
                    res[e].push(cols)
                })
            } else {
                res[e] = []
                for (var col in values[e]) {
                    res[e].push({
                        DataKey: col,
                        DataValue: values[e][col]
                    })
                }
            }
        })
    },
    convertFormValues(values, props, pks) {
        // 构造后端需要的数据格式 加上主键值
        var res = {}
        var forms = Object.keys(values)
        forms.forEach((e) => {
            console.log('values-' + e, values[e])
            if (common.isArray(values[e])) {
                if (props[e] !== undefined && common.isArray(props[e].Columns)) {
                    var val = []
                    values[e].forEach((el) => {
                        var row = {}
                        for (var col in el) {
                            var Pcol = props[e].Columns.find(pcol => {
                                // eslint-disable-next-line eqeqeq
                                return pcol.field == col
                            })
                            if (Pcol && Pcol !== null) {
                                row[col] = el[col]
                            }
                        }
                        // 添加主键值
                        // eslint-disable-next-line eqeqeq
                        var pk = pks.find(p => p.TableName == e)
                        if (pk) {
                            if (pk.PrimaryKeyFields && common.isArray(pk.PrimaryKeyFields) && pk.PrimaryKeyFields.length > 0) {
                                pk.PrimaryKeyFields.forEach(pm => {
                                    if (el[pm] === undefined) {
                                        delete row[pm]
                                    } else {
                                        row[pm] = el[pm]
                                    }
                                })
                            }
                            if (pk.Filed && common.isArray(pk.Filed) && pk.Filed.length > 0) {
                                pk.Filed.forEach(field => {
                                    if (el[field.Mkey] === undefined) {
                                        delete row[field.Mkey]
                                    } else {
                                        row[field.Mkey] = el[field.Mkey]
                                    }
                                })
                            }
                        }
                        val.push(row)
                    })
                    res[e] = val
                }
            } else {
                // 属性中存在此字段
                console.log('props[e]:', props[e])
                if (props[e] !== undefined) {
                    res[e] = []
                    var ps = Object.keys(props[e])
                    const val = {}
                    ps.forEach(p => {
                        val[p] = values[e][p]
                    })
                    // 添加主键值
                    var pk = pks.find(p => p.TableName === e)
                    if (pk) {
                        if (pk.PrimaryKeyFields && common.isArray(pk.PrimaryKeyFields) && pk.PrimaryKeyFields.length > 0) {
                            pk.PrimaryKeyFields.forEach(pm => {
                                if (values[e][pm] === undefined) {
                                    delete val[pm]
                                } else {
                                    val[pm] = values[e][pm]
                                }
                            })
                        }
                        if (pk.Filed && common.isArray(pk.Filed) && pk.Filed.length > 0) {
                            pk.Filed.forEach(field => {
                                if (values[e][field.Mkey] === undefined) {
                                    delete values[e][field.Mkey]
                                } else {
                                    val[field.Mkey] = values[e][field.Mkey]
                                }
                            })
                        }
                    }
                    res[e].push(val)
                }
            }
        })
        return res
    },
    convertValues(values, props) {
        // 构造后端需要的数据格式
        var res = {}
        var forms = Object.keys(values)
        forms.forEach((e) => {
            console.log(e)
            if (common.isArray(values[e])) {
                if (props[e] !== undefined && common.isArray(props[e].Columns)) {
                    var val = []
                    values[e].forEach((el) => {
                        var row = {}
                        for (var col in el) {
                            var Pcol = props[e].Columns.find(pcol => {
                                return pcol.field === col
                            })
                            if (Pcol && Pcol !== null) {
                                row[col] = el[col]
                            }
                        }
                        val.push(row)
                    })
                    res[e] = val
                }
            } else {
                // 属性中存在此字段
                if (props[e] !== undefined) {
                    res[e] = []
                    var ps = Object.keys(props[e])
                    const val = {}
                    ps.forEach(p => {
                        val[p] = values[e][p]
                    })
                    res[e].push(val)
                }
            }
        })
        return res
    },
    list2Tree: function (list, parentid, pField, id) {
        var rlist = []
        if (list.length <= 0) {
            return []
        }
        var nochild = true
        for (var i = 0; i < list.length; i++) {
            var item = {}
            if (list[i][pField] === parentid) {
                item = {}
                Object.assign(item, list[i])
                item.children = this.list2Tree(list, item[id], pField, id)
                rlist.push(item)
                nochild = false
            }
        }
        if (nochild) return ''
        return rlist
    },
    getListParents: function (list, id, pField, idField, arr) {
        var has = true
        var curPid = ''
        console.log('id:', id)
        console.log('list:', list)
        list.forEach(function (l) {
            if (l[idField] === id) {
                arr.push(id)
                has = false
                curPid = l[pField]
                return false
            }
        })
        if (has) {
            console.log(arr)
            return arr
        }
        return common.getListParents(list, curPid, pField, idField, arr)
    },
    getTreeListParents: function (list, id, pField, idField, valueField, arr) {
        var has = true
        var curPid = ''
        console.log('arr:', arr)
        list.forEach(function (l) {
            if (l[idField] === id) {
                arr.push(l[valueField])
                has = false
                curPid = l[pField]
                return false
            }
        })
        if (has) {
            console.log(arr)
            return arr
        }
        return common.getTreeListParents(list, curPid, pField, idField, valueField, arr)
    },
    getArrayLastOne: function (arr) {
        if (arr.length > 0) {
            return arr[arr.length - 1]
        }
        return ''
    },
    closePage: function () {
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
                window.opener = null
                window.close()
            } else {
                window.open('', '_top')
                window.top.close()
            }
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            window.close()
            // window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的
            window.history.go(-2)
        } else {
            window.opener = null
            // window.open('', '_self', '');
            window.close()
        }
    },
    validData(data, props) {
        var p = new Promise((resolve, reject) => {
            for (var col in props) {
                // 主表数据验证
                var prop = props[col]
                // 当前值
                var d = data[col]
                if (common.isArray(prop.Columns)) {
                    // 判断表格是否必填
                    let isBreak = false
                    if (common.isArray(d)) {
                        if (prop.require === 'true' && d.length <= 0) {
                            console.log('存在必填项为空:', `数据表[${col}]为空`)
                            reject('存在必填项为空！')
                            break
                        }
                        // 循环数据
                        for (var i = 0; i < d.length; i++) {
                            var index = i + 1 // 行数
                            try {
                                prop.Columns.forEach((pitem, j) => {
                                    if (!common.isEmpty(pitem.field)) {
                                        if (pitem.props.require === 'true') {
                                            if (common.isEmpty(d[i][pitem.field])) {
                                                // reject(`数据表[${col}]第${index}行 字段[${pitem.field}]不能为空！`)
                                                console.log('存在必填项为空:', `数据表[${col}]第${index}行 字段[${pitem.field}]不能为空！`)
                                                reject('存在必填项为空！')
                                                throw new Error('StopIteration')
                                            }
                                        }
                                        if (pitem.props.type === 'text') {
                                            if (pitem.props.require === 'true' || (pitem.props.require !== 'true' && !common.isEmpty(d[i][pitem.field]))) {
                                                if (pitem.props.dataverify === 'integer') {
                                                    var reg = /^-?[1-9]\d*$/
                                                    if (!reg.test(d[i][pitem.field])) {
                                                        reject('数值整数格式错误！')
                                                        throw new Error('StopIteration')
                                                    }
                                                } else if (pitem.props.dataverify === 'decimal') {
                                                    const reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}$/
                                                    if (!reg.test(d[i][pitem.field])) {
                                                        reject('数值格式错误！')
                                                        throw new Error('StopIteration')
                                                    }
                                                } else if (pitem.props.dataverify === 'email') {
                                                    const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
                                                    if (!reg.test(d[i][pitem.field])) {
                                                        reject('邮箱格式错误！')
                                                        throw new Error('StopIteration')
                                                    }
                                                } else if (pitem.props.dataverify === 'cardno') {
                                                    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                                    if (!reg.test(d[i][pitem.field])) {
                                                        reject('身份证号码格式错误！')
                                                        throw new Error('StopIteration')
                                                    }
                                                } else if (pitem.props.dataverify === 'mobile') {
                                                    const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
                                                    if (!reg.test(d[i][pitem.field])) {
                                                        reject('手机号码格式错误！')
                                                        throw new Error('StopIteration')
                                                    }
                                                } else if (pitem.props.dataverify === 'reg') {
                                                    if (pitem.props.regtext && pitem.props.regtext !== '') {
                                                        const reg = new RegExp(pitem.props.regtext)
                                                        console.log('reg:', reg)
                                                        if (!reg.test(d[i][pitem.field])) {
                                                            reject('数据格式与正则表达式不匹配')
                                                            throw new Error('StopIteration')
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            } catch (e) {
                                isBreak = true
                                // eslint-disable-next-line no-empty
                                if (e.message === 'StopIteration') { } else {
                                    reject(e.message)
                                }
                                break
                            }
                        }
                    } else {
                        reject(`数据表${col}格式应该为数组，请联系管理员处理！`)
                        break
                    }

                    // 跳出forin 循环
                    if (isBreak) {
                        break
                    }
                } else {
                    // 各个属性名数组
                    const dataProps = Object.keys(prop)
                    let isBreak = false
                    // eslint-disable-next-line no-redeclare
                    for (var i = 0; i < dataProps.length; i++) {
                        const p = props[col][dataProps[i]]
                        if (p !== null && p !== undefined) {
                            if (p.require === 'true' && common.isEmpty(d[dataProps[i]])) {
                                console.log('存在必填项为空:', `数据表[${col}]段[${dataProps[i]}]不能为空！`)
                                reject('存在必填项为空！')
                                isBreak = true
                                break
                            }
                            if (p.type === 'text') {
                                if (p.require === 'true' || (p.require !== 'true' && !common.isEmpty(d[dataProps[i]]))) {
                                    if (p.dataverify === 'integer') {
                                        var reg = /^-?[1-9]\d*$/
                                        if (!reg.test(d[dataProps[i]])) {
                                            reject('数值整数格式错误！')
                                            isBreak = true
                                            break
                                        }
                                    } else if (p.dataverify === 'decimal') {
                                        const reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}$/
                                        if (!reg.test(d[dataProps[i]])) {
                                            reject('数值格式错误！')
                                            isBreak = true
                                            break
                                        }
                                    } else if (p.dataverify === 'mail') {
                                        const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
                                        if (!reg.test(d[dataProps[i]])) {
                                            reject('邮箱格式错误！')
                                            isBreak = true
                                            break
                                        }
                                    } else if (p.dataverify === 'cardno') {
                                        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                        if (!reg.test(d[dataProps[i]])) {
                                            reject('身份证号码格式错误！')
                                            isBreak = true
                                            break
                                        }
                                    } else if (p.dataverify === 'mobile') {
                                        const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
                                        if (!reg.test(d[dataProps[i]])) {
                                            reject('手机号码格式错误！')
                                            isBreak = true
                                            break
                                        }
                                    } else if (p.dataverify === 'reg') {
                                        if (p.regtext && p.regtext !== '') {
                                            const reg = new RegExp(p.regtext)
                                            console.log('reg:', reg)
                                            if (!reg.test(d[dataProps[i]])) {
                                                reject('数据格式与正则表达式不匹配')
                                                isBreak = true
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (isBreak) {
                        break
                    }
                }
            }
            resolve(true)
        })
        return p
    },
    compareDate: function (startDate, endDate) {
        // eslint-disable-next-line eqeqeq
        if (startDate == null || startDate == '') {
            return true
        }
        // eslint-disable-next-line eqeqeq
        if (endDate == null || endDate == '') {
            return true
        }
        var end = new Date(endDate)
        var start = new Date(startDate)
        if (end.getTime() >= start.getTime()) {
            return true
        } else {
            return false
        }
    },
    myBrowser() { // 判断浏览器
        var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1
        if (isOpera) {
            return 'Opera'
        } // 判断是否Opera浏览器
        if (userAgent.indexOf('Firefox') > -1) {
            return 'FF'
        } // 判断是否Firefox浏览器
        if (userAgent.indexOf('Chrome') > -1) {
            return 'Chrome'
        }
        if (userAgent.indexOf('Safari') > -1) {
            return 'Safari'
        } // 判断是否Safari浏览器
        if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
            return 'IE'
        } // 判断是否IE浏览器
        if (userAgent.indexOf('Trident') > -1) {
            return 'Edge'
        } // 判断是否Edge浏览器
    },
    downLoadFile: function (url, fileName) {
        if (common.myBrowser() === 'IE' || common.myBrowser() === 'Edge') {
            var oPop = window.open(url, '', 'width=1, height=1, top=5000, left=5000')
            for (; oPop.document.readyState !== 'complete';) {
                if (oPop.document.readyState === 'complete') break
            }
            oPop.document.execCommand('SaveAs')
            oPop.close()
        } else {
            //! IE  firefox和Chrome
            var tmpa = document.createElement('a')
            tmpa.download = fileName
            tmpa.href = url
            // 火狐兼容
            document.body.appendChild(tmpa)
            tmpa.style.display = 'none'
            tmpa.click() // 模拟点击实现下载
        }
    },

    /**
     * 获取order by模型
     */
    getOrderBy(sortChangeEventData) {
        if (sortChangeEventData == null) {
            return null
        }
        var orderBy = {
            Column: sortChangeEventData.prop
        }
        orderBy.Order = sortChangeEventData.order === 'descending' ? 'desc' : 'asc'
        return orderBy
    },
    getOrderByMap(sortChangeEventData, fieldMap) {
        if (sortChangeEventData == null) {
            return null
        }
        var orderBy = {
            Column: fieldMap[sortChangeEventData.prop]
        }
        orderBy.Order = sortChangeEventData.order === 'descending' ? 'desc' : 'asc'
        return orderBy
    },
    /**
     * url追加token信息
     */
    addToken: function (url) {
        const Token = common.getUrlKey('Token')
        const PortalName = common.getUrlKey('PortalName')
        const ResourceCode = common.getUrlKey('resourceCode')
        url = common.addUrlParm(url, 'Token', Token)
        url = common.addUrlParm(url, 'PortalName', PortalName)
        if (ResourceCode) {
            url = common.addUrlParm(url, 'resourceCode', ResourceCode)
        }
        return url
    },
    getCookie: function (name) {
        var arr
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (arr === document.cookie.match(reg)) {
            return unescape(arr[2])
        } else {
            return null
        }
    },
    delCookie: function (name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null) {
            document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
        }
    },
    setCookie: function (name, value, time) {
        var strsec = this.getsec(time)
        var exp = new Date()
        exp.setTime(exp.getTime() + strsec * 1)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
    },
    getsec: function (str) {
        var str1 = str.substring(1, str.length) * 1
        var str2 = str.substring(0, 1)
        if (str2 === 's') {
            return str1 * 1000
        } else if (str2 === 'h') {
            return str1 * 60 * 60 * 1000
        } else if (str2 === 'd') {
            return str1 * 24 * 60 * 60 * 1000
        }
    },
    uuid: function () {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'

        var uuid = s.join('')
        return uuid
    },
    getFilter: function (item) {
        var str = ''
        for (var i in item) {
            str += i + ':' + item[i] + ';'
        }
        return str
    },
    trim: function (str) {
        str = str + ''
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
    },
    uniqueArry: function (arr) {
        var hash = []
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    ++i
                }
            }
            hash.push(arr[i])
        }
        return hash
    },
    getUrlPartOfToken: function () {
        return 'token=' + sessionStorage.getItem('token')
    },
    splitWithLineDateFormatter: function (date) {
        if (isNaN(date)) {
            return ''
        }
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var d = date.getDate()
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d)
    },
    splitNumberThousand: function (num) {
        if (num) {
            return (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }
        return ''
    },
    CovertRow2Span: function (jsonData, idField, fromField, toField) {
        var result = []
        var curRecord = null
        var num
        var fromFields = fromField.split(',')

        // 循环整个数组：[{...},{...},{...},...]
        for (var idx = 0; idx < jsonData.length; idx++) {
            num = common.findIdx(result, idField, jsonData[idx][idField])
            if (num !== -1) {
                curRecord = result[num]
            } else {
                curRecord = {}
            }
            // 循环每个json对象中的字段
            for (var key in jsonData[idx]) {
                // 处理转换的数据内容
                for (var i = 0; i < fromFields.length; i++) {
                    if (key === fromFields[i]) {
                        curRecord[jsonData[idx][toField] + '-' + fromFields[i]] = jsonData[idx][key]
                        break
                    }
                }
                // 除数据内容外，只处理标识字段数据
                if (key === idField) {
                    curRecord[key] = jsonData[idx][key]
                }
            }
            if (num === -1) {
                result.push(curRecord)
            }
        }
        return result
    },

    findIdx: function (jsonData, columnName, value) {
        for (var idx = 0; idx < jsonData.length; idx++) {
            if (jsonData[idx][columnName] === value) {
                return idx
            }
        }
        return -1
    },
    fomatFloatandThousandFilter: function (x, pos) {
        pos = pos || 0
        if (x === '' || x === null || x === undefined) {
            return ''
        }
        // 判断是否是负数，为负数则先取绝对值进行四舍五入，然后再还原为负数
        var is_minus = false
        if (x < 0) {
            x = Math.abs(x)
            is_minus = true
        }

        var f = parseFloat(x)
        if (isNaN(f)) {
            return ''
        }
        f = Math.round((x * Math.pow(10, pos)).toFixed(pos)) / Math.pow(10, pos) // pow 幂

        if (is_minus) {
            f = -f
        }

        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0 && pos > 0) {
            rs = s.length
            s += '.'
        }
        while (s.length <= rs + pos) {
            s += '0'
        }
        return s.replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    },
    /**
     * 取pos位小数
     * @param {*} x 
     * @param {*} pos 
     * @returns 
     */
    fomatFloatFix: function (x, pos) {
        if (x === '' || x === null || x === undefined) {
            return ''
        }
        // 判断是否是负数，为负数则先取绝对值进行四舍五入，然后再还原为负数
        var is_minus = false
        if (x < 0) {
            x = Math.abs(x)
            is_minus = true
        }

        var f = parseFloat(x)
        if (isNaN(f)) {
            return ''
        }
        f = Math.round((x * Math.pow(10, pos)).toFixed(pos)) / Math.pow(10, pos) // pow 幂

        if (is_minus) {
            f = -f
        }

        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0) {
            rs = s.length
            s += '.'
        }
        while (s.length <= rs + pos) {
            s += '0'
        }
        return s
    },
    /**
     * 添加千位符
     * @param {*} num 
     * @returns 
     */
    toThousandFilter(num) {
        if (num === '' || num === null || num === undefined) {
            return ''
        }
        return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    },

    /**
     * 大数字单位处理(num为比较值 小于num数据不进行处理)
     * @param {*} value 
     * @param {*} fixedLen 
     * @param {*} num 比较值
     * @returns 
     */
    formatNumUnit(value, fixedLen = 2, num = 10000) {
        if (value == "--") {
            return value;
        }
        var result = {};
        var k = 10000;
        var sizes = ["", "万", "亿", "万亿"];
        var i;
        if (value < num) {
            result.value = value;
            result.unit = "";
        } else {
            i = Math.floor(Math.log(value) / Math.log(k));
            result.value = common.round(value / Math.pow(k, i), fixedLen);
            result.unit = sizes[i];
        }
        return result.value + result.unit;
    },
    /**
     * 是否为价格格式
     * @param {*} num 
     * @param {*} digit 
     * @returns 
     */
    IsPrice(num, digit) {
        console.log('IsPrice', num, digit);
        var reg;
        if (digit == "2") {
            reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
        }
        if (digit == "3") {
            reg = /(^[1-9]\d*(\.\d{1,3})?$)|(^0(\.\d{1,3})?$)/;
        }
        if (digit == "4") {
            reg = /(^[1-9]\d*(\.\d{1,4})?$)|(^0(\.\d{1,4})?$)/;
        }
        return reg.test(num);
    },
    /**
     * 价格大写
     * @param {*} num 
     * @returns 
     */
    toChinesNum(num) {
        const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
        const unit = ['', '十', '百', '千', '万']
        num = parseInt(num)
        const getWan = (temp) => {
            const strArr = temp.toString().split('').reverse()
            let newNum = ''
            for (var i = 0; i < strArr.length; i++) {
                newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum
            }
            return newNum
        }
        const overWan = Math.floor(num / 10000)
        let noWan = num % 10000
        if (noWan.toString().length < 4) noWan = '0' + noWan
        return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    },
    /**
     * 是否 非负浮点数（正浮点数 + 0）
     * @param {*} str 
     * @returns 
     */
    isNonnegativeFloat(str) {
        return /^\d+(\.\d+)?$/.test(str);
    },
    // 是否整数
    isInteger: function (str) {
        return !!/^\d+$/.test(str);
    },
    URLencode(sStr) {
        if (sStr) {
            return sStr
                .replace(/\+/g, "%2B")
                .replace(/\"/g, "%22")
                .replace(/\'/g, "%27")
                .replace(/\//g, "%2F")
                .replace(/\-/g, "%2d")
                .replace(/\_/g, "%5f")
                .replace(/\#/g, "%23");
        }
        return
    },
    listSort(arr, props, orders) {
        return [...arr].sort((a, b) =>
            props.reduce((acc, prop, i) => {
                if (acc === 0) {
                    const [p1, p2] = orders && orders[i] === 'desc' ? [b[prop], a[prop]] : [a[prop], b[prop]]
                    acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0
                }
                return acc
            }, 0)
        )
    },
    downLoadFileFromClient(url, isOpen) {
        if (window.jsObj) {
            const title = url.substring(url.lastIndexOf('\\') + 1)
            window.jsObj.downUrl = url
            window.jsObj.isOpenFile = isOpen
            window.jsObj.downFileName = title
            window.jsObj.downFile()
        }
    },
    openWinOnClient(openName, openUrl, bg, target) {
        if (window.jsObj) {
            window.jsObj.openName = openName
            window.jsObj.openUrl = openUrl
            window.jsObj.target = target
            if (bg) {
                window.jsObj.backGround = bg
            }
            window.jsObj.openNewUrl()
        }
    },
    /**
     * 跳转终端页面
     * @param {*} symbol 代码
     * @param {*} bType 类型
     */
    openQuotation(symbol, bType) {
        if (window.jsObj) {
            window.jsObj.symbolParam = symbol
            window.jsObj.bType = bType
            window.jsObj.openQuotation()
        }
    },
    /**
     * 保留pos位小数并添加千位符
     * @param {*} x 
     * @param {*} pos 
     * @returns 
     */
    fomatFloatandThousandHasWord(x, pos) {
        pos = pos || 0
        if (x === '' || x === null || x === undefined) {
            return ''
        }
        if (isNaN(x)) {
            return x
        }
        // 判断是否是负数，为负数则先取绝对值进行四舍五入，然后再还原为负数
        var is_minus = false
        if (x < 0) {
            x = Math.abs(x)
            is_minus = true
        }

        var f = parseFloat(x)
        if (isNaN(f)) {
            return x
        }
        f = Math.round((x * Math.pow(10, pos)).toFixed(pos)) / Math.pow(10, pos) // pow 幂

        if (is_minus) {
            f = -f
        }

        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0 && pos > 0) {
            rs = s.length
            s += '.'
        }
        while (s.length <= rs + pos) {
            s += '0'
        }
        return s.replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    },
    /**
     * 输入秒数转换为倒计时字符串
     * @secNumber 秒数
     * @type 返回格式,默认hh:mm:ss,true则返回中文:hh小时mm分钟ss秒
     */
    toCountDownTime(secNumber, type) {
        secNumber = Number(secNumber);
        if (!Number.isInteger(Number(secNumber)) || Number(secNumber) < 1) {
            return 0
        }
        let hour = Math.floor((secNumber / 3600) % 24);
        let minute = Math.floor((secNumber / 60) % 60);
        let second = Math.floor(secNumber % 60);
        if (hour === 0) {
            if (
                minute !== 0 &&
                second === 0
            ) {
                second = 59;
                minute -= 1;
            } else if (
                minute === 0 &&
                second === 0
            ) {
                second = 0;
                // 倒计时结束
            } else {
                second -= 1;
            }
        } else {
            if (
                minute !== 0 &&
                second === 0
            ) {
                second = 59;
                minute -= 1;
            } else if (
                minute === 0 &&
                second === 0
            ) {
                hour -= 1;
                minute = 59;
                second = 59;
            } else {
                second -= 1;
            }
        }
        let cdStr = ''
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        if (type) {
            // cdStr = hour + '小时' + minute + '分' + second + '秒'
            cdStr = hour + '小时' + minute + '分'
        } else {
            cdStr = hour + ':' + minute + ':' + second
        }
        return cdStr
    },
    /**
     * 开启/关闭键盘精灵
     * @param {*} isShow 
     */
    setKBShow(isShow) {
        var logname = isShow ? '解除' : '屏蔽'
        if (window.jsObj) {
            if (!isShow) {
                // 1毫秒时延，防止多个focusable组件相互focus时失焦
                setTimeout(() => {
                    // console.log(logname, new Date())
                    window.jsObj.isShow = isShow
                    window.jsObj.isShowKeySprite()
                }, 100);
            } else {
                // console.log(logname, new Date())
                window.jsObj.isShow = isShow
                window.jsObj.isShowKeySprite()
            }
        }
    },
    /**（建议使用bignumber.js）用于小数计算无法得到正常值问题--例：解决(0.1+0.2)!=0.3 */
    /*
    函数，加法函数，用来得到精确的加法结果
    说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
    调用：Calc.Add(arg1,arg2,d)
    返回值：两数相加的结果
    */
    Add: function (arg1, arg2) {
        arg1 = arg1.toString(), arg2 = arg2.toString();
        var arg1Arr = arg1.split("."),
            arg2Arr = arg2.split("."),
            d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
            d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        var d = arguments[2];
        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    },
    /*
    函数：乘法函数，用来得到精确的乘法结果
    说明：函数返回较为精确的乘法结果。
    参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Mul(arg1,arg2)
    返回值：两数相乘的结果
    */
    Mul: function (arg1, arg2) {
        var r1 = arg1.toString(),
            r2 = arg2.toString(),
            m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    /*
    函数：除法函数，用来得到精确的除法结果
    说明：函数返回较为精确的除法结果。
    参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Div(arg1,arg2)
    返回值：arg1除于arg2的结果
    */
    Div: function (arg1, arg2) {
        var r1 = arg1.toString(),
            r2 = arg2.toString(),
            m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    getSession(key) {
        return window.sessionStorage.getItem(key)
    },
    setSession(key, value) {
        window.sessionStorage.setItem(key, value)
    },
    removeSession(key) {
        window.sessionStorage.removeItem(key);
    },
    /**四舍五入到小数点后e位，v为要处理的数 */
    round(v, e) {
        var t = 1;
        for (; e > 0; t *= 10, e--);
        for (; e < 0; t /= 10, e++);
        return Math.round(v * t) / t;
    },
    /**
     * 变为百分数并保留pos位小数,pos非空时不足pos则补0
     * @param {*} num 
     * @param {*} pos 
     * @returns 
     */
    toPercent(num, pos) {
        let temp = this.round(common.Mul(num, 100), 2);
        if (pos) {
            var s = temp.toString()
            var rs = s.indexOf('.')
            if (rs < 0 && pos > 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + pos) {
                s += '0'
            }
            temp = s
        }
        return temp + '%'
    },
    /**
     * 精确取余
     * @param arg1
     * @param arg2
     * @returns {number}
     */
    numRem(arg1, arg2) {
        var r1 = 0;
        var r2 = 0;
        var r3 = 0;
        try {
            r1 = (arg1 + "").split(".")[1].length;
        } catch (err) {
            r1 = 0;
        }
        try {
            r2 = (arg2 + "").split(".")[1].length;
        } catch (err) {
            r2 = 0;
        }
        r3 = Math.pow(10, Math.max(r1, r2));
        return (this.numMul(arg1, r3) % this.numMul(arg2, r3)) / r3;
    },
    /**
     * 成交查询-成交类型
     * @param {*} input 
     * @returns 
     */
    execTypeFilter(input) {
        var CNstring;
        switch (input) {
            case 4:
                CNstring = "撤单";
                break;
            case 15:
                CNstring = "成交";
                break;
            case 111:
                CNstring = "分红成交";
                break;
            case 112:
                CNstring = "现货配股";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },
    /**
     * 买卖类型
     * @param {*} input 
     * @returns 
     */
    sideFilter(input) {
        var CNstring;
        switch (input) {
            case 1:
            case "B":
                CNstring = "买入";
                break;
            case 2:
            case "S":
                CNstring = "卖出";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },

    /**
     * 委托查询-委托状态
     * @param {*} input 
     * @returns 
     */
    ordStatusFilter(input) {
        var CNstring;
        switch (input) {
            case 0:
                CNstring = "已报";
                break;
            case 1:
                CNstring = "部成";
                break;
            case 2:
                CNstring = "已成";
                break;
            case 3:
                CNstring = "盘后撤单";
                break;
            case 4:
                CNstring = "已撤";
                break;
            case 6:
                CNstring = "已报待撤";
                break;
            case 7:
                CNstring = "部成";
                break;
            case 8:
                CNstring = "废单";
                break;
            case 9:
                CNstring = "未报";
                break;
            case 10:
                CNstring = "正报";
                break;
            case 101:
                CNstring = "部成待撤";
                break;
            case 104:
                CNstring = "部撤";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },
    /**
     * 交易所类型
     * @param {*} input 
     * @returns 
     */
    marketFilter(input) {
        var CNstring;
        switch (input) {
            case "SSE":
            case "SH":
                CNstring = "上交所";
                break;
            case "SZSE":
            case "SZ":
                CNstring = "深交所";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },
    /**
     * 币种类型
     * @param {*} input 
     * @returns 
     */
    currencyFilter(input) {
        var CNstring;
        switch (input) {
            case 0:
                CNstring = "汇总";
                break;
            case 1:
                CNstring = "人民币";
                break;
            case 2:
                CNstring = "港元";
                break;
            case 3:
                CNstring = "美元";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },
    /**
     * 资金账户类型
     * @param {*} input 
     * @returns 
     */
    assetTypeFilter(input) {
        var CNstring;
        switch (input) {
            case 0:
                CNstring = "银行账户";
                break;
            case 1:
                CNstring = "沪深证券资金账户";
                break;
            case 2:
                CNstring = "信用账户资产";
                break;
            case 3:
                CNstring = "期权账户资产";
                break;
            case 4:
                CNstring = "金融期货账户资产";
                break;
            case 5:
                CNstring = "商品期货账户资产";
                break;
            case 6:
                CNstring = "港股通账户资产";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    },
    /**
     * 资金流水类型
     * @param {*} input 
     * @returns 
     */
    flowTypeFilter(input) {
        var CNstring;
        switch (input) {
            case 0:
            case 1:
                CNstring = "自由转账";
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                CNstring = "交易";
                break;
            case 6:
                CNstring = "分红";
                break;
            case 7:
                CNstring = "分债券兑付";
                break;
            case 8:
                CNstring = "分债券兑息";
                break;
            case 9:
                CNstring = "送股";
                break;
            case 10:
                CNstring = "分拆合并";
                break;
            default:
                CNstring = "-";
                break;
        }
        return CNstring;
    }
}
export default common