import BaseCrawler, { EquityResponse } from "@/crawler/BaseCrawler";
import { get } from "@/utils/request";

const BASE_URL = "http://fund.eastmoney.com/";
type FiledOfEquityResponse =
  | "predictEquity"
  | "predictDiff"
  | "predictDayGrowthRate"
  | "name"
  | "equity"
  | "dayGrowthRate"
  | "lastOneMonth"
  | "lastThreeMonth"
  | "lastSixMonth"
  | "lastYear"
  | "lastThreeYear"
  | "sinceEstablishment";
type EquityType<T> = { [field in FiledOfEquityResponse]?: T };
export default class EastMoneyCrawler extends BaseCrawler {
  public get fundViewUrl(): string {
    return this.fundDataPageUrl;
  }
  public get fundDataPageUrl(): string {
    return `${BASE_URL}${this.fundId}.html`;
  }

  public async getData(): Promise<EquityResponse | null> {
    if (this.loading) return null;
    this.loading = true;
    const response: EquityResponse = {
      name: "",
      equity: "N/A",
      dayGrowthRate: "N/A",
      lastOneMonth: "N/A",
      lastThreeMonth: "N/A",
      lastSixMonth: "N/A",
      lastYear: "N/A",
      lastThreeYear: "N/A",
      sinceEstablishment: "N/A",
      predictEquity: "N/A",
      predictDiff: "N/A",
      predictDayGrowthRate: "N/A"
    };
    const { data } = await get(this.fundDataPageUrl);
    if (!data) {
      this.loading = false;
      return response;
    }
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
      predictEquity: 2,
      predictDayGrowthRate: 4,
      predictDiff: 3,
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
    response.predictDayGrowthRate = `${response.predictDayGrowthRate} (${dataRes[1]})`;
    response.predictDiff =
      (/-/.test(response.predictDayGrowthRate) ? "-" : "") +
      Math.abs(Number(response.predictDiff));
    this.loading = false;
    return response;
  }
}
