/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-vars */
import { get } from "../utils/request";

const getFundPriceUrl = (fundId: string) => {
  return `http://fund.eastmoney.com/${fundId}.html`;
};
type FiledOfEquityResponse =
  | "expectPositionProfit"
  | "expectPositionROI"
  | "expectPositionBalance"
  | "expectEquity"
  | "expectDiff"
  | "expectDayGrowthRate"
  | "name"
  | "equity"
  | "dayGrowthRate"
  | "positionProfit"
  | "positionROI"
  | "positionBalance"
  | "positionMoney"
  | "lastOneMonth"
  | "lastThreeMonth"
  | "lastSixMonth"
  | "lastYear"
  | "lastThreeYear"
  | "sinceEstablishment";
type EquityType<T> = { [field in FiledOfEquityResponse]?: T };
export interface EquityResponse {
  name: string;
  equity: string | number;
  expectEquity: string | number;
  expectDiff: string | number;
  expectDayGrowthRate: string | number;
  dayGrowthRate: string;
  positionProfit: string | number;
  positionROI: string | number;
  positionBalance: string | number;
  positionMoney: string | number;
  lastOneMonth: string;
  lastThreeMonth: string;
  lastSixMonth: string;
  lastYear: string;
  lastThreeYear: string;
  sinceEstablishment: string;
  expectPositionProfit: string | number;
  expectPositionROI: string;
  expectPositionBalance: string | number;
}
export default class FundEquityService {
  public id = "";
  // 持仓净值（成本）
  public positionEquity = 0;
  // 持仓份额
  public positionLot = 0;

  public dataSource = "";

  // 数据获取频率延迟 默认10s
  public delay = 60 * 1000;

  // 是否正在更新
  public updating = false;

  // 抓取到的网页数据
  public data: EquityResponse | {} = {};

  constructor(id: string, positionEquity?: number, positionLot?: number) {
    this.id = id;
    this.dataSource = getFundPriceUrl(id);
    this.positionEquity = positionEquity || 0;
    this.positionLot = positionLot || 0;
  }

