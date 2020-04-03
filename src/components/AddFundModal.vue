<template>
  <a-modal v-model="visible" :title="title" onOk="handleOk">
    <template slot="footer">
      <a-button key="back" @click="handlePrev" v-if="name">上一步</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="fundFetching"
        @click="handleNext"
      >
        下一步
      </a-button>
    </template>
    <div class="form">
      <a-input
        class="input-item"
        placeholder="基金代码"
        @keyup.enter="handleNext"
        :disabled="fundFetching || !!name"
        v-model="form.id"
      />
      <span class="name">{{ name }}</span>
      <template v-if="name">
        <a-input class="input-item" placeholder="持仓成本价" />
        <a-input class="input-item" placeholder="持仓份数" />
      </template>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Modal, Tooltip, Input } from "ant-design-vue";
import FundEquityService from "../service/FundEquityService";
export interface FundForm {
  id: string;
  name?: string;
  positionLot?: string;
  positionEquity?: string;
}
@Component({
  components: {
    [Modal.name]: Modal,
    [Input.name]: Input,
    ATooltip: Tooltip
  }
})
export default class AppHeader extends Vue {
  @Prop({
    type: Object
  })
  public value!: FundForm;

  public form: FundForm = {
    id: ""
  };

  public visible = true;

  public get title() {
    return (this.value.id ? "编辑" : "新增") + "基金信息";
  }
  public fundInstance: FundEquityService | null = null;

  @Watch("value")
  public onValueChange(value: FundForm) {
    this.form = value;
  }
  public initFund() {
    this.fundInstance = new FundEquityService(this.form.id);
    this.fundInstance.getBaseData();
  }

  public get fundFetching() {
    if (!this.fundInstance) return false;
    return this.fundInstance.updating;
  }
  public destroyFund() {
    this.fundInstance = null;
  }

  public get name() {
    if (!this.fundInstance) {
      return "";
    }
    return this.fundInstance.data && this.fundInstance.data.name;
  }

  public isTop = false;

  public handlePrev() {
    this.destroyFund();
  }

  public handleNext() {
    if (this.name) {
      // 新增配置
      this.$emit("input", this.form);
    } else {
      // 获取名字
      this.initFund();
    }
  }

  public handleOk() {
    console.log("ok");
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 20px 40px 20px;
  align-items: center;
  .btn-item {
    margin-left: 10px;
    cursor: pointer;
  }
  .icon-top {
    &.is-top {
      color: rgb(43, 43, 241);
    }
  }
}
.input-item {
  margin-top: 15px;
}
</style>
