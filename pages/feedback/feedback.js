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
		if (e.detail.value.feedback.length > 0) {
			this.setData({
				haveSend: true
			});
			console.log(e.detail.value.feedback)
			wxRequest('feedback', {
				method: 'PSOT',
				data: {
					feedback: e.detail.value.feedback
				},
				success: res => {
				
				}
			})
		}
	}
})