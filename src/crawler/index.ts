import BaseCrawler, { EquityResponse } from "./BaseCrawler";
import FlushCrawler from "./FlushCrawler";
import EastMoneyCrawler from "./EastMoneyCrawler";
export enum CrawlerEnum {
  Flush = "FlushCrawler",
  EastMoney = "EastMoneyCrawler"
}
export default {
  FlushCrawler,
  EastMoneyCrawler
};
export { EquityResponse, BaseCrawler };
