// pages/favorite/favorite.js
const app = getApp();  // 获取全局用户信息
const wxRequest = require('../../utils/request');
const formatDay = require('../../utils/util');

Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: null,
		userInfo: null,
		hasUserInfo: false,
		jobs: []  // 收藏的职位
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		wx.showNavigationBarLoading();
		let that = this;
		wx.setNavigationBarTitle({
			title: '职位收藏'
		});
		if (app.globalData.openid) {
			this.setData({
				openid: app.globalData.openid
			})
		}
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		}
		
		// 获得收藏列表
		wxRequest('favoriteList', {
			method: 'GET',
			data: {
				openid: app.globalData.openid
			},
			success: res => {
				let data = res.data;
				console.log(data.data);
				if (data.success) {
					data.data.map((item) => {
						item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
					});
					that.setData({
						jobs: data.data
					})
					wx.hideNavigationBarLoading();
				}
			}
		})
		
	},
	
	// 点击进入详情页面
	detail: function (e) {
		wx.navigateTo({
			url: `../detail/detail?job=${e.currentTarget.dataset['job']}`
		})
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let that = this;
		if (this.data.hasUserInfo) {
			return {
				title: `您的好友${that.data.userInfo.nickName}给您分享了收藏的宝贝,快来看看吧!`,
				path: `/pages/favorite/favorite`
			}
		}
	},
	
	getIndex: function () {
		wx.switchTab({
		  url: '/pages/index/index'
		})
	}
})