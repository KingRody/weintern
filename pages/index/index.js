//index.js
const wxRequest = require('../../utils/request');
const formatDay = require('../../utils/util');

Page({
	data: {
		focus: false,  // 聚焦后拉起软键盘
		queryData: {}, // 筛选条件
		categories: [], // 岗位类型数组
		categoriesArr: [], // 总共多少岗位种类
		categoryId: null, // 此时选定的查询岗位类别
		cat_index: null, // 此时选定的岗位类别顺序
		multiCondition: [['不限', '1-3天', '3天以上'], ['不限', '1-3月', '3月以上'], ['不限', '0-250', '250以上'], ['不限', '专科', '本科', '硕士及以上'], ['不限', '不可转正', '可转正']],
		multiIndex: [0, 0, 0, 0, 0], // 多列选择选定的筛选条件
		multiIndexLen: 0, // 多列选择筛选条件的长度
		jobs: [],
		jobsTmp:[],
		allJobs:[]
	},
	
	onLoad: function () {
		let that = this;
		wx.showToast({
			title: '正在加载中',
			icon: 'loading',
			duration: 5000
		});
		wx.showNavigationBarLoading();
		
		// 获取所有岗位类型
		wxRequest('categories', {
			method: 'GET',
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
				}
			}
		});
		
		// 获取所有岗位
		wxRequest('jobs', {
			method: 'GET',
			success: (res) => {
				let data = res.data;
				if (data.success) {
					data.data.forEach((item) => {
						item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
					});
					that.setData({
						jobs: data.data,
						jobsTmp: data.data,
						allJobs: data.data
					});
					wx.hideNavigationBarLoading();
					wx.hideToast();
				}
			}
		})
	},
	// 点击修改岗位类型搜索
	bindPickerChangeCategories: function (e) {
		wxRequest('category', {
			method: 'GET',
			data: {
				categoryId: this.data.categories[e.detail.value]._id
			},
			success: (res) => {
				let data = res.data;
				if (data.success) {
					data.data.forEach((item) => {
						item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
					});
					
					this.setData({
						jobs: data.data,
						jobsTmp: data.data
					})
				}
			}
		});
		
		this.setData({
			cat_index: e.detail.value,
			categoryId: this.data.categories[e.detail.value]._id
		})
	},
	
	// 点击修改筛选条件
	bindMultiPickerChange: function (e) {
		
		// 本地查询，todo 考虑后续改善数据结构在服务器上查询
		let jobs = this.data.jobsTmp;
		let queryData = {};
		if (this.data.categoryId) {
			queryData.categoryId = this.data.categoryId;
			jobs = jobs.filter((item) => {
				return item.category._id.toString() == queryData.categoryId.toString();
			})
		}
		
		// 过滤掉实习天数
		if (e.detail.value[0] != 0) {
			queryData.internWeek = this.data.multiCondition[0][e.detail.value[0]];
			if (e.detail.value[0] == 1) {
				jobs = jobs.filter((item) => {
					return parseInt(item.internWeek) < Number(parseInt(queryData.internWeek.split('-')[1])) && parseInt(item.internWeek) >= Number(queryData.internWeek.split('-')[0]);
				})
			} else {
				jobs = jobs.filter((item) => {
					return parseInt(item.internWeek) >= parseInt(queryData.internWeek);
				})
			}
		}
		
		// 过滤掉实习月份
		if (e.detail.value[1] != 0) {
			queryData.interMonth = this.data.multiCondition[1][e.detail.value[1]];
			if (e.detail.value[1] == 1) {
				jobs = jobs.filter((item) => {
					return parseInt(item.interMonth) < Number(parseInt(queryData.interMonth.split('-')[1])) && parseInt(item.interMonth) >= Number(queryData.interMonth.split('-')[0]);
				})
			} else {
				jobs = jobs.filter((item) => {
					return parseInt(item.interMonth) >= parseInt(queryData.interMonth);
				})
			}
		}
		
		// 过滤掉实习薪水
		if (e.detail.value[2] != 0) {
			queryData.salary = this.data.multiCondition[2][e.detail.value[2]];
			if (e.detail.value[2] == 1) {
				jobs = jobs.filter((item) => {
					return parseInt(item.salary) <= Number(queryData.salary.split('-')[1]) && parseInt(item.salary) >= Number(queryData.salary.split('-')[0]);
				})
			} else {
				jobs = jobs.filter((item) => {
					return parseInt(item.salary) > parseInt(queryData.salary);
				})
			}
		}
		
		// 过滤最低学历要求
		if (e.detail.value[3] != 0) {
			queryData.education = this.data.multiCondition[3][e.detail.value[3]];
			jobs = jobs.filter((item) => {
				return item.education == queryData.education;
			})
		}
		
		// 过滤是否可转正
		if (e.detail.value[4] != 0) {
			queryData.canBeRegular = this.data.multiCondition[4][e.detail.value[4]];
			jobs = jobs.filter((item) => {
				return item.canBeRegular == '不详' || item.canBeRegular == queryData.canBeRegular;
			})
		}
		
		let len = 0;
		e.detail.value.forEach((item) => {
			item !== 0 ? len++ : len;
		});
		
		this.setData({
			multiIndex: e.detail.value,
			multiIndexLen: len,
			queryData: queryData,
			jobs: jobs
		});
		
	},
	
	
	// 点击进入详情页面
	detail: function (e) {
		wx.navigateTo({
			url: `../detail/detail?job=${e.currentTarget.dataset['job']}`
		})
	},
	
	//  聚焦，获取软键盘
	getKeyboard: function () {
		this.setData({
			focus: true
		})
	},
	
	// 提交搜索
	formSubmit: function (e) {
		wxRequest('jobSearch', {
			method: 'GET',
			data: {
				searchType: e.detail.value.search
			},
			success: (res) => {
				let data = res.data;
				if (data.success) {
					if (data.data && data.data.length > 0) {
						data.data.forEach((item) => {
							item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
						});
						this.setData({
							jobs: data.data,
							jobsTmp: data.data
						})
					}else {
						this.setData({
							jobs:[]
						})
					}
				}
			}
		})
	},
	
	// 判断搜索框是否为空，如果为空，则代表不进行搜索，拿到所以工作数据
	isReset: function (e) {
		let that = this;
		if (e.detail.value.trim() === '') {
			this.setData({
				jobs: that.data.allJobs
			})
		}
	},
	
	// 下拉刷新
	onPullDownRefresh: function () {
		let that = this;
		wx.showNavigationBarLoading();
		wxRequest('jobs', {
			method: 'GET',
			success: (res) => {
				let data = res.data;
				if (data.success) {
					data.data.forEach((item) => {
						item.meta.updateAt = formatDay.formatDay(item.meta.updateAt);
					});
					that.setData({
						jobs: data.data,
						jobsTmp: data.data,
						allJobs: data.data
					});
					wx.hideNavigationBarLoading();
					wx.stopPullDownRefresh();
				}
			}
		});
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: `您的好友给您分享了交大实习圈的干货,快来看看吧!`,
			path: `/pages/index/index`
		}
	},
});


