# WebchatShare
需求是这样子的：小程序启动授权等操作成功后直接跳转到内嵌网页，内嵌的网址也就是公司的官网产品项目，而后，产品项目里面的各个网页都能支持分享操作，当然，对方打开的一定是你分享的那个页面而不是整个小程序初始页面。

解决思路：官方提供的转发接口 onShareAppMessage 中自定义路径即可转发指定的页面。使用 web-view 存放内嵌网页，路径以参数的形式传递，但初始化加载页面的时候再填充路径。

<web-view src="web_src"></web-view>
一开始是想着既然内嵌网页的路径可以动态添加，那我转发时再重新跳转回内嵌网页，附上我转发的这个地址就好了，但是，但是，打开转发了的页面时，竟然提示找不到路径，可谓愁死人了。控制台打印检查发现，onShareAppMessage(options) 中 options 携带了一个参数 webViewUrl，即当前转发的文件的路径，在转发成功之后，通过

this.setData({
    web_src: options.webViewUrl
})
赋值后，打开的转发页面依旧提示找不到页面。经仔细研究 onShareAppMessage 接口中各个值的含义和功能后，得出以下结论


onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
path：转发路径，  注：当前页面 path ，必须是以 / 开头的完整路径
个人对这个 path 的理解是这样子的，微信小程序接口里面的path，是不是 指代微信小程序里跳转到其他页面的路径，如果一个内嵌路径无法实现转载操作页面和分享页面，那我就分开好了，再加一个内嵌路径来专门存放转发的结果。果不其然，这样子一处理，还真能实现了需求，话不多说，上代码：

步骤一：准备工作，在 app.js里 定义一个全局变量，用于存放 内嵌网页的地址，如，

globalData: {
    userInfo: null,
    ctxPath: 'https://xxxxxx',
}
步骤二：在初始化页面，即首页存放一个按钮，定义跳转到内嵌网页的事件，如，

<button class="welcom-button" bindtap="toHome">开启</button> 

对应的事件为：

toHome:function(){
        let that = this;
        wx.redirectTo({
            url: '../pcweb/pcweb'
        })
    },
步骤三：使用 web-view 加载内嵌网页，（注：pcweb.wxml 中）

<web-view src="{{web_src}}"></web-view>
对应的事件为：

//生命周期函数--监听页面加载
onLoad: function (options) {  //初始化页面的时候加载补充内嵌网页的路径
    let that = this;
    that.setData({
        web_src: ctxPath  
    })
  },
备注：因为内嵌网页网址之前存放成全局变量在app.js里，故我们要先引入全局变量

var app = getApp();
var ctxPath = app.globalData.ctxPath;  //内嵌网页的路径
分享操作实现：
onShareAppMessage: function (options) {
      let that = this
      let return_url = options.webViewUrl        //分享的当前页面的路径
      var path = 'pages/sharepage/sharepage?shareUrl=' + return_url   //小程序存放分享页面的内嵌网页路径
      console.log(path, options)
      return {
          title: '内嵌网页分享',
          path: path,
          success: function (res) {
              // 转发成功
              wx.showToast({
                  title: "转发成功",
                  icon: 'success',
                  duration: 2000
              })
          },
          fail: function (res) {
              // 转发失败
          }
      }
  },

步骤四：定义存放分享页面的内嵌网页路径，即 sharepage.wxml,附上如下代码：


<web-view src="{{share_src}}"></web-view>    //share_src：分享后的路径
定义事件：


onLoad: function (options) {
        console.log(options)
        let that = this;
        that.setData({
            share_src: options.shareUrl,
        })
},
打开分享的页面时获取之前分享操作时传递的参数，即路径，并在打开分享的初始化函数中填充路径值options.shareUrl ，

同样，倘若想要在打开分享的页面中进行分享操作的话，然后需要补充分享事件，只是这次跳转的路径指向本身，

并且分享成功时将分享时的路径再次赋值给share_src，

onShareAppMessage(options) {
        var that = this
        var return_url = options.webViewUrl
        var path = 'pages/sharepage/sharepage?shareUrl=' + return_url   //分享成功后跳转回本页面
        console.log(path, options)
        return {
            title: '内嵌网页分享',
            path: path,
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: "转发成功",
                    icon: 'success',
                    duration: 2000
                })
                that.setData({              
                    share_src: return_url    //再次赋值分享内嵌网页的路径
                }) 
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
至此，小程序内嵌网页的分享就完成了。
