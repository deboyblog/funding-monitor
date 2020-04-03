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
        <template slot="name" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChange(record.key, 'name', $event)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="() => onDelete(record.key)"
          >
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <AddFundModal v-if="visible" :value="form" @input="handleCreateOrModify" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Storage from "../utils/storage";
import { Table } from "ant-design-vue";
import { CONFIG_FUND_LIST } from "@/constant/storage";
import AddFundModal, { FundForm } from "./AddFundModal.vue";
@Component({
  components: {
    [Table.name]: Table,
    AddFundModal
  }
})
export default class SettingFundConfig extends Vue {
  public fundList = [];
  public visible = false;
  public form = {};
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
    }
  ];
  public fundListConfig = [
    {
      id: "161723",
      positionEquity: 1.0523,
      positionLot: 40007.61
    },
    {
      id: "008903",
      positionEquity: 1.1166,
      positionLot: 15224.78
    },
    {
      id: "002969",
      positionEquity: 1.2459,
      positionLot: 12683.45
    },
    {
      id: "486001",
      positionEquity: 1.2179,
      positionLot: 4105.27
    },
    {
      id: "110022",
      positionEquity: 2.8674,
      positionLot: 1046.26
    },
    {
      id: "161725",
      positionEquity: 0.9152,
      positionLot: 1639.05
    }
  ];

  public toggleModal() {
    this.visible = true;
  }
  public handleCancel() {
    this.visible = false;
  }
  public handleCreateOrModify(form: FundForm) {
    // console.log(form);
    if (form.id) {
      // TODO modify
    } else {
      // TODO add
    }
  }

  public openSourcePage(url: string) {
    const { shell } = require("electron").remote;
    shell.openExternal(url);
  }

  public initData() {
    const dataStore = Storage.get(CONFIG_FUND_LIST);
    if (!dataStore) {
      this.fundList = [];
    } else {
      // console.log(dataStore);
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
