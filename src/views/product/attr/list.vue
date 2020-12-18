<template>
  <div>
    <!-- 自定义事件的方式 -->
    <!-- <Categorys @change="getAttrList" @clear="clear" :disabled="!isShow" /> -->

    <!-- 全局事件总线 -->
    <Categorys :disabled="!isShow" />

    <el-card v-show="isShow" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttr"
        :disabled="!category.category3Id"
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
            <el-popconfirm
              title="确定要删除这段内容嘛"
              @onConfirm="delattrList(row)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-popconfirm>
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrList"
        :disabled="!attr.attrName"
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
import Categorys from "../../../components/Category";
import { mapState } from "vuex";
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
      // category: {
      //   // 代表三个分类id
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
   watch: {
    // 监视这个三级id的变化，一旦变化，就发送请求更新数据
    "category.category3Id"(category3Id) {
      if(!category3Id) return
      this.getAttrList();
    },

    "category.category1Id"() {
      this.clear();
    },
    "category.category2Id"() {
      this.clear();
    },
  },
  methods: {
    // 自定义事件，当切换1级和2级分类时，让按钮禁用和展示的数据清空。
    clear() {
      (this.category.category3Id = ""), (this.attrList = []);
    },

    // 点击添加属性，把里面的值清空
    addAttr() {
      this.isShow = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      // this.attr.id = "";
    },
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
      // console.log(this.attr)
      // 变成布尔值,有id就是false，没有就是true
      const isAdd = !this.attr.id;
      const data = this.attr;
      // 判断有没有id
      if (isAdd) {
        // 没有的话就是添加，添加两个属性进去
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      const result = await this.$API.attrList.saveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success("更新属性成功");
        this.isShow = true;
        this.getAttrList();
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

    async getAttrList() {
      // this.attrList = attr;
      const result = await this.$API.attrList.getAttrList(this.category);
      if (result.code === 200) {
        // 子组件向父组件传参
        this.attrList = result.data;
      } else {
        this.$message.error("获取失败");
      }
      // console.log(this.attrList);
    },
  },
  mounted() {
    // this.$bus.$on("change", this.getAttrList);
    // this.$bus.$on("clear", this.clear);
  },
  beforeDestroy(){
    // 通常情况下，清除绑定的全局事件
    // this.$bus.$off("change",this.getAttrList)
    // this.$bus.$off("clear",this.clear)
  },
  components: {
    Categorys,
  },
};
</script>
