function offset(num, latLong) {

}

let trips;
let stops;
let routes;

async function initArrays(type) {
    let response = await fetch(`https://api.at.govt.nz/v2/gtfs/${type}`, {
        headers: {
            'Ocp-Apim-Subscription-Key': '69bbd91448a04a79928312bda869d3c0' //Storing keys in clientside? Must be a hackathon
        }
    });
  j = await response.json()

  return j.response;
}

async function firstTime() {
    trips = initArrays('trips');
    stops = initArrays('stops');
    routes = initArrays('routes');
    
    const initialStopID = '8536-20190819140255_v83.2' //Will have to make this in future

    getRoutes(initialStopID);
}

function getRoutes(stopID, canvas) {

}

firstTime();