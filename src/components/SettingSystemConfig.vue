<template>
  <div class="system-config">
    <div class="menu">
      <a-menu
        style="width: 256px"
        :defaultSelectedKeys="current"
        :openKeys.sync="openKeys"
        mode="inline"
      >
        <a-sub-menu key="m1">
          <span slot="title"
            ><a-icon type="setting" /><span>基金配置</span></span
          >
          <a-menu-item key="1">数据源</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="config-body">
      <template v-if="currentMenu === '1'">
        <ConfigFundSource v-model="systemConfig.dataSource" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Storage from "../utils/storage";
import { Menu } from "ant-design-vue";
import { CONFIG_SYSTEM } from "@/constant/storage";
import ConfigFundSource from "./ConfigFundSource.vue";
import { CrawlerEnum } from "@/crawler";

@Component({
  components: {
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    ConfigFundSource
  }
})
export default class SettingConfig extends Vue {
  public systemConfig: { [key: string]: string } = {};
  public isReady = false;
  public current = ["1"];
  public openKeys = ["m1"];

  public get currentMenu() {
    return this.current[0];
  }

  @Watch("systemConfig", {
    deep: true
  })
  public onSystemConfigChange(config: { [key: string]: string }) {
    if (this.isReady) {
      Storage.set(CONFIG_SYSTEM, config);
    }
  }

  public initData() {
    const systemConfig = Storage.get(CONFIG_SYSTEM);
    if (!systemConfig) {
      this.systemConfig = {
        dataSource: CrawlerEnum.Flush
      };
    } else {
      this.systemConfig = systemConfig;
    }
    this.isReady = true;
  }

  public mounted() {
    this.initData();
  }
}
</script>

<style scoped lang="less">
.system-config {
  display: flex;
  flex-direction: row;
  .config-body {
    flex: 1;
  }
}
</style>
