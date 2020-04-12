/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-vars */
import Crawler, { BaseCrawler, CrawlerEnum, EquityResponse } from "../crawler";
import Storage from "../utils/storage";
import { CONFIG_SYSTEM } from "@/constant/storage";
export interface FundResultResponse {
  name: string;
  equity: string | number;
  predictEquity: string | number;
  predictDiff: string | number;
  predictDayGrowthRate: string | number;
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
  predictPositionProfit: string | number;
  predictPositionROI: string;
  predictPositionBalance: string | number;
}
export default class FundEquityService {
  // 持仓净值（成本）
  public positionEquity = 0;
  // 持仓份额
  public positionLot = 0;

  // 爬虫实例
  public crawlerInstance: BaseCrawler | {} = {};

  // 数据获取频率延迟 默认10s
  public delay = 60 * 1000;

  // 是否正在更新
  public get loading() {
    return this.crawlerInstance instanceof BaseCrawler
      ? this.crawlerInstance.loading
      : false;
  }

  public get fundViewUrl() {
    return this.crawlerInstance instanceof BaseCrawler
      ? this.crawlerInstance.fundViewUrl
      : "";
  }

  // 抓取到的网页数据
  public result: FundResultResponse | null = null;

  constructor(
    id: string,
    positionEquity?: number,
    positionLot?: number,
    crawlerName?: CrawlerEnum
  ) {
    const systemConfig = Storage.get(CONFIG_SYSTEM);
    let _crawlerName = CrawlerEnum.EastMoney;
    if (systemConfig && systemConfig.dataSource) {
      _crawlerName = systemConfig.dataSource;
    }
    if (crawlerName) {
      _crawlerName = crawlerName;
    }
    if (`${_crawlerName}` in Crawler) {
      const CurrentCrawler = Crawler[_crawlerName];
      this.crawlerInstance = new CurrentCrawler(id);
    }
    this.positionEquity = positionEquity || 0;
    this.positionLot = positionLot || 0;
  }

  async start(polling = true) {
    const result = await this.getFundResult();
    if (result) {
      this.result = result;
    }
    if (polling) {
      setTimeout(async () => {
        await this.start();
      }, this.delay);
    }
  }

  public async getFundResult(): Promise<FundResultResponse | null> {
    const response: FundResultResponse = {
      name: "",
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
      predictEquity: "N/A",
      predictDiff: "N/A",
      predictDayGrowthRate: "N/A",
      predictPositionProfit: "N/A",
      predictPositionROI: "N/A",
      predictPositionBalance: "N/A"
    };
    if (!(this.crawlerInstance instanceof BaseCrawler)) return null;
    const data: EquityResponse | null = await this.crawlerInstance.getData();
    if (!data) {
      return response;
    }
    Object.assign(response, data);
    // 如果有传入持仓净值 就计算收益率
    if (this.positionEquity) {
      const equityDiff = +response.equity - this.positionEquity;
      const predictEquityDiff = +response.predictEquity - this.positionEquity;
      // 计算持仓收益/收益率
      response.positionROI =
        ((equityDiff / this.positionEquity) * 100).toFixed(2) + "%";
      // 在没有预估净值的时候采用官方公布的净值数据计算预估收益率等指标
      response.predictPositionROI = isNaN(+predictEquityDiff)
        ? response.positionROI
        : ((predictEquityDiff / this.positionEquity) * 100).toFixed(2) + "%";
      if (this.positionLot) {
        response.positionProfit = (this.positionLot * equityDiff).toFixed(2);
        response.positionBalance = (
          this.positionLot * +response.equity
        ).toFixed(2);
        response.positionMoney = (
          this.positionLot * this.positionEquity
        ).toFixed(2);
        if (!isNaN(+response.predictEquity)) {
          // 预估数据
          response.predictPositionProfit = (
            this.positionLot * predictEquityDiff
          ).toFixed(2);
          response.predictPositionBalance = (
            this.positionLot * +response.predictEquity
          ).toFixed(2);
        } else {
          // 预估数据
          response.predictPositionProfit = response.positionProfit;
          response.predictPositionBalance = response.positionBalance;
        }
      }
    }
    return response;
  }
}
