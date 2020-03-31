<template>
  <div class="home">
    <FundList />
  </div>
</template>

<script>
// @ is an alias to /src
import FundList from "@/components/FundList.vue";

export default {
  name: "Home",
  components: {
    FundList
  }
};
</script>
