// pages/favorite/favorite.js
const app = getApp();  // 获取全局用户信息

Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: null,
		hasUserInfo: false,
		jobs: [
			{
				_id: "5a524a794390cc1f83f5b4c2",
				companyUrl: "",
				company: "A.T.Kearney科尔尼",
				companyAddr: "上海",
				jobname: "汽车方向PTA",
				category: {"_id": "5a507aa46da0b9112e076fe3", "name": "咨询"},
				worksite: {"_id": "5a507a706da0b9112e076fe0", "addr": "上海"},
				desc: "",
				internWeek: "0",
				interMonth: "0",
				canBeRegular: "否",
				salary: "100-200",
				welfare: "1、20元一小时，加班可报餐费车费； 2、Report的顾问也是auto背景，他在入职前有过长期PTA经验，所以非常会教人带人； 3、表现优秀可以帮忙写推荐信直进校招面试。",
				education: "本科",
				note: "1、简历发送至marcom.china@atkearney.com 2、注明姓名－学校－专业－可开始时间",
				deadline: "2018-04-08T00:00:00.000Z",
				email: "marcom.china@atkearney.com",
				__v: 0,
				meta: {"updateAt": "01-07", "createAt": "2018-01-07T16:27:37.834Z"},
				pv: 1,
				skill: ["1、汽车相关专业，例如车辆工程等", "\r\n2、Remote or Shanghai onsite，一周能保证至少3天的工作时间，元旦后可开始，持续两个月以上", "\r\n3、有过咨询公司PTA经验的同学优先", "\r\n4、认真负责，能够高效高质的完成顾问交待的工作"],
				jobcontent: ["面议"],
				image: "1515342457816.jpeg"
			}
		]
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
		  title: '职位收藏'
		});
		
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		}
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
	}
})