<template>
  <div>
    <!-- 
      change 当三级分类修改的时候触发的，得到所有分类id
      clearList 当1级分类2级分类触发的时候触发的，清空列表
      :disabled 决定select是否可以使用
     -->
     <SkuList v-if="isShow" :spuItem="spuItem" />
     <div v-else>
    <Categoty :disabled="!isShowList" />
    <SpuList v-if="isShowList" @updata="updata" @showSpuList="showSpuList"/>
    <SpuUpdateList
      v-else
      :item="item"
      @getupdata="getupdata"
    />
    </div>
  </div>
</template>

<script>
import Categoty from "../../../components/Category";
import SpuList from "./spuList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from './skuList'
export default {
  name: "Spu",
  data() {
    return {
      isShowList: true,
      item: [],
      isShow:false,
      spuItem:{}
    };
  },
  methods: {
    // 开启显示
    showSpuList(row){
      this.isShow = true;
      this.spuItem = {...row}
    },

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
    SkuList
  },
};
</script>
