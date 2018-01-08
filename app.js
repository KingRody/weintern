//app.js

App({
	// 全局用户数据
	globalData: {
		userInfo: null
	},
	
	onLaunch: function () {
		let that = this;
		// 登录
		wx.login({
			success: function(res) {
				let code = res.code;
				if (code) {
					console.log('获取用户登录凭证：' + code);
				} else {
					console.log('获取用户登录态失败：' + res.errMsg);
				}
			}
		});
		
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo
							console.log(res.userInfo);
							
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}else {
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
												if (res.authSetting["scope.userInfo"]){////如果用户重新同意了授权登录
													wx.getUserInfo({
														success:function(res){
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
	}
})