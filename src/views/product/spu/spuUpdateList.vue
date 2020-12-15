<template>
  <el-card style="margin-top: 20px">
    <el-form :model="spu" ref="spuForm" label-width="100px" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :value="tm.id"
            :label="tm.tmName"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="SPU描述"
        prop="description"
        v-model="spu.description"
      >
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="imagesUrl">
        <el-upload
          accept="image/*"
          action="http://182.92.128.115/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="formatImageList"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="image" alt="img" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" prop="sa">
        <el-select
          :placeholder="`还有${filterList.length}个未选择`"
          v-model="spu.sa"
        >
          <el-option
            v-for="sa in filterList"
            :value="`${sa.id}-${sa.name}`"
            :label="sa.name"
            :key="sa.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.sa"
          @click="addSpuArrt"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="150px">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <el-tag
                closable
                v-for="(attrVal, i) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                style="margin-right: 5px"
                @close="delSaleValue(row, i)"
              >
                {{ attrVal.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.edit"
                v-model="SaleattrValue"
                autofocus
                style="width: 100px"
                ref="input"
                size="mini"
                @blur="blurs(row)"
                @keyup.enter.native="blurs(row)"
              ></el-input>
              <el-button
                v-else
                class="el-icon-plus"
                size="small"
                @click="edit(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template v-slot="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delSaleList($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-button type="primary" style="margin-top: 10px" @click="preservation"
      >保存</el-button
    >
    <el-button @click="$emit('getupdata', spu.category3Id)">取消</el-button>
  </el-card>
</template>

<script>
export default {
  name: "SupUpdateList",
  props: {
    item: Object,
    isDown: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
      spu: this.item,
      trademarkList: [],
      imageUrl: [],
      SaleAttrList: [],
      spuSaleAttrList: [],
      image: "",
      SaleattrValue: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [
          { required: true, message: "请选择品牌名称",},
        ],
        description: [{ required: true, message: "请输入SPU名称" }],
        imagesUrl: [{ validator: this.imagesUrl, required: true }],
        sa: [{ validator: this.spuSaleAttr, required: true }],
      },
    };
  },
  computed: {
    // 格式化图片数据
    formatImageList() {
      return this.imageUrl.map((img) => {
        return {
          // 一上来请求回来的数据只有id
          // 新添加的数据不能设置id（由后台设置），所以写的是uid
          // 总之，id一定由后台服务器生成
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },

    // 计算当前还有多少值能选择
    filterList() {
      return this.SaleAttrList.filter((sale) => {
        // 找到了返回{} 没有找到返回undefined
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
      // return this.spuSaleAttrList.filter((sale)=>{
      //   return !this.SaleAttrList.find((spu)=>spu.id === sale.baseSaleAttrId)
      // })
    },
  },

  methods: {
    // 校验图片规则
    imagesUrl(rule, value, callback) {
      if (this.imageUrl.length > 0) {
        callback();
        return;
      }
      callback("请上传最少一张图片");
    },
    // 校验销售属性规则
    spuSaleAttr(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback("请选择至少一个销售属性");
        return;
      }
      const result = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (result) {
        callback("请添加至少一个属性值");
        return;
      }
      callback();
    },

    // 删除整行
    delSaleList(index) {
      // console.log(row,index)
      this.spuSaleAttrList.splice(index, 1);
    },

    // 删除属性值
    delSaleValue(row, index) {
      // console.log(row, id);
      row.spuSaleAttrValueList.splice(index, 1);
    },

    // 添加销售属性值列表
    blurs(row) {
      // console.log(row);
      if (this.SaleattrValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          spuId: row.spuId,
          id: Date.now(),
          saleAttrValueName: this.SaleattrValue,
        });
        this.SaleattrValue = "";
      }
      row.edit = false;
    },

    // 输入框聚焦
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    // 添加输入框
    addSpuArrt() {
      // // 选择的销售属性id
      // const { saleArrtId, id } = this.spu;
      // // 去所有销售属性列表找到某个销售属性
      // const sale = this.SaleAttrList.find((sale) => sale.id === saleArrtId);
      // // 将销售属性添加到商品中
      // this.spuSaleAttrList.push({
      //   baseSaleAttrId: sale.id, // 所有销售属性id
      //   saleAttrName: sale.name, // 所有销售属性名称
      //   spuId: id, // SPU id
      //   spuSaleAttrList: [], // 销售属性值列表
      // });
      // // 清空选中的销售属性id
      // this.spu.saleArrtId = "";

      const { sa, id } = this.spu;
      // 切割，赋值
      const [baseSaleAttrId, saleAttrName] = sa.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, // 所有销售属性id
        saleAttrName, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], // 销售属性值列表
      });
      // 清空选中的销售属性id
      this.spu.sa = "";
    },

    // 添加图片
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.imageUrl.push({
        uid: file.uid,
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
        spuId: this.spu.id, // SPU id
      });
    },

    // 更新数据
    preservation() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          // console.log('校验通过')
          // 收集数据
          const spu = {
            ...this.spu,
            spuImageList: this.imageUrl,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          const result = await this.$API.supList.updateSpu(spu);
          console.log(result);
          if (result.code === 200) {
            this.$emit("getupdata", this.spu.category3Id);
            this.$message.success("修改完成");
          } else {
            this.$message.error("修改出错");
          }
        }
      });
    },

    // 放大图
    handlePreview(file) {
      this.dialogVisible = true;
      this.image = file.url;
    },

    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageUrl = this.imageUrl.filter((img) => {
        return img.imgUrl !== file.url;
      });
    },

    // 获取所有品牌数据
    async TrademarkList() {
      const result = await this.$API.supList.getTrademarkList();
      // console.log(result);
      this.trademarkList = result.data;
    },

    // 获取图片
    async imageSpu() {
      const result = await this.$API.supList.imageSpu(this.spu.id);
      // console.log(result.data);
      // 处理数据
      // console.log(result.data)
      this.imageUrl = result.data;
    },

    // 所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.supList.getSaleAttrList();
      this.SaleAttrList = result.data;
      // console.log(result);
    },

    // 获取SPU的销售属性列表
    async getSpuAttrList() {
      const result = await this.$API.supList.getSpuAttrList(this.spu.id);
      console.log(result.data)
      this.spuSaleAttrList = result.data;
    },
  },

  mounted() {
    this.TrademarkList();
    this.imageSpu();
    this.getSaleAttrList();
    this.getSpuAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
