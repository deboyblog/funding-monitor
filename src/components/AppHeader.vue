<template>
  <div class="header">
    <div class="btn-item">
      <router-link tag="div" :to="{ name: 'Home' }">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>收益详情</span>
          </template>
          <a-icon type="table" />
        </a-tooltip>
      </router-link>
    </div>
    <a-divider type="vertical" />
    <div class="btn-item">
      <router-link tag="div" :to="{ name: 'Setting' }">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>基金配置</span>
          </template>
          <a-icon type="setting" />
        </a-tooltip>
      </router-link>
    </div>
    <a-divider type="vertical" />
    <div class="btn-item">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ isTop ? "取消置顶" : "置顶显示" }}</span>
        </template>
        <a-icon
          :type="isTop ? 'vertical-align-bottom' : 'vertical-align-top'"
          class="icon-top"
          :class="{ 'is-top': isTop }"
          @click="onToggleTop"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Divider, Tooltip } from "ant-design-vue";
import { ON_TOGGLE_TOP } from "../constant/ipcEvent";
import { ipcRenderer } from "electron";
@Component({
  components: {
    ADivider: Divider,
    ATooltip: Tooltip
  }
})
export default class AppHeader extends Vue {
  public isTop = false;
  public onToggleTop() {
    const res = ipcRenderer.sendSync(ON_TOGGLE_TOP, this.isTop);
    if (res) {
      this.$message.success(`窗口已${this.isTop ? "取消" : ""}置顶`);
      this.isTop = !this.isTop;
    } else {
      this.$message.error("窗口置顶失败");
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 20px 40px 20px;
  align-items: center;
  .btn-item {
    margin-left: 10px;
    cursor: pointer;
  }
  .icon-top {
    &.is-top {
      color: rgb(43, 43, 241);
    }
  }
}
</style>
