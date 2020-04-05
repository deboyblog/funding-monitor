<template>
  <div class="fund-list">
    <a-table
      size="small"
      :columns="columns"
      :dataSource="fundListServices"
      bordered
      :pagination="false"
    >
      <template slot="name" slot-scope="text, record">
        <a-icon type="loading" v-if="record.updating" />
        <a-icon type="reload" v-else @click="record.start()" />
        <span class="fund-name" @click="openSourcePage(record.dataSource)">
          {{ text }}
        </span>
      </template>
      <span slot="dayGrowthRate" slot-scope="text"
        ><Colorful :value="text"
      /></span>
      <span slot="positionROI" slot-scope="text"
        ><Colorful :value="text"
      /></span>
      <span slot="positionProfit" slot-scope="text"
        ><Colorful :value="text"
      /></span>
      <span slot="lastOneMonth" slot-scope="text"
        ><Colorful :value="text"
      /></span>
      <template slot="footer">
        <p class="data-statistic">
          本金：{{ moneySum }}, 余额：{{ balanceSum }}, 持仓收益率：<Colorful
            :value="roi"
          />
        </p>
        <p class="data-statistic">
          预估余额：{{ expectBalanceSum }}, 今日预估收益:
          <Colorful :value="expectProfit" />, 预估持仓收益率：<Colorful
            :value="expectRoi"
          />
        </p>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Colorful from "./Colorful.vue";
import FundEquityService from "@/service/FundEquityService";
import { Table } from "ant-design-vue";
import { CONFIG_FUND_LIST } from "@/constant/storage";
import Storage from "@/utils/storage";
import { FundForm } from "@/components/AddFundModal.vue";
@Component({
  components: {
    Colorful,
    ATable: Table
  }
})
export default class FundList extends Vue {
  public fundListConfig: FundForm = [];
  public columns = [
    {
      title: "基金名称",
      dataIndex: "data.name",
      key: "name",
      scopedSlots: { customRender: "name" }
    },
    {
      title: "当前净值",
      dataIndex: "data.equity",
      key: "equity"
    },
    {
      title: "涨/跌幅",
      dataIndex: "data.dayGrowthRate",
      key: "dayGrowthRate",
      scopedSlots: { customRender: "dayGrowthRate" }
    },
    {
      title: "预估净值",
      dataIndex: "data.expectEquity",
      key: "expectEquity"
    },
    {
      title: "预估跌/涨",
      dataIndex: "data.expectDiff",
      key: "expectDiff",
      scopedSlots: { customRender: "expectDiff" }
    },
    {
      title: "预估涨/跌幅",
      dataIndex: "data.expectDayGrowthRate",
      key: "expectDayGrowthRate",
      scopedSlots: { customRender: "dayGrowthRate" }
    },
    {
      title: "持仓价",
      dataIndex: "positionEquity",
      key: "positionEquity"
    },
    {
      title: "持仓成本",
      dataIndex: "data.positionMoney",
      key: "positionMoney"
    },
    {
      title: "收益",
      dataIndex: "data.positionProfit",
      key: "positionProfit",
      scopedSlots: { customRender: "positionProfit" }
    },
    {
      title: "收益率",
      dataIndex: "data.positionROI",
      key: "positionROI",
      scopedSlots: { customRender: "positionROI" }
    },
    {
      title: "余额",
      dataIndex: "data.positionBalance",
      key: "positionBalance"
    },
    {
      title: "预估收益",
      dataIndex: "data.expectPositionProfit",
      key: "expectPositionProfit",
      scopedSlots: { customRender: "positionProfit" }
    },
    {
      title: "预估收益率",
      dataIndex: "data.expectPositionROI",
      key: "expectPositionROI",
      scopedSlots: { customRender: "positionROI" }
    },
    {
      title: "预估余额",
      dataIndex: "data.expectPositionBalance",
      key: "expectPositionBalance"
    },
    {
      title: "近1月",
      dataIndex: "data.lastOneMonth",
      key: "lastOneMonth",
      scopedSlots: { customRender: "lastOneMonth" }
    }
  ];
  public fundListServices: FundEquityService[] = [];

  public get roi() {
    return (
      (((+this.balanceSum - +this.moneySum) / +this.moneySum) * 100).toFixed(
        2
      ) + "%"
    );
  }
  public get balanceSum() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fundListServices
      .reduce((current, service: any) => {
        if (!service.data || isNaN(+service.data.positionBalance)) {
          return current;
        }
        return +service.data.positionBalance + current;
      }, 0)
      .toFixed(2);
  }
  public get expectRoi() {
    return (
      (
        ((+this.expectBalanceSum - +this.moneySum) / +this.moneySum) *
        100
      ).toFixed(2) + "%"
    );
  }
  public get expectProfit() {
    return (+this.expectBalanceSum - +this.balanceSum).toFixed(2);
  }
  public get expectBalanceSum() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fundListServices
      .reduce((current, service: any) => {
        if (!service.data || isNaN(+service.data.expectPositionBalance)) {
          return current;
        }
        return +service.data.expectPositionBalance + current;
      }, 0)
      .toFixed(2);
  }
  public get moneySum() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fundListServices
      .reduce((current, service: any) => {
        if (
          !service.data ||
          !service.data.positionMoney ||
          isNaN(+service.data.positionMoney)
        ) {
          return current;
        }
        return +service.data.positionMoney + current;
      }, 0)
      .toFixed(2);
  }

  public openSourcePage(url: string) {
    const { shell } = require("electron").remote;
    shell.openExternal(url);
  }

  public initPriceServices() {
    for (const fund of this.fundListConfig) {
      this.fundListServices.push(
        new FundEquityService(fund.id, fund.positionEquity, fund.positionLot)
      );
    }
    this.startServices();
  }
  public async startServices() {
    for (const priceService of this.fundListServices) {
      priceService.start();
    }
  }
  public initFundList() {
    const fundList = Storage.get(CONFIG_FUND_LIST);
    if (fundList && fundList.length) {
      this.fundListConfig = fundList;
    } else {
      this.fundListConfig = [];
    }
  }
  public mounted() {
    this.initFundList();
    this.initPriceServices();
  }
}
</script>

<style scoped lang="less">
.fund-list {
  background: transparent;
}
.fund-name {
  cursor: pointer;
  &:hover {
    color: #3765ff;
  }
}
.data-statistic {
  padding: 0;
  margin: 10px;
}
</style>
