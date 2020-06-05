
/**
 * @param {obj} 除secret外的参数对象
 */
function getSortString (obj) {
  return Object.keys(obj).sort().reduce(function (result, curr) {
    result += `${curr}${obj[curr]}`
    return result
  }, '')
}
const s = getSortString({
  a: 'sasa',
  aa: 'sas',
  x: 'xxx'
})
console.log(s)
