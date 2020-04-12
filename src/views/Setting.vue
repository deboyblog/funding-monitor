<template>
  <div class="about">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基金配置" key="1">
        <SettingFundConfig />
      </a-tab-pane>
      <a-tab-pane tab="软件配置" key="2">
        <SettingSystemConfig />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SettingFundConfig from "@/components/SettingFundConfig.vue";
import { Tabs } from "ant-design-vue";
import SettingSystemConfig from "@/components/SettingSystemConfig.vue";
@Component({
  components: {
    SettingSystemConfig,
    SettingFundConfig,
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane
  }
})
export default class Setting extends Vue {}
</script>
