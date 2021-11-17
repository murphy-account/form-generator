
import { BigNumber } from 'bignumber.js'
// 高精度数值的加减乘除
// 加
export function plus(num1, num2) {
    return new BigNumber(num1).plus(num2).toNumber()
}

// 减
export function minus(num1, num2) {
    return new BigNumber(num1).minus(num2).toNumber()
}

// 乘
export function multipliedBy(num1, num2) {
    return new BigNumber(num1).multipliedBy(num2).toNumber()
}

// 除
export function dividedBy(num1, num2) {
    return new BigNumber(num1).dividedBy(num2).toNumber()
}
// 取余 
export function mod(num1, num2) {
    return new BigNumber(num1).mod(num2).toNumber()
}

// 除法 返回整数
export function dividedToIntBy(num1, num2) {
    return new BigNumber(num1).idiv(num2).toNumber()
}