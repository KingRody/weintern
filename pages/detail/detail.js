// pages/detail/detail.js
const wxRequest = require('../../utils/request');
const formatDay = require('../../utils/util');
const app = getApp();


Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: null,
		job: null,
		navigateTitle: '职位详情',
		isFavorite: false,
		hasUserInfo: false,
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		wx.setNavigationBarTitle({
			title: that.data.navigateTitle
		});
		if (app.globalData.openid) {
			this.setData({
				openid: app.globalData.openid
			})
		}
		if (app.globalData.userInfo) {
			this.setData({
				hasUserInfo: true
			})
		}
		// 获取某岗位id下的岗位
		wxRequest('job', {
			method: 'GET',
			data: {
				jobId: options['job']
			},
			success: (res) => {
				let data = res.data;
				if (data.success) {
					console.log(data.data);
					data.data[0].meta.updateAt = formatDay.formatDay(data.data[0].meta.updateAt);
					data.data[0].jobcontent = data.data[0].jobcontent.map((item) => {
						return item.replace(/\s/g, '');
					});
					data.data[0].skill = data.data[0].skill.map((item) => {
						return item.replace(/\s/g, '');
					});
					data.data[0].deadline = formatDay.formatYear(data.data[0].deadline);
					that.setData({
						job: data.data[0]
					})
				}
			}
		})
		
		// 获取用户的收藏情况
		wxRequest('isFavorite', {
			method: 'GET',
			data: {
				openid: that.data.openid,
				favoriteId: options['job']
			},
			success: res => {
				let data = res.data;
				if (data.success) {
					that.setData({
						isFavorite: true
					})
				}
			}
		})
	},
	
	
	/**
	 * 用户点击右上角分享 || 点击分享按钮分享
	 */
	onShareAppMessage: function () {
		let that = this;
		if (this.data.hasUserInfo) {
			return {
				title: `您的好友${that.data.userInfo.nickName}给您分享了交大实习圈的实习岗位啦,快来看看吧!`,
				path: `/pages/detail/detail?job=${that.data.job._id}`
			}
		}
	},
	
	// 邮箱投递模态框
	showModal: function () {
		let that = this;
		wx.showModal({
			title: '温馨提醒',
			content: `线上投递简历功能暂未开放, 请投递简历至:  "${that.data.job.email}"`,
		})
	},
	
	// 收藏该职位 todo 从服务器端拿用户数据
	favoriteSave: function (e) {
		let that = this;
		wxRequest('favorite', {
			method: 'GET',
			data: {
				favoriteId: e.currentTarget.dataset['id'],
				openid: that.data.openid
			},
			success: (res) => {
				let data = res.data;
				if (data.success) {
					console.log(data.data);
					if (data.data.message == '删除成功') {
						that.setData({
							isFavorite: false
						})
					}
					if (data.data.message == '收藏成功') {
						that.setData({
							isFavorite: true
						})
					}
					console.log(that.data.isFavorite);
					wx.showModal({
						title: '温馨提醒',
						content: `${data.data.message}，去我的收藏页面逛逛吧`,
						cancelText: '不了',
						confirmText: '好的',
						success: res => {
							if (res.confirm) {
								wx.reLaunch({
									url: '/pages/favorite/favorite'
								})
							}
						}
					})
				}
			}
		})
	},
})