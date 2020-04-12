<template>
  <a-modal v-model="dialogVisible" :title="title">
    <template slot="footer">
      <a-button key="back" @click="handlePrev" v-if="name">上一步</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="fundFetching"
        @click="handleNext"
      >
        {{ !!name ? "完成" : "下一步" }}
      </a-button>
    </template>
    <div class="form">
      <a-form
        @submit.stop="handleNext"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="基金代码">
          <a-input v-model="form.id" :disabled="!!name" />
        </a-form-item>
        <template v-if="name">
          <a-form-item label="基金名称">
            <a-input disabled :value="name" placeholder="基金名称" />
          </a-form-item>
          <a-form-item label="持仓成本价">
            <a-input
              type="number"
              :step="0.0001"
              placeholder="如：1.0000"
              v-model="form.positionEquity"
            />
          </a-form-item>
          <a-form-item label="持仓份数">
            <a-input
              type="number"
              :step="0.01"
              placeholder="如：10000"
              v-model="form.positionLot"
            />
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
  positionLot?: number;
  positionEquity?: number;
}

@Component
export default class AddFundModal extends Vue {
  @Prop({
    type: Object
  })
  public value!: FundForm;

  @Prop({
    type: Boolean,
    default: () => {
      return false;
    }
  })
  public visible!: boolean;

  public form: FundForm = {
    id: ""
  };

  public dialogVisible = this.visible;

  public get title() {
    return (this.value.id ? "编辑" : "新增") + "基金信息";
  }
  public fundInstance: FundEquityService | null = null;

  public get fundFetching() {
    if (!this.fundInstance) return false;
    return this.fundInstance.loading;
  }
  public get name() {
    if (!this.fundInstance) {
      return "";
    }
    return this.fundInstance.result && this.fundInstance.result.name;
  }

  @Watch("dialogVisible")
  public onDialogVisibleChange(visible: boolean) {
    if (!visible && visible !== this.visible) {
      this.$emit("cancel");
    }
  }

  @Watch("visible")
  public onVisibleChange(visible: boolean) {
    this.dialogVisible = visible;
    if (visible && this.value.id) {
      this.onValueChange(this.value);
    } else {
      this.resetForm();
    }
  }

  @Watch("value")
  public onValueChange(value: FundForm) {
    if (value.id) {
      this.form = Object.assign({}, value);
      this.initFund();
    } else {
      this.resetForm();
    }
  }

  public resetForm() {
    this.form = {
      id: ""
    };
    this.destroyFund();
  }

  public async initFund() {
    if (!this.form.id) return;
    this.fundInstance = new FundEquityService(this.form.id);
    return await this.fundInstance.start(false);
  }

  public destroyFund() {
    this.fundInstance = null;
  }

  public handlePrev() {
    this.destroyFund();
  }

  public async handleNext() {
    if (!this.form.id) {
      this.$message.warn("请输入基金代码");
      return false;
    }
    if (this.name) {
      // 新增配置
      this.$emit("input", Object.assign({}, this.form, { name: this.name }));
    } else {
      // 获取名字
      await this.initFund();
    }
  }

  public close() {
    this.$emit("cancel");
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
