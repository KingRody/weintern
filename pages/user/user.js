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
  	let that = this;
    wx.setNavigationBarTitle({
      title: '您的详细信息'
    });
    
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // }
    
    wxRequest('getUserInfo', {
    	method: 'GET',
	    data: {
    		openid: app.globalData.openid
	    },
	    success: res => {
    		let data = res.data;
    		if (data.success) {
    			that.setData({
				    userInfo: data.data
			    })
		    }
	    }
    })
  },
	
	/**
   * 发送用户信息
	 */
	sendUserInfo: function (e) {
		let that = this;
	  if (e.detail.value.tel.length === 11) {
		  wxRequest('tel', {
			  method: 'GET',
			  data: {
			  	openid: app.globalData.openid,
				  tel: e.detail.value.tel,
				  // email: e.detail.value.email
			  },
			  success: res => {
			  	let data = res.data;
			  	if (data.success) {
					  that.setData({
						  haveSendUserInfo: true
					  });
					  wx.showModal({
						  title:'温馨提醒',
						  content: '您的信息补充完整,感谢您使用weintern,去找找机会吧!',
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
			  title: '温馨提醒',
			  content: '您的手机号不符合格式，请填写11号位的手机号'
		  })
	  }
	}
})