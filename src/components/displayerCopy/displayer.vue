<template>
  <div class="container">
    <div id="googleMap"></div>
  </div>
</template>

<script>
import { testActions } from "../../actions/gpsTracking.action";
import  controller  from  "../controller/controller";


export default {
  name: "Displayer",

  components: {},

  data() {
    return {
      data: {},
      deviceId: "",
      getElementById: ""
    };
  },

  methods: {
    /**
     * Description : Set the map
     * @param {object}  getElementById
     * @param {object}  propMap
     * @return {object}
     */
    setMap(getElementById, propMap) {
      let map = new google.maps.Map(getElementById, propMap);
      return map;
    },

    /**
     * Description : Set the marker
     * @param {object}  propMarker
     * @param {object}  propMap
     */
    setMarker(propMarker) {
      var marker = new google.maps.Marker(propMarker);
    },

    /**
     * Description : Get the map data by using axios
     */
    getMapData() {
      testActions
        .getZoomMapData()
        .then(this.successHandleGetMapData)
        .catch(this.errorHandleGetMapData);
    },

    /**
     * Description : Handle success
     * @param {object}  data
     */
    successHandleGetMapData(data) {
      //console.log(data);
      this.dynMapData(data);
    },

    /**
     * Description : Handle error
     * @param {object}  error
     */
    errorHandleGetMapData(error) {},

    /**
     * Description : Set the map data dynamically
     * @param {object}  data
     */
    dynMapData(data) {
      console.log("data-->", data);
      //     for (var key in data) {
      //   this.mapPoints[key] = data[key];
      // }
      controller.methods.initializeMap();
      
      // if (
      //   window.centerLat != 0 &&
      //   window.centerLng != 0 &&
      //   window.zoomLevel != 0
      // ) {
      //   let propLatLng = { lat: window.centerLat, lng: window.centerLng };
      //   let propMap = { zoom: window.zoomLevel, center: propLatLng };
      //   let map = this.setMap(this.getElementById, propMap);
      //   this.setMarkerWithDataMap(map, data);
      //   this.drawLine();


      // } else {
      //   alert("Unable to show maps due to some values are missing");
      // }
      
    },

    /**
     * Description : Set the marker from map and data
     * @param {object}  data
     * @param {object}  data
     */
    setMarkerWithDataMap(map, data) {
      var carSymbol = {
        path:
          "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
        strokeColor: "#000",
        scale: 0.7,
        fillOpacity: 1,
        fillColor: "#999999",
        anchor: new google.maps.Point(10, 25),
        rotation: -165
      };

console.log(data);

      for (var key in data) {
        let propLatLng = { lat: data[key].latitude*1, lng: data[key].longitude*1 };
        let propMarker = { position: propLatLng, map: map , icon: carSymbol};
        this.setMarker(propMarker);
      }
    },

    /**
     * Description : draw lines between two points
    */
    drawLine(){

    }
  },

  /**
   * Description : Call the function on mounted
   */
  mounted() {
    this.deviceId = window.deviceId;
    this.getElementById = document.getElementById("googleMap");
    this.getMapData();
    console.log("controller.name>>", controller.data().stepSize);
    
  }
};
</script>