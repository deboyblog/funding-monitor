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
      <a-form
        @submit.stop="handleNext"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="基金代码">
          <a-input v-model="form.id" />
        </a-form-item>
        <template v-if="name">
          <a-form-item label="基金名称">
            <a-input disabled :value="name" placeholder="基金名称" />
          </a-form-item>
          <a-form-item label="持仓成本价">
            <a-input placeholder="如：1.0000" v-model="form.positionEquity" />
          </a-form-item>
          <a-form-item label="持仓份数">
            <a-input placeholder="如：10000" v-model="form.positionLot" />
          </a-form-item>
        </template>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import FundEquityService from "../service/FundEquityService";
export interface FundForm {
  id: string;
  name?: string;
  positionLot?: string;
  positionEquity?: string;
}
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
@Component
export default class AppHeader extends Vue {
  @Prop({
    type: Object
  })
  public value!: FundForm;

  public formItemLayout = formItemLayout;

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
    console.log(this.fundInstance);
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
    if (!this.form.id) {
      this.$message.warn("请输入基金代码");
      return false;
    }
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
}
.name {
  margin-top: 10px;
  margin-bottom: 0;
}
</style>
