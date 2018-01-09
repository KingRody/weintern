// pages/detail/detail.js
const wxRequest = require('../../utils/request');
const formatDay = require('../../utils/util');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    job: null,
    navigateTitle: '职位详情',
    isFavorite: false,
	  userInfo: null,
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
    
    wx.showToast({
      title: '正在加载中',
      icon: 'loading',
      duration: 1000
    });
	  if (app.globalData.userInfo) {
		  this.setData({
			  userInfo: app.globalData.userInfo,
			  hasUserInfo: true
		  })
	  }
    wxRequest('job', {
      method: 'GET',
      data: {
        jobId: options['job']
      },
      success: (res) =>  {
        let data = res.data;
        if (data.success) {
          console.log(data.data)
          data.data[0].meta.updateAt = formatDay.formatDay(data.data[0].meta.updateAt);
          data.data[0].jobcontent = data.data[0].jobcontent.map((item) => {
            return item.replace(/\s/g,'');
          });
	        data.data[0].skill = data.data[0].skill.map((item) => {
		        return item.replace(/\s/g,'');
	        });
	        data.data[0].deadline = formatDay.formatYear(data.data[0].deadline);
          that.setData({
            job: data.data[0]
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
  showModal: function() {
    let that = this;
    wx.showModal({
      title: '温馨提醒',
      content: `线上投递简历功能暂未开放, 请投递简历至:  "${that.data.job.email}"`,
    })
  },
  
  // 收藏该职位 todo 从服务器端拿用户数据
  favoriteSave: function (e) {
    let that = this;
    that.setData({
      isFavorite: true
    });
    wx.showModal({
      title: '温馨提醒',
      content: '收藏成功，去我的收藏页面逛逛吧',
	    cancelText: '不了',
      confirmText: '好的',
      success: res => {
        if (res.confirm) {
	        wx.switchTab({
		        url: '/pages/favorite/favorite'
	        })
        }else {
          wx.hideModal();
        }
      }
    })
  }
  //   let that = this;
  //   wxRequest('favorite', {
  //     method: 'POST',
  //     data: {
  //       favoriteId: e.currentTarget.dataset['id']
  //     },
  //     success: (res) => {
  //       let data = res.data;
  //       if (data.success) {
  //         that.setData({
  //           isFavorite: true
  //         });
  //         wx.showModal({
  //           title: '收藏成功'
  //         })
  //       }
  //     }
  //   })
  // }
})