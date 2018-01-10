//app.js
const wxRequest = require('utils/request');

App({
	// 全局用户数据
	globalData: {
		userInfo: null,
		openid: null
	},
	
	onLaunch: function () {
		let that = this;
		
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;
							console.log(res.userInfo);
							
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				} else {
					wx.authorize({
						scope: 'scope.userInfo',
						success() {
							// 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
							wx.getUserInfo({
								success: res => {
									that.globalData.userInfo = res.userInfo;
									console.log(res.userInfo);
									
									if (this.userInfoReadyCallback) {
										this.userInfoReadyCallback(res)
									}
								},
							})
						},
						fail: res => {
							wx.showModal({
								title: '温馨提醒',
								content: '您点击了拒绝授权登录,将无法显示您的个人信息和使用部分功能, 点击确定将重新获取授权',
								success: res => {
									if (res.confirm) {
										wx.openSetting({
											success: res => {
												if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
													wx.getUserInfo({
														success: function (res) {
															that.globalData.userInfo = res.userInfo;
															console.log(res.userInfo)
														}
													})
												}
											}
										})
									}
								}
							})
						}
					})
				}
			}
		})
		
		
		// 登录
		wx.checkSession({
			/**
			 * 如果未过期，直接拿本地缓存中的openid
			 */
			success: function () {
				console.log('会话未过期');
				try {
					let openid = wx.getStorageSync('openid');
					if (openid) {
						that.globalData.openid = openid;
						console.log('缓存中拿出来的' + openid)
					}
				} catch (e) {
					console.log(e)
				}
				
			},
			
			/**
			 * 如果session过期则需要重新向服务器发请求拿到session_key和openid
			 * todo 这里没有对session_key + rawdata 组合进行加密, 可以考虑后续加上
			 */
			fail: function () {
				console.log('会话过期');
				wx.login({
					success: function (res) {
						console.log(res);
						let code = res.code;
						if (code) {
							console.log('获取用户登录凭证：' + code);
							// 发送code至后台服务器换取openId
							wxRequest('login', {
								method: 'GET',
								data: {
									code: code,
								},
								success: res => {
									let data = res.data;
									console.log('会话过期后拿到的' + data.data.openId);
									if (data.success) {
										try {
											wx.setStorageSync('openid', data.data.openId);
										} catch (e) {
											console.log(e);
										}
										that.globalData.openid = data.data.openId;
									}
								}
							})
						} else {
							console.log('获取用户登录态失败：' + res.errMsg);
						}
					}
				});
			}
		})
	}
})