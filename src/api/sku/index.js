import request from '@/utils/request';

const api_name = '/admin/product';

export default {
	getSkuAttrList(skuInfo) {
		return request({
			url: `${api_name}/saveSkuInfo`,
			method: 'POST',
			data: skuInfo
		});
	},

	getSkuAttrList(spuId) {
		return request({
			url: `${api_name}/findBySpuId/${spuId}`,
			method: 'GET'
		});
	},


	getSkuAttrValueList(page,limit) {
		return request({
			url:`${api_name}/list/${page}/${limit}`,
			method: 'GET'
		})
	},

	deleteSku(skuId) {
		return request({
			url:`${api_name}/deleteSku/${skuId}`,
			method: 'DELETE'
		})
	},

	getSkuById(skuId) {
		return request({
			url:`${api_name}/getSkuById/${skuId}`,
			method: 'GET'
		})
	}
	// onSale/{skuId} 上架
	// cancelSale/{skuId} 下架
};
