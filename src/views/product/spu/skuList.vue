<template>
  <el-card>
    <el-form :model="sku" label-width="100px" :rules="rules" ref="form">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          controls-position="right"
          :min="0"
          :max="100000000"
          v-model="sku.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          controls-position="right"
          :min="0"
          :max="100000000"
          v-model="sku.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div v-for="(attr, index) in attrList" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-form-item style="display: inline-block">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div v-for="(sale, index) in spuSaleAttrList" :key="sale.id">
          <span>{{ sale.saleAttrName }}</span>
          <el-form-item style="display: inline-block">
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          :data="imageList"
          border
          style="width: 100%; margin-top: 20px 0"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                style="width: 100%; height: 150px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                v-if="!row.isDefault"
                type="primary"
                @click="setDefault(row.id)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('getupdata')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
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
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        weight: [{ required: true, message: "请输入重量", trigger: "change" }],
        skuDesc: [
          { required: true, message: "请输入商品描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueList },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueList },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    // 移除传入值的表单的校验结果
    clearValidate(prop) {
      this.$refs.form.clearValidate(prop);
    },
    // 表单校验
    save() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // console.log("校验成功");
          const { category3Id, id: spuId, tmId } = this.spu;
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });

          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );

          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;

          const sku = {
            ...this.sku,
            category3Id,
            tmId,
            spuId,
            skuDefaultImg,
            skuAttrValueList,
            skuSaleAttrValueList,
          };
          const result = await this.$API.sku.getSkuAttrList(sku);
          if (result.code === 200) {
            this.$message.success("保存成功");
            this.$emit("getupdata");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 校验图片
    skuImageListValidator(rule, value, callback) {
      const {
        imageList,
        sku: { skuImageList },
      } = this;
      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片~"));
        return;
      }

      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请选择一张默认图片~"));
      }
      callback();
    },

    // 校验平台属性
    skuAttrValueList(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      if (attrList.length !== skuAttrValueList.length) {
        callback("请选择对应的平台属性");
        return;
      }
      // if(skuAttrValueList.every((attr)=>attr)){
      //   callback("请选择全部的平台属性");
      //   return;
      // }
      callback();
    },

    // 校验销售属性
    skuSaleAttrValueList(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (spuSaleAttrList.length !== skuSaleAttrValueList.length) {
        callback("请选择对应的销售属性");
        return;
      }
      callback();
    },
    // 收集图片数据
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },

    // 图片设为默认
    setDefault(id) {
      this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img) => {
        return {
          ...img, // 展开所有的img
          isDefault: img.id === id ? true : false, // 点击的下标和遍历出来的下标相等，就返回true，其他返回fasle
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((img) => {
        return {
          ...img, // 展开所有的img
          isDefault: img.id === id ? true : false, // 点击的下标和遍历出来的下标相等，就返回true，其他返回fasle
        };
      });
    },

    // 获取图片
    async imageSpu() {
      const result = await this.$API.supList.imageSpu(this.spu.id);

      if (result.code === 200) {
        // this.imageList = result.data;
        this.$message.success("获取图片资源成功");
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            isCheck: true,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取SPU的销售属性列表
    async getSpuAttrList() {
      const result = await this.$API.supList.getSpuAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        this.$message.success("获取SPU销售属性列表成功");
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取品牌对应数据
    async getAttrList() {
      const result = await this.$API.attrList.getAttrList(this.category);
      if (result.code === 200) {
        this.attrList = result.data;
        this.$message.success("获取分类对象的属性列表");
      } else {
        this.$message.error(result.message);
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
