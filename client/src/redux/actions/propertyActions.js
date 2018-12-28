import axios from "axios";
import * as ActionTypes from "./types";
import {getCurrentUser} from "./authActions";

export const addProperty = (newProperty) => dispatch => {
    axios.post("http://localhost:5000/api/uploads/property",newProperty)
        .then((response) => {

            dispatch(addNewProperty(response.data));
            alert("Property is successfully added");
        }).catch((error) => {
    });
};
export const fetchProperties = ()=>dispatch =>{
    dispatch(propertiesLoading(true));
    dispatch(getCurrentUser());
    axios.get("http://localhost:5000/api/property/all")
        .then((response) => {
            dispatch(addProperties(response.data));
        }).catch((error) => {
            dispatch(propertiesFailed(error.message));
    });
};

export const propertiesLoading = ()=>({
    type: ActionTypes.PROPERTY_LOADING
});
export const propertiesFailed = (errMess)=>({
    type:ActionTypes.PROPERTY_ERROR,
    payload:errMess
});
export const addNewProperty=(property)=>({
    type: ActionTypes.ADD_PROPERTY,
    payload: property
});
export const addProperties=(properties)=>({
    type: ActionTypes.ADD_PROPERTIES,
    payload: properties
});
export const addImageToServer= ( image ) => dispatch =>{
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post("http://localhost:5000/api/uploads/image",image,config)
        .then((response) => {
            console.log('Images Uploaded')
        }).catch((error) => {
    });
};