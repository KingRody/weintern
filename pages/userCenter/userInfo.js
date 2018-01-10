// pages/userCenter/userInfo.js

const app = getApp();
const wxRequest = require('../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    
    if (app.globalData.openid) {
    	wxRequest('userInfo', {
    		method: 'GET',
		    data: {
    			openid: app.globalData.openid,
    			nickName: app.globalData.userInfo.nickName,
			    gender: app.globalData.userInfo.gender,
			    country: app.globalData.userInfo.country,
			    city: app.globalData.userInfo.city,
			    province: app.globalData.userInfo.province,
			    avatarUrl: app.globalData.userInfo.avatarUrl,
		    },
		    success: res => {
    			let data = res.data;
    			if (data.success) {
    				console.log('添加信息成功')
			    }
		    }
	    })
    }
  },
	
	/**
   * 点击进去右上角分享
	 * @returns {{title: string, path: string}}
	 */
	onShareAppMessage: function () {
    let that = this;
    if (this.data.hasUserInfo) {
	    return {
		    title: `${that.data.userInfo.nickName} 给您分享了交大实习圈的页面，快去看看吧!`,
		    path: 'pages/userCenter/userInfo'
	    }
    }
  },
	
	/**
   * 点击进入用户信息页面
	 */
	getInfo: function (e) {
	  let that = this;
    wx.navigateTo({
      url: `/pages/user/user`
    })
	},
	
	/**
	 * 点击进入用户信息页面
	 */
	getFeedBack: function () {
		wx.navigateTo({
			url: `/pages/feedback/feedback`
		})
	},
	
	/**
	 * 点击进入用户信息页面
	 */
	getAboutUs: function () {
		wx.navigateTo({
			url: `/pages/aboutUs/aboutUs`
		})
	}
	
})