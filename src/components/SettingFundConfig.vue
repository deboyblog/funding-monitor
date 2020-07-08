<template>
  <div class="fund-config">
    <div class="header">
      <a-button class="create-btn" type="primary" @click="toggleModal">
        新增基金
      </a-button>
    </div>
    <div class="fund-list">
      <a-table
        bordered
        :dataSource="fundList"
        :pagination="false"
        :columns="columns"
      >
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:;" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除吗?"
            cancelText="不了"
            okText="删除"
            @confirm="() => handleDelete(record)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <AddFundModal
      :visible="visible"
      :value="form"
      @cancel="handleCancel"
      @input="handleCreateOrModify"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Storage from "../utils/storage";
import { Table } from "ant-design-vue";
import { CONFIG_FUND_LIST } from "@/constant/storage";
import AddFundModal, { FundForm } from "./AddFundModal.vue";
interface FundConfig {
  id: string;
  name: string;
  positionLots?: string | number;
  positionEquity?: string | number;
}

@Component({
  components: {
    [Table.name]: Table,
    AddFundModal
  }
})
export default class SettingFundConfig extends Vue {
  public fundList: FundConfig[] = [];
  public visible = false;
  public currentRow: FundConfig | null = null;
  public form: FundForm | {} = {};
  public columns = [
    {
      title: "基金代码",
      dataIndex: "id"
    },
    {
      title: "基金名称",
      dataIndex: "name"
    },
    {
      title: "持仓净值",
      dataIndex: "positionEquity"
    },
    {
      title: "持仓份数",
      dataIndex: "positionLot"
    },
    {
      title: "操作",
      key: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];

  public toggleModal() {
    this.visible = !this.visible;
  }
  public handleCancel() {
    this.currentRow = null;
    this.form = {};
    this.toggleModal();
  }
  public handleCreateOrModify(form: FundConfig) {
    if (this.currentRow !== null) {
      const index = this.fundList.findIndex(
        item => item.id === (this.currentRow as FundConfig).id
      );
      if (index >= 0) {
        this.$set(this.fundList, index, form);
      } else {
        this.$message.warn("未找到原记录，请点击右侧刷新数据按钮");
      }
    } else {
      const index = this.fundList.findIndex(item => item.id === form.id);
      if (index >= 0) {
        this.$message.warn("请勿添加两个同样基金代码的配置");
        return;
      }
      this.fundList.push(form);
    }
    this.updateStorage();
    this.currentRow = null;
    this.form = {};
    this.toggleModal();
  }
  public handleEdit(fundConfigItem: FundConfig) {
    this.currentRow = this.form = fundConfigItem;
    this.toggleModal();
  }
  public handleDelete(fundConfigItem: FundConfig) {
    const index = this.fundList.findIndex(
      item => item.id === fundConfigItem.id
    );
    this.fundList.splice(index, 1);
    this.updateStorage();
  }
  public openSourcePage(url: string) {
    const { shell } = require("electron").remote;
    shell.openExternal(url);
  }

  public updateStorage() {
    Storage.set(CONFIG_FUND_LIST, this.fundList);
  }

  public initData() {
    const dataStore = Storage.get(CONFIG_FUND_LIST);
    if (!dataStore) {
      this.fundList = [];
    } else {
      this.fundList = dataStore;
    }
  }

  public mounted() {
    this.initData();
  }
}
</script>

<style scoped lang="less">
.fund-config {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 20px;
}
.header {
  text-align: right;
  .create-btn {
    width: 100px;
  }
}
.fund-list {
  margin-top: 15px;
}
</style>
