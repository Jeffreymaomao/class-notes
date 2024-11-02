/*----------------------------------------------------------------------------
https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Math

print all properties: 

Object.getOwnPropertyNames(Math).forEach((eq)=>{
	console.log(eq)
})
  ----------------------------------------------------------------------------*/
var abs = Math.abs
var acos = Math.acos
var acosh = Math.acosh
var asin = Math.asin
var asinh = Math.asinh
var atan = Math.atan
var atanh = Math.atanh
var atan2 = Math.atan2
var ceil = Math.ceil
var cbrt = Math.cbrt
var expm1 = Math.expm1
var clz32 = Math.clz32
var cos = Math.cos
var cosh = Math.cosh
var exp = Math.exp
var floor = Math.floor
var fround = Math.fround
var hypot = Math.hypot
var imul = Math.imul
var log = Math.log
var log1p = Math.log1p
var log2 = Math.log2
var log10 = Math.log10
var max = Math.max
var min = Math.min
var pow = Math.pow
var random = Math.random
var round = Math.round
var sign = Math.sign
var sin = Math.sin
var sinh = Math.sinh
var sqrt = Math.sqrt
var tan = Math.tan
var tanh = Math.tanh
var trunc = Math.trunc
var E = Math.E
var LN10 = Math.LN10
var LN2 = Math.LN2
var LOG10E = Math.LOG10E
var LOG2E = Math.LOG2E
var PI = Math.PI
var SQRT1_2 = Math.SQRT1_2
var SQRT2 = Math.SQRT2
/* ============================================ */
function round(x,n){
	if(n==undefined){n=0;}
	return Math.round(x * 10**n)/10**n
}