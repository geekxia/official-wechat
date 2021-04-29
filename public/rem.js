// 作用：重置html的font-size
// 让html根字体的大小，等于屏幕px总像素的10分之1

function resetRootFZ() {
  var html = document.querySelector('html')
  var width = html.getBoundingClientRect().width  // px（当前屏幕的总宽度）
  // 设置根字体的大小等于html节点的宽度的十分之一
  html.style.fontSize = width / 10 + 'px'
}

resetRootFZ()

// 当window窗口尺寸变化时，重新设置根字体的大小
window.addEventListener('resize', function () {
  resetRootFZ()
})
