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
        <a-icon type="loading" v-if="record.loading" />
        <a-icon type="reload" v-else @click="record.start()" />
        <span class="fund-name" @click="openSourcePage(record.fundViewUrl)">
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
          />, 持仓收益：<Colorful :value="positionProfit" />
        </p>
        <p class="data-statistic">
          预估余额：{{ predictBalanceSum }}, 今日预估收益:
          <Colorful :value="predictProfit" />, 预估持仓收益率：<Colorful
            :value="predictRoi"
          />, 预估持仓收益：<Colorful :value="predictPositionProfit" />
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
  public fundListConfig: FundForm[] = [];
  public columns = [
    {
      title: "基金名称",
      dataIndex: "result.name",
      key: "name",
      scopedSlots: { customRender: "name" }
    },
    {
      title: "当前净值",
      dataIndex: "result.equity",
      key: "equity"
    },
    {
      title: "涨/跌幅",
      dataIndex: "result.dayGrowthRate",
      key: "dayGrowthRate",
      scopedSlots: { customRender: "dayGrowthRate" }
    },
    {
      title: "预估净值",
      dataIndex: "result.predictEquity",
      key: "predictEquity"
    },
    {
      title: "预估跌/涨",
      dataIndex: "result.predictDiff",
      key: "predictDiff",
      scopedSlots: { customRender: "predictDiff" }
    },
    {
      title: "预估涨/跌幅",
      dataIndex: "result.predictDayGrowthRate",
      key: "predictDayGrowthRate",
      scopedSlots: { customRender: "dayGrowthRate" }
    },
    {
      title: "持仓价",
      dataIndex: "positionEquity",
      key: "positionEquity"
    },
    {
      title: "持仓成本",
      dataIndex: "result.positionMoney",
      key: "positionMoney"
    },
    {
      title: "收益",
      dataIndex: "result.positionProfit",
      key: "positionProfit",
      scopedSlots: { customRender: "positionProfit" }
    },
    {
      title: "收益率",
      dataIndex: "result.positionROI",
      key: "positionROI",
      scopedSlots: { customRender: "positionROI" }
    },
    {
      title: "余额",
      dataIndex: "result.positionBalance",
      key: "positionBalance"
    },
    {
      title: "预估收益",
      dataIndex: "result.predictPositionProfit",
      key: "predictPositionProfit",
      scopedSlots: { customRender: "positionProfit" }
    },
    {
      title: "预估收益率",
      dataIndex: "result.predictPositionROI",
      key: "predictPositionROI",
      scopedSlots: { customRender: "positionROI" }
    },
    {
      title: "预估余额",
      dataIndex: "result.predictPositionBalance",
      key: "predictPositionBalance"
    },
    {
      title: "近1月",
      dataIndex: "result.lastOneMonth",
      key: "lastOneMonth",
      scopedSlots: { customRender: "lastOneMonth" }
    }
  ];
  public fundListServices: FundEquityService[] = [];

  public get roi() {
    return ((+this.positionProfit / +this.moneySum) * 100).toFixed(2) + "%";
  }
  public get positionProfit() {
    return (+this.balanceSum - +this.moneySum).toFixed(2);
  }
  public get balanceSum() {
    return this.fundListServices
      .reduce((current, service: FundEquityService) => {
        if (!service.result || isNaN(+service.result.positionBalance)) {
          return current;
        }
        return +service.result.positionBalance + current;
      }, 0)
      .toFixed(2);
  }
  public get predictRoi() {
    return (
      (
        ((+this.predictBalanceSum - +this.moneySum) / +this.moneySum) *
        100
      ).toFixed(2) + "%"
    );
  }
  public get predictProfit() {
    return (+this.predictBalanceSum - +this.balanceSum).toFixed(2);
  }
  public get predictBalanceSum() {
    return this.fundListServices
      .reduce((current, service: FundEquityService) => {
        if (!service.result || isNaN(+service.result.predictPositionBalance)) {
          return current;
        }
        return +service.result.predictPositionBalance + current;
      }, 0)
      .toFixed(2);
  }
  public get predictPositionProfit() {
    return (+this.predictBalanceSum - +this.moneySum).toFixed(2);
  }
  public get moneySum() {
    return this.fundListServices
      .reduce((current, service: FundEquityService) => {
        if (
          !service.result ||
          !service.result.positionMoney ||
          isNaN(+service.result.positionMoney)
        ) {
          return current;
        }
        return +service.result.positionMoney + current;
      }, 0)
      .toFixed(2);
  }

  public openSourcePage(url: string) {
    const { shell } = require("electron").remote;
    shell.openExternal(url);
  }

  public initFundServices() {
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
    this.initFundServices();
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
