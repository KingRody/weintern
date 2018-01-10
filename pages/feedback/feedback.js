// pages/feedback/feedback.js
const app = getApp();
const wxRequest = require('../../utils/request');

Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		haveSend: false,
	  isFocus: false,
		borderColor: '1px solid rgba(0,0,0,.3)'
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		wx.setNavigationBarTitle({
			title: '您的反馈'
		});
	},
	
	getColor: function () {
    this.setData({
      isFocus: true,
      borderColor: '1px solid #1296db'
    })
	},
	
	backColor: function () {
		this.setData({
			isFocus: true,
			borderColor: '1px solid rgba(0,0,0,.3)'
		})
	},
	
	// 发送用户反馈
	sendFeedback: function (e) {
		let that = this;
		if (e.detail.value.feedback.length > 0) {
			wxRequest('feedback', {
				method: 'GET',
				data: {
					openid: app.globalData.openid,
					feedback: e.detail.value.feedback
				},
				success: res => {
					let data = res.data;
					if (data.success) {
						that.setData({
							haveSend: true
						});
						wx.showModal({
							title:'温馨提醒',
							content: '感谢您的反馈, 我们将尽快完善!',
							success: res => {
								if (res.confirm) {
									wx.switchTab({
										url: '/pages/index/index'
									})
								}
							}
						})
					}
				}
			})
		}else {
			wx.showModal({
				title:'温馨提醒',
				content: '您的反馈不能为空哦!'
			})
		}
	}
})