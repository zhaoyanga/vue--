<template>
  <div>
    <Categorys @change="getAttrList" :disabled="!isShow" />

    <el-card v-show="isShow" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="isShow = false"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性名称" width="150" prop="attrName">
        </el-table-column>

        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="val in row.attrValueList"
              :key="val.id"
              style="margin-right: 5px"
              >{{ val.valueName }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delattrList(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改属性 -->
    <el-card v-show="!isShow" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="addAttrList"
        >添加属性</el-button
      >

      <el-table :data="attr.attrValueList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <!-- 事件修饰符: native 
                  .native
                  专门给组件绑定事件使用的
                  会给组件中的第一个标签绑定相应的原生DOM事件
            -->
            <el-input
              v-model="row.valueName"
              type="text"
              v-if="row.edit"
              size="mini"
              autofocus
              ref="input"
              @blur="blurs(row, $index)"
              @keyup.enter.native="blurs(row, $index)"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据，通过this.$set添加的数据才是响应式 -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作~~~">
          <template v-slot="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delattr(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" style="margin-top: 10px" @click="AttrInfo"
        >保存</el-button
      >
      <el-button @click="isShow = true">取消</el-button>
    </el-card>

  </div>
</template>

<script>
import Categorys from "./categorys";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      isShow: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    // 删除属性
    async delattrList(row) {
      const result = await this.$API.attrList.deleteAttr(row.id);
      if (result.code === 200) {
        // console.log(result)
        this.getAttrList(this.category);
      }
      // console.log(row)
    },
    // 失去焦点值不能为空
    blurs(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    // 保存功能
    async AttrInfo() {
      const result = await this.$API.attrList.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("更新属性成功");
        this.isShow = true;
        this.getAttrList(this.category);
      } else {
        this.$message.error("更新数据失败");
      }
    },

    // 添加属性
    addAttrList() {
      this.attr.attrValueList.push({
        edit: true,
      });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    // 删除属性值
    delattr(index) {
      this.attr.attrValueList.splice(index, 1);
      // console.log(index);
    },

    // 点文字弹出输入框
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    // 点击修改按钮弹出修改框
    update(attr) {
      this.isShow = false;
      // 为了方式attr变化时直接修改原数据
      this.attr = JSON.parse(JSON.stringify(attr));
    },

    async getAttrList(category) {
      // this.attrList = attr;
      this.category = category;
      const result = await this.$API.attrList.getAttrList(category);
      if (result.code === 200) {
        // 子组件向父组件传参
        this.attrList = result.data;
      } else {
        this.$message.error("获取失败");
      }
      // console.log(this.attrList);
    },
  },
  components: {
    Categorys,
  },
};
</script>
