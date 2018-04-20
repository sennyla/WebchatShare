//该页面用于存放分享后的内嵌网页
var app = getApp();
var ctxPath = app.globalData.ctxPath;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        share_src: ''
    },
    /**
   * 用户点击右上角分享
   */
    onShareAppMessage(options) {
        var that = this
        var return_url = options.webViewUrl
        var path = 'pages/sharepage/sharepage?shareUrl=' + return_url
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
                    share_src: return_url
                }) 
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this;
        that.setData({
            share_src: options.shareUrl,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },


})