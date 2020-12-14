<template>
  <el-card>
    <el-form inline :model="cartList" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="cartList.category1Id"
          placeholder="请选择"
          @change="handlecartList1"
          :disabled="disabled"
        >
          <el-option
            v-for="c1 in cartList1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cartList.category2Id"
          placeholder="请选择"
          @change="handlecartList2"
          :disabled="disabled"
        >
          <el-option
            v-for="c2 in cartList2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cartList.category3Id"
          placeholder="请选择"
          @change="handlecartList3"
          :disabled="disabled"
        >
          <el-option
            v-for="c3 in cartList3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Categorys",
  data() {
    return {
      cartList: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      cartList1List: [],
      cartList2List: [],
      cartList3List: [],
    };
  },
  props:["disabled"],
  methods: {
    // 获取二级分类列表
    async handlecartList1(cartList1Id) {
      this.cartList2List = [];
      this.cartList3List = [];
      this.cartList.category2Id = "";
      this.cartList.category3Id = "";
      const result = await this.$API.attrList.category2Id(cartList1Id);
      if (result.code === 200) {
        this.cartList2List = result.data;
        this.$emit("clear")
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取三级分类列表
    async handlecartList2(cartList2Id) {
      this.cartList3List = [];
      this.cartList.category3Id = "";
      const result = await this.$API.attrList.category3Id(cartList2Id);
      if (result.code === 200) {
        this.cartList3List = result.data;
        this.$emit("clear")
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取分类对象的属性列表
    async handlecartList3(category3Id) {
      const category = {
        ...this.cartList,
        category3Id,
      };
      //   console.log(attrlist);
      this.$emit("change",category);
      
      // console.log(result);
    },
  },
  async mounted() {
    // 获取一级分类列表
    const result = await this.$API.attrList.category1Id();
    if (result.code === 200) {
      this.cartList1List = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
