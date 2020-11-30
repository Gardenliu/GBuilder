module.exports = {
  // isArray(o) {
  //   return Object.prototype.toString.call(o) === '[object Array]';
  // },
  isArray(o) {
    // console.log(o,'==============',typeof o === 'object' ,typeof o)
    return typeof o === 'object';
  },
  isString(o) {
    return typeof(o)=='string'
  }
}
