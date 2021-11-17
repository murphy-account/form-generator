import common from './common.js'
import {
    getToken
} from './auth.js'
import store from '@/store'

/**
 *Created by jiachenpan on 16/11/29.
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */

export default function openWindow(url, title, w, h) {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}

/**
 *Created by fdj on 2020/1/9.
 * @param {Sting} symbol 当前标的
 * @param {Sting} theme 当前主题
 * @param {Sting} path 跳转地址
 */
export function openNewTab(symbol, path, tabname = '深度资料', target = '_blank') {
    var theme = store.state.common.theme
    if (!path) {
        const symbols = symbol.split('.')
        // var default_path = 'stock/company/introduction'
        var default_path = ''
        switch (symbols[3]) {
            case 'S0101':
                if (symbols[1] === "HKEX") {
                    // 港股
                    default_path = 'HKstock/company/introduction'
                } else {
                    default_path = 'stock/company/introduction'
                }
                break;
            case 'S0102':
                default_path = 'bond/basicinfo'
                break;
            case 'S0103':
                default_path = 'foundation/basic/introduce/information'
                break;
            case 'S0104':
                default_path = 'index/basicinfo'
                break;
            case 'S0107':
                default_path = 'futures/futuresCommodity/futuresCommodityBrief'
                break;
            case 'S0108':
                default_path = 'futures/futuresStockindex/futuresStockindexBrief'
                break;
            case 'S0109':
                default_path = 'futures/futuresTreasurybond/futuresTreasurybondBrief'
                break;
            case 'S0114':
                // 个股期权
                default_path = 'option/optionStockoption/optionStockoptionBrief'
                break;
            case 'S0115':
                // 股指期权
                default_path = 'option/optionStockindex/optionStockindexBrief'
                break;
            case 'S0116':
                // 商品期权
                default_path = 'option/optionCommodity/optionCommodityBrief'
                break;
            default:
                var default_path = 'stock/company/introduction'
                break;
        }
        // if (symbols[3] === 'S0103') {
        //     default_path = 'foundation/basic/introduce/information'
        // }
        path = default_path
    }
    var url = window.location.origin +
        (process.env.NODE_ENV === 'production' ? '/web/' : '/') +
        'multidata/deepdata/' +
        path + '?token=' + getToken() + '&theme=' + theme + '&symbol=' + symbol + '&tabname=' + tabname

    console.log('openNewTab url:', url)
    if (window.jsObj) {
        var bg = '#151519'
        if (theme === 'light') {
            bg = '#fff'
        }
        common.openWinOnClient(tabname, url, bg, target)
    } else {
        window.location.href = url
    }
}