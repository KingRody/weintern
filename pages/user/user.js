// pages/user/user.js
const app = getApp();
const wxRequest = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
	  haveSendUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '您的详细信息'
    });
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
	
	/**
   * 发送用户信息
	 */
	sendUserInfo: function (e) {
	  if (e.detail.value.tel.length > 0 && e.detail.value.email.length > 0) {
	    this.setData({
        haveSendUserInfo: true
      })
	    console.log(e.detail.value.tel, e.detail.value.email);
		  wxRequest('userInfo', {
			  method: 'POST',
			  data: {
				  tel: e.detail.value.tel,
				  email: e.detail.value.email
			  },
			  success: res => {
				
			  }
		  })
    }
	}
})