//index.js
const wxRequest = require('../../utils/request');
const formatDay = require('../../utils/util');
// //获取应用实例
// const app = getApp();
//
// Page({
//   data: {
//     motto: '点击进入小程序',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
Page({
	data:{
		categories: [],
		categoriesArr: [],
		cat_index: null,
		conditionArr: ['每周实习天数', '实习日薪', '实习月数', '学历要求', '能否转正'],
		con_index: null,
		jobs:[]
	},
	
	onLoad: function () {
		let that = this;
		wx.showToast({
			title: '正在加载中',
			icon: 'loading',
			duration: 2000
		});
		
		// 获取所有岗位类型
		wxRequest('categories', {
			method: 'get',
			success: (res) => {
				let data = res.data;
				if (data.success) {
					let categoriesArr = [];
					data.data.forEach((item, index) => {
						categoriesArr.push(item.name);
					});
					that.setData({
						categories: data.data,
						categoriesArr: categoriesArr
					});
					console.log(that.data.categories)
				}
			}
		});
		
		// 获取所有岗位
		wxRequest('jobs', {
			method: 'get',
			success: (res) => {
				let data = res.data;
				if (data.success) {
					data.data.forEach((item) => {
						item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
					});
					that.setData({
						jobs: data.data
					})
				}
				console.log(that.data.jobs)
			}
		})
	},
	bindPickerChangeCategories: function(e) {
		wxRequest('category', {
			method: 'get',
			data: {
				categoryId: this.data.categories[e.detail.value]._id
			},
			success: (res) => {
				let data = res.data;
				if (data.success) {
					this.setData({
						jobs: data.data
					})
				}
			}
		});
		console.log(this.data.categories[e.detail.value]._id)
		
	  this.setData({
		  cat_index: e.detail.value
	  })
  },
  
	// 点击修改筛选条件
	bindPickerChangeConditions: function(e) {
		console.log(e.detail.value)
		this.setData({
			con_index: e.detail.value
		})
	},

	// 点击进入详情页面
  detail: function(e) {
		console.log(e);
    wx.navigateTo({
	    url: `../detail/detail?job=${e.currentTarget.dataset['job']}`
    })
  }
});


