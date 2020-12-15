<template>
  <div>
    <!-- 
      change 当三级分类修改的时候触发的，得到所有分类id
      clearList 当1级分类2级分类触发的时候触发的，清空列表
      :disabled 决定select是否可以使用
     -->
    <Categoty :disabled="!isShowList" />
    <SpuList v-if="isShowList" @updata="updata" :isShowList="isShowList" />
    <SpuUpdateList
      v-else
      :item="item"
      @getupdata="getupdata"
    />
  </div>
</template>

<script>
import Categoty from "../../../components/Category";
import SpuList from "./spuList";
import SpuUpdateList from "./spuUpdateList";
export default {
  name: "Spu",
  data() {
    return {
      isShowList: true,
      item: [],
      isDown: false,
    };
  },
  methods: {
    // 修改显示
    updata(spu) {
      this.isShowList = false;
      this.item = {...spu}
    },
    getupdata(category3Id) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  components: {
    Categoty,
    SpuList,
    SpuUpdateList,
  },
};
</script>
