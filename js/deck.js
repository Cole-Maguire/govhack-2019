const { DeckGL, HexagonLayer } = deck;
const KEY = '69bbd91448a04a79928312bda869d3c0'
const deckgl = new DeckGL({
    mapboxApiAccessToken: 'pk.eyJ1IjoiY29sZS1tYWd1aXJlIiwiYSI6ImNrMDk1YWs3YzA1NnUzYnFsczI1eWMzNDcifQ.7KGfa-CJJdG-iTfoniHObg',
    mapStyle: 'mapbox://styles/mapbox/dark-v9',
    longitude: 174.753192,
    latitude: -36.854946,
    width: 800,
    height: 500,
    container: 'deck-gl',
    zoom: 12,
    minZoom: 5,
    maxZoom: 15,
    controller: true,
    pitch: 40.5
});

let data = null;

const OPTIONS = ['radius', 'coverage'];

const COLOR_RANGE = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];
function renderLayer() {
    const options = { radius: 5, coverage: 10 };

    function lookupPoint(p) {
        return p.other.vehicle.occupancy_status
    }

    async function setTooltip(info) {
        const el = document.getElementById('tooltip');
    
        try {
            el.textContent = '...'
            el.style.display = 'block';
            el.style.left = info.x + 200 + 'px';
            el.style.top = info.y + 100 + 'px';
            let resp = await fetch(`https://api.at.govt.nz/v2/gtfs/routes/routeId/${dataIn[info.index].other.vehicle.trip.route_id}`, {
                headers: {
                    'Ocp-Apim-Subscription-Key': KEY
                }
            })
            let content = await resp.json()
            el.textContent = `${content.response[0].route_short_name}: ${content.response[0].route_long_name}`;
        } catch {
            el.style.display = 'none';
        }
    }

    function one(p){
        return 1
    }

    const hexagonLayer = new HexagonLayer({
        id: 'heatmap',
        colorRange: COLOR_RANGE,
        getColorWeight:  document.getElementById("checkCongestion").checked? lookupPoint: one,
        data,
        pickable: true,
        onHover: async info => await setTooltip(info),
        extruded: false,
        getPosition: d => d.COORDINATES,
        opacity: 1,
        ...options
    });
    deckgl.setProps({
        layers: [hexagonLayer]
    });
}

let colors = {}
const fetchData = () => {
    fetch(`https://api.at.govt.nz/v2/public/realtime/vehiclelocations`, {
        headers: {
            'Ocp-Apim-Subscription-Key': KEY
        }
    }).then(async (resp) => {
        let j = await resp.json()
        return j.response.entity
    })
        .then(response => {
            data = response.map(item => {
                return {
                    COORDINATES:
                        [Number(item.vehicle.position.longitude), Number(item.vehicle.position.latitude)],
                    other: item
                }
            });
            renderLayer();
        });
}
setInterval(fetchData, 3000)
let response = fetchData()