  async start() {
    if (this.updating) return;
    const data = await this.getEquity();
    if (data) {
      this.data = data;
    }
    setTimeout(async () => {
      await this.start();
    }, this.delay);
  }
  public async getEquity(): Promise<EquityResponse | null> {
    const response: EquityResponse = {
      name: "--",
      equity: "N/A",
      dayGrowthRate: "N/A",
      positionProfit: "N/A",
      positionROI: "N/A",
      positionBalance: "N/A",
      positionMoney: "N/A",
      lastOneMonth: "N/A",
      lastThreeMonth: "N/A",
      lastSixMonth: "N/A",
      lastYear: "N/A",
      lastThreeYear: "N/A",
      sinceEstablishment: "N/A",
      expectEquity: "N/A",
      expectDiff: "N/A",
      expectDayGrowthRate: "N/A",
      expectPositionProfit: "N/A",
      expectPositionROI: "N/A",
      expectPositionBalance: "N/A"
    };
    this.updating = true;
    const { data } = await get(this.dataSource);
    const nameReg = /<span\s+class="funCur-FundName">(.*?)<\/span>/;
    const nameRes = data.match(nameReg);
    if (nameRes && nameRes.length) {
      response.name = nameRes[1];
    }
    /**
     * 数据块
     * <div class="dataOfFund"><dl class="dataItem01"><dt><p><span><span class="sp01">净值估算</span></span><span id="gz_gztime">2020-03-27 15:00</span><span class="infoTips"><span class="tipsBubble" style="display: none;">净值估算每个交易日9：30-15：00盘中实时更新（QDII基金为海外交易时段），是按照基金持仓、指数走势和基金过往业绩估算，估算数据并不代表真实净值，仅供参考，请以基金管理人披露净值为准。</span></span></p></dt><dd class="dataNums"><dl class="floatleft"><span class="ui-font-large ui-color-red ui-num" id="gz_gsz">0.8873</span></dl><dl id="gz_icon" class="gzup"></dl><dl class="floatleft fundZdf"><span class="ui-font-middle ui-color-red ui-num" id="gz_gszze">+0.0203</span><span class="ui-font-middle ui-color-red ui-num" id="gz_gszzl">+2.34%</span></dl></dd><dd><span>近1月：</span><span class="ui-font-middle ui-color-green ui-num">-6.35%</span></dd><dd><span>近1年：</span><span class="ui-font-middle ui-color-red ui-num">11.60%</span></dd></dl><span class="dataOfFund-line"></span><dl class="dataItem02"><dt><p><span class="ui-color-blue"><span class="sp01"><a href="http://fundf10.eastmoney.com/jjjz_161725.html">单位净值</a></span> (</span>2020-03-27)</p></dt><dd class="dataNums"><span class="ui-font-large ui-color-red ui-num">0.8871</span><span class="ui-font-middle ui-color-red ui-num">2.32%</span></dd><dd><span>近3月：</span><span class="ui-font-middle ui-color-green ui-num">-8.87%</span></dd><dd><span>近3年：</span><span class="ui-font-middle ui-color-red ui-num">86.97%</span></dd></dl><span class="dataOfFund-line"></span><dl class="dataItem03"><dt><p><span class="ui-color-blue"><span class="sp01"><a href="http://fundf10.eastmoney.com/jjjz_161725.html">累计净值</a></span></span></p></dt><dd class="dataNums"><span class="ui-font-large ui-color-red ui-num">2.0132</span></dd><dd><span>近6月：</span><span class="ui-font-middle ui-color-green ui-num">-11.08%</span></dd><dd><span>成立来：</span><span class="ui-font-middle ui-color-red ui-num">123.73%</span></dd></dl></div>
     */
    const dataReg = /<div class="dataOfFund"><dl class="dataItem01"><dt><p><span><span class="sp01">净值估算<\/span><\/span><span id="gz_gztime">\((.*?)\)<\/span><span class="infoTips">.*<\/span><\/p><\/dt><dd class="dataNums"><dl class="floatleft"><span class="ui-font-large (?:ui-color-red|ui-color-green)? ui-num" id="gz_gsz">(.*?)<\/span><\/dl><dl id="gz_icon" class="gz\w+"><\/dl><dl class="floatleft fundZdf"><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num" id="gz_gszze">(.*?)<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num" id="gz_gszzl">(.*?)<\/span><\/dl><\/dd><dd><span>近1月：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><dd><span>近1年：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><\/dl><span class="dataOfFund-line"><\/span><dl class="dataItem02"><dt><p><span class="ui-color-blue"><span class="sp01"><a href=".*">单位净值<\/a><\/span> \(<\/span>(.*)\)<\/p><\/dt><dd class="dataNums"><span class="ui-font-large (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><dd><span>近3月：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><dd><span>近3年：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><\/dl><span class="dataOfFund-line"><\/span><dl class="dataItem03"><dt><p><span class="ui-color-blue"><span class="sp01"><a href=".*">累计净值<\/a><\/span><\/span><\/p><\/dt><dd class="dataNums"><span class="ui-font-large (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><dd><span>近6月：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><dd><span>成立来：<\/span><span class="ui-font-middle (?:ui-color-red|ui-color-green)? ui-num">(.*?)<\/span><\/dd><\/dl><\/div>/;
    const dataRes = data.match(dataReg);
    if (!dataRes) {
      return response;
    }
    const dataIndex: EquityType<number> = {
      equity: 8,
      expectEquity: 2,
      expectDayGrowthRate: 4,
      expectDiff: 3,
      dayGrowthRate: 9,
      lastOneMonth: 5,
      lastThreeMonth: 10,
      lastSixMonth: 13,
      lastYear: 6,
      lastThreeYear: 11,
      sinceEstablishment: 14
    };
    Object.keys(dataIndex).forEach(key => {
      const index = dataIndex[key as FiledOfEquityResponse];
      if (dataRes[index as number]) {
        response[key as FiledOfEquityResponse] = dataRes[index as number];
      }
    });
    response.dayGrowthRate = `${response.dayGrowthRate} (${dataRes[7]})`;
    response.expectDayGrowthRate = `${response.expectDayGrowthRate} (${dataRes[1]})`;
    response.expectDiff =
      (/-/.test(response.expectDayGrowthRate) ? "-" : "") +
      Math.abs(Number(response.expectDiff));
    // 如果有传入持仓净值 就计算收益率
    if (this.positionEquity) {
      const equityDiff = +response.equity - this.positionEquity;
      const expectEquityDiff = +response.expectEquity - this.positionEquity;
      // 计算持仓收益/收益率
      response.positionROI =
        ((equityDiff / this.positionEquity) * 100).toFixed(2) + "%";
      response.expectPositionROI =
        ((expectEquityDiff / this.positionEquity) * 100).toFixed(2) + "%";
      if (this.positionLot) {
        response.positionProfit = (this.positionLot * equityDiff).toFixed(2);
        response.positionBalance = (
          this.positionLot * +response.equity
        ).toFixed(2);
        response.positionMoney = (
          this.positionLot * this.positionEquity
        ).toFixed(2);
        // 预估数据
        response.expectPositionProfit = (
          this.positionLot * expectEquityDiff
        ).toFixed(2);
        response.expectPositionBalance = (
          this.positionLot * +response.expectEquity
        ).toFixed(2);
      }
    }
    this.updating = false;
    return response;
  }
}
