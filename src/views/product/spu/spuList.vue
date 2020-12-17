<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('updata', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >
      <el-table :data="supList" v-loading="loading" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="SPU名称" prop="spuName"> </el-table-column>

        <el-table-column label="SPU描述" prop="description"></el-table-column>

        <el-table-column label="操作" v-slot="{ row }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="$emit('showSpuList', { ...row, ...category })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('updata', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteSpu(row)"
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
        :page-sizes="[3, 6, 9]"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuList",
  data() {
    return {
      page: 1,
      limit: 3,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      supList: [],
      total: 0,
      loading: false,
    };
  },
  methods: {
    // 删除
    deleteSpu(row) {
      // console.log(row);
      const { id } = row;
      // console.log(row)
      this.$API.supList.deleteSpu(id);
      // console.log(result);
      this.getSpuList(this.page, this.limit);
    },

    // 获取spu分类列表
    async getSpuList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.supList.getSupList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取SPU数据成功");
        // console.log(result.data)
        this.total = result.data.total;
        this.supList = result.data.records;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },

    // 更新当前页码
    handleSizeChange(limit) {
      this.getSpuList(this.page, limit);
    },

    // 更新当前显示条数
    handleCurrentChange(page) {
      this.getSpuList(page, this.limit);
    },

    // 处理category的change(当选中三级分类时触发)
    handleCategoryChange(category) {
      // 触发事件，会将分类id传递过来
      this.category = category;
      this.getSpuList(this.page, this.limit);
    },

    // 当选择1级分类和2级分类id情空
    clear() {
      this.supList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clear", this.clear);
  },
  beforeDestroy() {
    // 通常情况下，清除绑定的全局事件
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clear", this.clear);
  },
};
</script>

<style lang="less" scoped>
</style>
