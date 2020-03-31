<template>
  <span :class="['colorful', color]">
    {{ value }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Colorful extends Vue {
  @Prop({
    type: [String, Number]
  })
  public value!: string | number;

  public get color() {
    if (this.value === "N/A") {
      return "";
    }
    if (/^-/.test(this.value + "") || this.value === "N/A") {
      return "green";
    }
    return "red";
  }
}
</script>

<style scoped lang="less">
.colorful {
  &.green {
    color: green;
  }
  &.red {
    color: red;
  }
}
</style>
