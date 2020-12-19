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
          <el-button type="success" icon="el-icon-top" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
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
    };
  },
  methods: {
    async getSkuAttrValueList() {
      this.loading = true;
      const { page, limit } = this;
      const result = await this.$API.sku.getSkuAttrValueList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取SKU成功");
        this.loading = false;
        this.SkuList = result.data.records;
        window.scrollTo(0, 0)
        this.total = result.data.total;
        // console.log(result)
      } else {
        this.$message.error("获取失败");
        this.loading = false;
        window.scrollTo(0, 0)
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
