<template>
  <div class="container">
    <div id="googleMap"></div>
    <div id="btn-sec">
      <button class="btn-green btn-big" @click="getMapDataWithInterval">Start</button>
      <button class="btn-green btn-big" @click="clearInterval">Stop</button>
      <button class="btn-green btn-big" @click="displayerPage">Displayer</button>
    </div>
  </div>
</template>

<script>
import { testActions } from "../../actions/gpsTracking.action";

export default {
  name: "Contoler",
  components: {},
  data() {
    return {
      data: {},
      mouseMove: { lat: "", lng: "" },
      zoomLevel: 0,
      center: { lat: "", lng: "" },
      intervalId: "",
      deviceId: "",
      intervalFlag: 0,
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
     * Description : Set the default map data
     */
    defaultMapData() {
      console.log(this.getElementById);

      let propLatLng = { lat: 36.257, lng: 76.698 };
      let propMap = { zoom: 1, center: propLatLng };
      let map = this.setMap(this.getElementById, propMap);
      let propMarker = { position: propLatLng, map: map };
    },

    /**
     * Description : Set the map data dynamically
     * @param {object}  data
     */
    dynMapData(data) {
      let propLatLng = { lat: data.lat, lng: data.lng };
      let propMap = { zoom: 8, center: propLatLng };
      let map = this.setMap(this.getElementById, propMap);

      let propMarker = { position: propLatLng, map: map };
      this.setMarker(propMarker);

      //set the value 
      this.setZoomLevel(map.getZoom());
      this.setCenterCoordinates(map.getCenter());

      //set the value at listener
      this.mousemoveListener(map);
      this.zoomChangedListener(map);
      this.dragendListener(map);
    },

    /**
     * Description : Get the map data by using axios
     */
    getMapDataWithInterval() {

      let refreshInterval = window.config.refreshInterval ?  window.config.refreshInterval : 3000;

      if (this.deviceId && !this.intervalid  ) {
        const self = this;
        self.getMapData();
        this.intervalid = setInterval(function() {
          self.getMapData();
        }, refreshInterval);
      } else {
        if(!this.deviceId ){
          alert("deviceId is missing at url");
        }
      }
    },

    /**
     * Description : Get the map data by using axios
     */
    getMapData() {
      testActions
        .getMapData()
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
     * Description : Post the map data by using axios
     * @param {object}  mouseMoveCoordinates
     * @param {Integer}  zoomLevel
     * @param {object}  zoomCoordinates
     */
    postMapData() {
      const mouseMoveCoordinates = this.getVueObject(
        this.getMouseMoveCoordinates()
      );
      const zoomLevel = this.getVueObject(this.getZoomLevel());
      const zoomCoordinates = this.getVueObject(this.getCenterCoordinates());

      testActions
        .postMapData(mouseMoveCoordinates, zoomLevel, zoomCoordinates)
        .then(this.successHandlePostMapData)
        .catch(this.errorHandlePostMapData);
    },

    /**
     * Description : Handle success for post
     * @param {object}  data
     */
    successHandlePostMapData(data) {
      console.log("successHandlePostMapData --> ", data);
    },

    /**
     * Description : Handle error for post
     * @param {object}  error
     */
    errorHandlePostMapData(error) {},

    /**
     * Description : Add listener for mouse move
     * @param {object}  map
     */
    mousemoveListener(map) {
      const self = this;
      map.addListener("mousemove", function(event) {
        self.setMouseMoveCoordinates(event.latLng);
        self.setCenterCoordinates(map.getCenter());
        //self.postMapData();
      });
    },

    /**
     * Description : Add listener for zoom changed
     * @param {object}  map
     */
    zoomChangedListener(map) {
      const self = this;
      map.addListener("zoom_changed", function() {
        self.setZoomLevel(map.getZoom());
        self.setCenterCoordinates(map.getCenter());
        self.postMapData();
      });
    },

    /**
     * Description : Add listener for dragend
     * @param {object}  map
     */
    dragendListener(map) {
      const self = this;
      map.addListener("dragend", function() {
        self.postMapData();
      });
    },
    /**
     * Description : Remove listener
     */
    removeListener() {
      //todo:
      map.removeListener("mousemove", function() {});
      map.removeListener("zoom_changed", function() {});
    },

    /*
     * Description : Set coordinates on map mouseover
     * @param {object}  pnt
     */
    setMouseMoveCoordinates(pnt) {
      //console.log(pnt);
      var lat = pnt.lat();
      lat = lat.toFixed(4);
      var lng = pnt.lng();
      lng = lng.toFixed(4);
      this.mouseMove = { lat: lat, lng: lng };
      //console.log("---------", this.getVueObject(this.mouseMove));
      //return this.mouseMove;
    },

    /*
     * Description : Set coordinates on map zoom
     * @param {object}  pnt
     */
    setCenterCoordinates(pnt) {
      //console.log(pnt);
      var lat = pnt.lat();
      lat = lat.toFixed(4);
      var lng = pnt.lng();
      lng = lng.toFixed(4);
      this.center = { lat: lat, lng: lng };
      //return this.mouseMove;
    },

    /*
     * Description : Set the zoom level
     * @param {Integer}  zoomLevel
     */
    setZoomLevel(zoomLevel) {
      this.zoomLevel = zoomLevel;
    },

    /*
     * Description : Get the MouseMove Coordinates
     */
    getMouseMoveCoordinates() {
      return this.mouseMove;
    },

    /*
     * Description : Get the Zoom Coordinates
     */
    getCenterCoordinates() {
      return this.center;
    },

    /*
     * Description : Get the zoom level
     */
    getZoomLevel() {
      return this.zoomLevel;
    },

    /*
     * Description : Get the zoom level
     * @param {Object}  obj
     */
    getVueObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    /*
     * Description : destroy the set interval
     */
    clearInterval() {
      console.log("clearInterval");
      clearInterval(this.intervalid);
    },

    /*
     * Description : open displayer page  in new window
     */
    displayerPage() {
      const mouseMoveCoordinates = this.getVueObject(
        this.getMouseMoveCoordinates()
      );
      const zoomLevel = this.getVueObject(this.getZoomLevel());
      const centerCoordinates = this.getVueObject(this.getCenterCoordinates());
      //alert(zoomLevel);
      const url = window.location.origin +window.location.pathname+ "#/displayer?deviceId=" +
          window.deviceId +
          "&centerLat=" +
          centerCoordinates.lat +
          "&centerLng=" +
          centerCoordinates.lng +
          "&zoomLevel=" +
          zoomLevel;
console.log("url is " , url);
console.log("location is " , window.location);

       window.open(
        url,"_blank"
      ); 
    }
  },

  /**
   * Description : Call the function on mounted
   */
  mounted() {
    this.deviceId = window.deviceId;
    this.getElementById = document.getElementById("googleMap");
    this.defaultMapData();
  },

  /**
   * Description : destroy the set interval
   */
  beforeDestroy() {
    this.clearInterval(this.intervalId);
  }
};
</script>