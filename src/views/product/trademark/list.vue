<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <el-table
      :data="TableDataList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logoUrl" class="logo" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="updata(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="delPageList(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${Trademark.id ? '修改' : '添加'}品牌`"
      :visible.sync="Visible"
      width="50%"
    >
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
      loading: false,
      Trademark: {
        logoUrl: "",
        tmName: "",
      },
      // id: 0,
      rules: {
        tmName: [
          { required: true, message: "请输入要添加的品牌", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请放入要添加的LOGO" }],
      },
    };
  },
  methods: {
    add() {
      this.$refs.Trademark && this.$refs.Trademark.clearValidate();
      this.Visible = true;
      // 清空(从修改 - 添加 要清空修改的数据)
      this.Trademark = {
        tmName: "",
        logoUrl: "",
      };
    },
    updata(row) {
      // 清空表单
      this.$refs.Trademark && this.$refs.Trademark.clearValidate();

      // 显示对话框
      this.Visible = true;
      // row代表当前行的数据
      //  this.Trademark = row // 地址值一样，修改Trademark会导致TableDataList发生变化
      this.Trademark = { ...row };
      // this.Trademark = JSON.parse(JSON.stringify(row));
    },
    handleSizeChange(limit) {
      this.PageList(this.page, limit);
    },

    handleCurrentChange(page) {
      this.PageList(page, this.limit);
    },

    // 获取品牌列表
    async PageList(page, limit) {
      this.loading = true;
      const resule = await this.$API.trademark.getPageList(page, limit);
      if (resule.code === 200) {
        this.$message.success("获取成功");
        this.TableDataList = resule.data.records;
        this.total = resule.data.total;
        this.page = resule.data.current;
        this.limit = resule.data.size;
        this.loading = false;
      } else {
        this.$message.error("获取失败了");
        this.loading = false;
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
        this.$message.error("上传LOGO大小不能超过 50kB!");
      }
      return isfile && isLt;
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.Trademark.logoUrl = res.data;
      }
    },

    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { Trademark } = this;
          // 强制转换布尔值
          const isUpdate = !!Trademark.id;
          // 如果是修改需要验证
          if (isUpdate) {
            const table = this.TableDataList.find(
              (table) => table.id === Trademark.id
            );

            if (
              table.tmName === Trademark.tmName &&
              table.logoUrl === Trademark.logoUrl
            ) {
              this.$message.warning("修改的数据不能和原数据一致");
              return;
            }
          }
          console.log(Trademark)
          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updatePageList(this.Trademark);
          } else {
            result = await this.$API.trademark.addPageList(this.Trademark);
          }
          // console.log(valid);
          if (result.code === 200) {
            this.$message.success(`${isUpdate ? `修改` : "添加"}添加品牌成功`);
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
    // isVisibles(id) {
    //   this.id = id;
    //   this.isVisible = true;
    // },
    // 修改品牌
    // putTrademark() {
    //   const { id } = this;
    //   const Trademark = this.Trademark;
    //   if (this.Trademark.tmName) {
    //     Trademark.id = id;
    //     this.$API.trademark.updatePageList(Trademark);
    //     //  console.log(Trademark)
    //     this.PageList(this.page, this.limit);
    //     this.isVisible = false;
    //   } else{
    //       this.$message.warning('修改的数据不能为空')
    //   }
    // },
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