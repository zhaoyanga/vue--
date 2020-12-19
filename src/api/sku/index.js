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

	// /admin/product/list/{page}/{limit}

	getSkuAttrValueList(page,limit) {
		return request({
			url:`${api_name}/list/${page}/${limit}`
		})
	}
};
