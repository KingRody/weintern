// var base = 'http://47.96.128.122/api/'

// https://www.weservice.cn/api/ 是我个人的项目域名，如果你是本地预览的话，可以继续用这个 base url，如果是你自己部署到线上的话，需要你更换成自己的域名

let base = 'https://www.weservice.cn/api/';

module.exports = {
	categories: base + 'job/categories',
	jobs: base + 'job',
	category: base + 'job/category'
};