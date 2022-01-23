<template>
	<div class="houseMap">
		<div class="map">
			<iframe class="mapIframe" width="100%" height="100%" marginheight="0" marginwidth="0" style="border:none; overflow:hidden">
			</iframe>
		</div>
	</div>
</template>

<script>
import $ from "jquery";
import { createNamespacedHelpers } from "vuex";
import { GIS3D } from "../../config";
export default {
  name: "tdDataMap",
  props: {},
  data() {
    return {
      panelStyle: {
        width: this.w + "px"
      }
    };
  },
  methods: {
    getUrlParam: function(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    }
  },
  mounted: function() {
    this.currentCity = this.$store.state.global.accountInfo.rolePermission.city_code
    this.currentTown = this.$store.state.platform.currentTownCode
    this.currentPoliceCode = this.$store.state.platform.currentPoliceCode
    
    if (this.getUrlParam("type")) {
      $(".mapIframe").attr("src", GIS3D);
    } else {
      let tmpmap = 'static/map/map2d.html?city_code=' + this.currentCity
			tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
			tmpmap += '&police_code=' + (this.currentPoliceCode == 'all' ? '' : this.currentPoliceCode)
      
      $(".mapIframe").attr("src", tmpmap);
    }
  }
};
</script>

<style lang="scss" scoped="scoped">
.houseMap {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  margin-top: 21px;
  // margin-bottom: 10px;
  // margin-left:5px;
  .map {
    //pointer-events: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>