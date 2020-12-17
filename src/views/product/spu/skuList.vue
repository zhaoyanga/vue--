<template>
  <el-card>
    <el-form :model="sku" label-width="100px" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="spu.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="SKU规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          style="display: inline-block; margin-right: 20px"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select v-model="spu.attrId">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          style="display: inline-block; margin-right: 20px"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select v-model="spu.id">
            <el-option
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          :data="imageList"
          border
          style="width: 100%; margin-top: 20px 0"
        >
          <el-table-column type="selection" width="80" prop="isCheck">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template>
              <el-button type="primary">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      rules: {},
      spuSaleAttrList: [],
      imageList: [],
      attrList: [],
      sku: {},
    };
  },
  methods: {
    // 获取图片
    async imageSpu() {
      const result = await this.$API.supList.imageSpu(this.spu.id);
      this.imageList = result.data;
    },

    // 获取SPU的销售属性列表
    async getSpuAttrList() {
      const result = await this.$API.supList.getSpuAttrList(this.spu.id);
      this.spuSaleAttrList = result.data;
    },

    // 获取品牌对应数据
    async getAttrList() {
      const result = await this.$API.attrList.getAttrList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
      if (result.code === 200) {
        this.attrList = result.data;
        this.$message.success("获取分类对象的属性列表");
      } else {
        this.$message.error("获取失败");
      }
    },
  },
  mounted() {
    this.imageSpu(), this.getSpuAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
