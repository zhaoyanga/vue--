import request from '@/utils/request';

const api_name = '/admin/product';

export default {
	/* 
    获取Spu分页列表
    */
	getSupList({ category3Id, page, limit }) {
		return request({
			url: `${api_name}/${page}/${limit}`,
			method: 'GET',
			params: {
				category3Id
			}
		});
	},

	/*
  删除Spu
  */
	deleteSpu(spuId) {
		return request({
			url: `${api_name}/deleteSpu/${spuId}`,
			method: 'DELETE',
		});
	},

	/* 
	添加SPU
	*/
	saveSpu(spuInfo) {
		return request({
			url: `${api_name}/saveSpuInfo`,
			method: 'POST',
			data: spuInfo
		});
	},

	/* 
  更新Sup
  */
	updateSpu(spuInfo) {
		return request({
			url: `${api_name}/updateSpuInfo`,
			method: 'POST',
			data: spuInfo
		});
	},

	/* 
		获取所有品牌数据
	*/
	getTrademarkList() {
		return request({
			url: `${api_name}/baseTrademark/getTrademarkList`,
			method: 'GET'
		});
	},

	/* 
	获取Sup图片
*/
	imageSpu(spuId) {
		return request({
			url: `${api_name}/spuImageList/${spuId}`,
			method: 'GET'
		});
	},

	/* 
		获取SPU的销售属性列表
	*/
	getSpuAttrList(spuId) {
		return request({
			url: `${api_name}/spuSaleAttrList/${spuId}`,
			method: 'GET'
		});
	},

	/* 
    获取所有销售属性列表
  */
	getSaleAttrList() {
		return request({
			url: `${api_name}/baseSaleAttrList`,
			method: 'GET'
		});
	}
};
