export interface EquityResponse {
  name: string;
  equity: string;
  dayGrowthRate: string;
  lastOneMonth: string;
  lastThreeMonth: string;
  lastSixMonth: string;
  lastYear: string;
  lastThreeYear: string;
  sinceEstablishment: string;
  predictEquity: string;
  predictDiff: string;
  predictDayGrowthRate: string;
}
export default class BaseCrawler {
  public fundId = "";
  public loading = false;

  public constructor(fundId: string) {
    this.fundId = fundId;
  }

  public get fundViewUrl() {
    return "";
  }

  public get fundDataPageUrl() {
    return "";
  }

  public async getData(): Promise<EquityResponse | null> {
    return null;
  }
}
