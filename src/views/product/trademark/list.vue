<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="Visible = true"
      >添加</el-button
    >
    <el-table :data="TableDataList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logoUrl" class="logo" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="isVisibles(scope.row.id)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="delPageList(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加品牌" :visible.sync="Visible" width="50%">
      <el-form
        :model="Trademark"
        label-width="100px"
        :rules="rules"
        ref="Trademark"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="Trademark.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="http://182.92.128.115/admin/product/fileUpload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="Trademark.logoUrl"
              :src="Trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>上传的图片只能是JPG/PNG/JEPG格式!且不超过2M</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('Trademark')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="修改品牌" :visible.sync="isVisible" width="50%">
      <el-form
        :model="Trademark"
        label-width="80px"
        :rules="rules"
        ref="Trademark"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="Trademark.tmName"></el-input>
        </el-form-item>
      </el-form>

      <el-form label-width="95px" :rules="rules">
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="http://182.92.128.115/admin/product/fileUpload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="Trademark.logoUrl"
              :src="Trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>上传的图片只能是JPG/PNG/JEPG格式!且不超过2M</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="putTrademark(TableDataList)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pager-count="5"
      :page-size.sync="limit"
      :current-page.sync="page"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
      :page-sizes="[3, 6, 9]"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      TableDataList: [],
      page: 1,
      limit: 3,
      total: 0,
      Visible: false,
      isVisible: false,
      Trademark: {
        logoUrl: "",
        tmName: "",
      },
      id: 0,
      rules: {
        tmName: [
          { required: true, message: "请输入要添加的品牌", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请放入要添加的LOGO" }],
      },
    };
  },
  methods: {
    handleSizeChange(limit) {
      this.PageList(this.page, limit);
    },

    handleCurrentChange(page) {
      this.PageList(page, this.limit);
    },

    // 获取品牌列表
    async PageList(page, limit) {
      const resule = await this.$API.trademark.getPageList(page, limit);
      if (resule.code === 200) {
        this.$message.success("获取成功");
        this.TableDataList = resule.data.records;
        this.total = resule.data.total;
        this.page = resule.data.current;
        this.limit = resule.data.size;
      } else {
        this.$message.error("获取失败了");
      }
    },

    beforeAvatarUpload(file) {
      const isType = ["image/jpg", "image/png", "image/jepg"];
      // 检测文件类型
      const isfile = isType.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isfile) {
        this.$message.error("上传LOGO只能是 JPG/PNG/JEPG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传LOGO大小不能超过 2MB!");
      }
      return isfile && isLt;
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.Trademark.logoUrl = res.data;
      }
    },

    // 添加品牌
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          console.log(valid);
          const result = await this.$API.trademark.addPageList(this.Trademark);
          if (result.code === 200) {
            this.$message.success("添加品牌成功");
            this.Visible = false;
            this.PageList(this.page, this.limit);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },

    // 删除品牌
    delPageList(id) {
      console.log(id);
      this.$API.trademark.deletePageList(id);
      this.PageList(this.page, this.limit);
    },
    isVisibles(id) {
      this.id = id;
      this.isVisible = true;
    },
    // 修改品牌
     putTrademark() {
      const { id } = this;
      // this.TableDataList.filter((table) => table.id === id);
       this.$API.trademark.updatePageList(this.Trademark);
      this.PageList(this.page, this.limit);
      this.isVisible = false;
    },
  },
  mounted() {
    this.PageList(this.page, this.limit);
  },
};
</script>
<style lang="sass">
.logo
  width: 150px
.pagination
  text-align: right
.el-pagination__sizes
  margin-left: 350px
.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  &:hover
    border-color: #409EFF
.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
.avatar
  width: 178px
  height: 178px
  display: block
</style>