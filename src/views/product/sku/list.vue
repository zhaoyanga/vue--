<template>
  <div>
    <el-card>
      <el-table border v-loading="loading" :data="SkuList">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片" width="150px">
          <template v-slot="{ row }">
            <img
              style="width: 100%; height: 100px"
              :src="row.skuDefaultImg"
              alt="图片"
          /></template>
        </el-table-column>
        <el-table-column label="重量(千克)" prop="weight"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-button
              type="success"
              icon="el-icon-top"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="SkuInformation(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delSku(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange(limit)"
        @current-change="handleCurrentChange(page)"
        :pager-count="5"
        :page-size.sync="limit"
        :current-page.sync="page"
        layout="prev, pager, next, jumper,sizes,total"
        :total="total"
        :page-sizes="[10, 20, 30]"
      >
      </el-pagination>
    </el-card>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <div style="margin: 0 100px">
        <p><span style="margin-right: 15px">名称</span>{{ Sku.skuName }}</p>
        <p><span style="margin-right: 15px">描述</span>{{ Sku.skuDesc }}</p>
        <p><span style="margin-right: 15px">价格</span>{{ Sku.price }}</p>
        <div>
          <span style="margin-right: 15px">平台属性</span>
          <el-tag
            type="success"
            v-for="sku in Sku.skuAttrValueList"
            :key="sku.id"
            style="margin-right: 5px"
            >{{ sku.attrId }}-{{ sku.valueId }}</el-tag
          >
        </div>
        <div>
          <span style="margin-right: 15px">销售属性</span>
          <el-tag
            type="success"
            v-for="sale in Sku.skuSaleAttrValueList"
            :key="sale.id"
            style="margin-right: 5px"
            >{{ sale.id }}-{{ sale.saleAttrValueId }}</el-tag
          >
        </div>
        <div>
          <div>商品图片</div>
          <div style="width:400px">
            <el-carousel height="400px">
            <el-carousel-item v-for="img in Sku.skuImageList" :key="img.id">
              <img
                style="height: 400px"
                :src="img.imgUrl"
                alt="图片"
              />
            </el-carousel-item>
          </el-carousel>
          </div>
          
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      SkuList: [],
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      drawer: false,
      Sku: [],
    };
  },
  methods: {
    // 商品展示信息
    async SkuInformation(row) {
      const result = await this.$API.sku.getSkuById(row.id);
      this.drawer = true;
      this.Sku = result.data;
      console.log(this.Sku);
    },
    // 删除单个Sku
    async delSku(row) {
      const result = await this.$API.sku.deleteSku(row.id);
      if (result.code === 200) {
        this.$message.success(`删除${row.skuName}成功`);
        this.getSkuAttrValueList();
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取Sku数据
    async getSkuAttrValueList() {
      this.loading = true;
      const { page, limit } = this;
      const result = await this.$API.sku.getSkuAttrValueList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取SKU成功");
        this.loading = false;
        console.log(result);
        this.SkuList = result.data.records;
        window.scrollTo(0, 0);
        this.total = result.data.total;
        // console.log(result)
      } else {
        this.$message.error("获取失败");
        this.loading = false;
        window.scrollTo(0, 0);
      }
    },

    // 更新当前页码
    handleSizeChange(limit) {
      this.getSkuAttrValueList(this.page, limit);
    },

    // 更新当前显示条数
    handleCurrentChange(page) {
      this.getSkuAttrValueList(page, this.limit);
    },
  },
  mounted() {
    this.getSkuAttrValueList();
  },
};
</script>
