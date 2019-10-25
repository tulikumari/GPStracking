/**
 * Summary: Summary of the test action
 * Description: Create test for testing
 * @author Pawan Gupta
 * @date  18 jan 2019
 */

//Import
import { APIService } from "../service/api";
import { urlConstants } from "../constants/uri.constants";
import { responseActions } from "./response.action";

//Public Method
/**
 * Description: handle getdata
 * @return {Promise}
 */
const getData = () => {
  let url = "";
  let body = { OperationType: "10300", Data: "N/A" };
  let header = {};
  url = urlConstants.TEST;

  return APIService.post(url, header, body).then(
    data => {
      let getResponse = responseActions.response(data);
      if (getResponse) {
        return getResponse;
      } else {
        return null;
      }
    },
    error => {
      return responseActions.errorResponse(error);
    }
  );
};

//Public Method
/**
 * Description: handle getdata
 * @return {Promise}
 */
const getMapData = () => {
  let url = "";
  url = urlConstants.TEST + "?deviceId="+window.deviceId;
  console.log("url>>>", url);
  
  return APIService.get(url).then(
    data => {
      console.log("APIService???", data);
      let getResponse = responseActions.response(data);
      if (getResponse) {
        return getResponse;
      } else {
        return null;
      }
    },
    error => {
      return responseActions.errorResponse(error);
    }
  );
};

/**
 * Description: handle getdata
 * @return {Promise}
 */
const getZoomMapData = () => {
  let url = "";
  url = urlConstants.TEST + "?deviceId="+window.deviceId;
  console.log("url>>>", url);
  
  return APIService.get(url).then(
    data => {
      console.log("APIService???", data);
      let getResponse = responseActions.response(data);
      if (getResponse) {
        return getResponse;
      } else {
        return null;
      }
    },
    error => {
      return responseActions.errorResponse(error);
    }
  );
};


//Public Method
/**
 * Description: handle postdata
 * @return {Promise}
 */
const postMapData = (mouseMoveCoordinates, zoomLevel, centerCoordinates) => {
  let url = "";
  url = urlConstants.TEST + "?deviceId="+window.deviceId + "&" + "&mouseMoveLat="+mouseMoveCoordinates.lat+"&mouseMoveLng="+mouseMoveCoordinates.lng + "&zoomLevel="+zoomLevel+"&centerLat="+centerCoordinates.lat+"&centerLng="+centerCoordinates.lng;
  console.log("url ----->>>", url); 
  console.log(window.deviceId)

  console.log(
    "mouseMoveCoordinates, zoomLevel, centerCoordinates ---> ",
    mouseMoveCoordinates,
    zoomLevel,
    centerCoordinates
  );

  return APIService.post(url).then(
    data => {
      console.log("POST APIService???", data);
      let getResponse = responseActions.response(data);
      if (getResponse) {
        return getResponse;
      } else {
        return null;
      }
    },
    error => {
      return responseActions.errorResponse(error);
    }
  );
};

//Export testActions
export const testActions = {
  getData,
  getMapData,
  getZoomMapData,
  postMapData
};
