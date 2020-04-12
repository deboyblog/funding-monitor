<template>
  <div class="config-fund-source">
    <a-radio-group class="group" @change="onChange" :value="value">
      <a-radio
        v-for="(source, index) in sourceOptions"
        :key="index"
        :style="radioStyle"
        :value="source.value"
        >{{ source.name }}</a-radio
      >
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Radio } from "ant-design-vue";
import { CrawlerEnum } from "@/crawler";

@Component({
  components: {
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group
  }
})
export default class ConfigFundSource extends Vue {
  @Prop({
    type: String,
    default: () => {
      return CrawlerEnum.Flush;
    }
  })
  public value!: CrawlerEnum;

  public radioStyle: { [key: string]: string } = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };
  public sourceOptions = [
    {
      name: "同花顺",
      value: CrawlerEnum.Flush
    },
    {
      name: "天天基金网",
      value: CrawlerEnum.EastMoney
    }
  ];
  public onChange(value: any) {
    this.$emit("input", value.target.value);
  }
}
</script>

<style scoped lang="less">
.config-fund-source {
  text-align: left;
  padding-left: 40px;
}
.group {
  text-align: left;
}
</style>
