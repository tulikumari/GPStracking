<template>
  <div class="container">
    <div id="googleMap"></div>
    <div id="btn-sec">
      <button class="btn-green btn-big" @click="startBtn()" :disabled="disableStart == 1">Start</button>
      <button class="btn-green btn-big" @click="stopBtn()" :disabled="disableStop == 1">Stop</button>
      <button class="btn-green btn-big" @click="displayerPage">Displayer</button>
    </div>
  </div>
</template>

<script>
import { testActions } from "../../actions/gpsTracking.action";

export default {
  name: "TestComp",
  components: {},
  data() {
    return {
      data: {},
      disableStart: 0,
      disableStop: 0,
      stepSize: 300,
      map: "",
      markers: [],
      pointsDone: [],
      bounds: "",
      myInterval: "",
      startPoint: "",
      endPoint: "",
      progress: "",
      stopFlag: false,
      myPath: "",
      step: "",
      stepTime: 5,
      mapOptions: {},
      mapPoints: [
        // {
        //   latitude: -33.9244,
        //   longitude: 18.4230
        // },
        // {
        //   latitude: -33.9234,
        //   longitude: 18.4240
        // },
        // {
        //   latitude: -33.9239,
        //   longitude: 18.4247
        // },
        // {
        //   latitude: -33.9236,
        //   longitude: 18.4250
        // },
        // {
        //   latitude: -33.9243,
        //   longitude: 18.4259
        // },
        //  {
        //   latitude: -33.9246,
        //   longitude: 18.4257
        // },
        // {
        //   latitude: -33.9248,
        //   longitude: 18.4259
        // },
        // {
        //   latitude: -33.9244,
        //   longitude: 18.4262
        // },
      ],

      ///
      mouseMove: { lat: "", lng: "" },
      zoomLevel: 0,
      center: { lat: "", lng: "" },
      intervalId: "",
      deviceId: "",
      intervalFlag: 0,
      getElementById: "",
      getDataFlag: 0
    };
  },
  methods: {
    /**
     * Description : Set the default map data
     */
    defaultMapData() {
      let propLatLng = { lat: -33.9244, lng: 18.4230 };
      let propMap = { zoom: 11, center: propLatLng };
      let map = this.setMap(this.getElementById, propMap);
    },

    initializeMap: function() {

      this.mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(
          this.mapPoints[0].latitude,
          this.mapPoints[0].longitude
        ),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      //Create map
      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        this.mapOptions
      );

      //set the value
      this.setZoomLevel(this.map.getZoom());
      this.setCenterCoordinates(this.map.getCenter());
      //set the value at listener
      this.mousemoveListener(this.map);
      this.zoomChangedListener(this.map);
      this.dragendListener(this.map);

      this.bounds = new google.maps.LatLngBounds();

      var carSymbol = {
        path:
          "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
        strokeColor: "#000",
        scale: 0.7,
        fillOpacity: 1,
        fillColor: "#999999",
        anchor: new google.maps.Point(10, 25),
        rotation: -320
      };
      //Iterate through all points in mapPoints

      this.mapPoints.forEach((value, key) => {
        //create marker
        var myLatLng = new google.maps.LatLng(value.latitude, value.longitude);
        this.marker = new google.maps.Marker({
          position: myLatLng,
          icon: carSymbol,
          map: this.map,
          visible: false
        });
        this.markers.push(this.marker);

        /*google.maps.event.addListener(marker, 'click', function (event) {
                document.getElementById("latbox").value = this.getPosition().lat();
                document.getElementById("lngbox").value = this.getPosition().lng();
              });*/

        //add to bounds and path
        this.bounds.extend(myLatLng);
      });

      //Center & zoom map on all mapPoints
      this.map.fitBounds(this.bounds);
      //Add first mapPoint to an array that will keep points that have been animated
      this.pointsDone.push(
        new google.maps.LatLng(
          this.mapPoints[0].latitude,
          this.mapPoints[0].longitude
        )
      );
    },

    //Following function gets called one polyline at a time
    pathAnimation: function(point) {
      //Make marker visible once path has reached that point
      if (point == 0) this.markers[point].setVisible(true);
      //Set start & end point for this polyline
      console.log("this.pointsDone1111>>>", this.pointsDone);
      this.startPoint = this.pointsDone[point];
      console.log("startPoint1111>>>", this.startPoint);
      this.endPoint = new google.maps.LatLng(
        this.mapPoints[point + 1].latitude,
        this.mapPoints[point + 1].longitude
      );
      var lineSymbol = {
        path:
          "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
        strokeColor: "#000",
        scale: 0.7,
        fillOpacity: 1,
        fillColor: "#22d422",
        anchor: new google.maps.Point(10, 25)
      };
      //Create the polyline
      this.myPath = new google.maps.Polyline({
        path: this.pointsDone,
        geodesic: false,
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: this.map,
        icons: [
          {
            icon: lineSymbol,
            offset: "100%"
          }
        ]
      });
      //Add this point to the array keeping points that have already been animated to
      this.pointsDone.push(this.endPoint);
      this.animationLoop(0);
    },

    //Animation loop
    animationLoop: function(progressPoint) {
      console.log("startPoint>>>", this.startPoint);
      this.step = progressPoint;
      this.myInterval = setInterval(() => {
        this.step += 0.1;
        if (this.step > this.stepSize) {
          //Done drawing, clear the interval, and call pathAnimation() again, IF we're not done animating all the polylines
          clearInterval(this.myInterval);

          if (this.pointsDone.length - 1 < this.mapPoints.length - 1) {
            //remove symbol
            this.myPath.set("icons", []);
            //End remove symbol
            this.pathAnimation(this.pointsDone.length - 1);
          }
        } else {
          //Not done drawing yet...

            this.progress = google.maps.geometry.spherical.interpolate(
            this.startPoint,
            this.endPoint,
            this.step / this.stepSize
          );
          this.myPath.setPath([this.startPoint, this.progress]);
        }
      }, this.stepTime);
    },

    // Stop map
    stopMap: function() {
      this.stopFlag = true;
      clearInterval(this.myInterval);
    },

    startBtn: function() {
      //
      let refreshInterval = window.config.refreshInterval
        ? window.config.refreshInterval
        : 3000;
      if (this.deviceId && !this.intervalid) {
        const self = this;
        self.getMapData();
        this.intervalid = setInterval(function() {
          self.getMapData();
        }, refreshInterval);
      } else {
        if (!this.deviceId) {
          alert("deviceId is missing at url");
        }
      }

      this.disableStart = 1;
      this.disableStop = 0;
      if (this.stopFlag) {
        this.animationLoop(this.step);
      } 
    },
    stopBtn: function() {
      this.disableStart = 0;
      this.disableStop = 1;
      this.stopMap();
      console.log("clearInterval");
      clearInterval(this.intervalid);
    },

    //
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
     * Description : Set the map data dynamically
     * @param {object}  data
     */
    dynMapData(data) {
      console.log("data>>>",this.getDataFlag);

      if (this.getDataFlag == 1) {
        //Todo: we need to update the collection only.
        return 0;
      }

      for (var key in data) {
        this.mapPoints[key] = data[key];
      }

      this.initializeMap();

      this.disableStart = 1;
      this.disableStop = 0;
      
      
      this.pathAnimation(0);
      
      
      this.getDataFlag = 1;
    },

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
     * Description : open displayer page  in new window
     */
    displayerPage() {
      const mouseMoveCoordinates = this.getVueObject(
        this.getMouseMoveCoordinates()
      );
      const zoomLevel = this.getVueObject(this.getZoomLevel());
      const centerCoordinates = this.getVueObject(this.getCenterCoordinates());
      //alert(zoomLevel);
      const url =
        window.location.origin +
        window.location.pathname +
        "#/displayer?deviceId=" +
        window.deviceId +
        "&centerLat=" +
        centerCoordinates.lat +
        "&centerLng=" +
        centerCoordinates.lng +
        "&zoomLevel=" +
        zoomLevel +
        "&currentLatitude=" +
        this.progress.lat() +
        "&currentLongitude=" +
        this.progress.lng();
      console.log("url is ", url);
      console.log("location is ", window.location);

      window.open(url, "_blank");
    },
    open() {
      this.dynMapData()
    },
  
  },

  mounted() {
    //this.getData();
    // this.getMapData();
    this.deviceId = window.deviceId;
    this.getElementById = document.getElementById("googleMap");
    this.defaultMapData();
  }
};

</script>