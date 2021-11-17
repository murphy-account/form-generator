var echarts = require('echarts')
const dark = require('@/styles/theme/echart/dark.json')
const light = require('@/styles/theme/echart/light.json')

export function getEcharts() {
    return echarts
}

export function setTheme(theme) {
    // theme = theme === null ? 'dark' : theme
    theme = window.sessionStorage.getItem('THEME') || 'dark'
    var name = 'dark1'
    var theme_json = dark
    if (theme === 'light') {
        name = 'light1'
        theme_json = light
    }
    echarts.registerTheme(name, theme_json)
    return { 'theme_name': name, 'theme_json': theme_json }
}
