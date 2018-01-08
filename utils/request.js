let api = require('./api')

let wxRequest = function(path, params) {
	// wx.showToast({
	//   title: '加载中',
	//   icon: 'loading'
	// })
	
	let url = api[path]
	
	wx.request({
		url: url,
		method: params.method || 'GET',
		data: params.data || {},
		header: {
			'Content-Type': 'json'
		},
		success: function(res) {
			params.success && params.success(res)
			wx.hideToast()
		},
		fail: function(res) {
			params.fail && params.fail(res)
		},
		complete: function(res) {
			params.complete && params.complete(res)
		}
	})
};

module.exports = wxRequest;