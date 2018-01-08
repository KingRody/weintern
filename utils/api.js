// var base = 'http://47.96.128.122/api/'

// https://www.weservice.cn/api/ 是我个人的项目域名，如果你是本地预览的话，可以继续用这个 base url，如果是你自己部署到线上的话，需要你更换成自己的域名

let base = 'https://www.weservice.cn/api/';

module.exports = {
	categories: base + 'job/categories', // 查找所以岗位类型及下面岗位数据
	jobs: base + 'jobs', // 查找所有岗位
	category: base + 'job/category',  // 查找该种类下的所有岗位
	multiquery: base + 'job/multiquery', // 多条件查询
	jobSearch: base + 'job/search',  // 搜索框查询岗位，查询关键字为公司名称，岗位名称，岗位类型
	job: base + 'job', // 根据id值找岗位
	favorite: base + 'favorite/save'  // 保存收藏
};