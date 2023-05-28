require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
], function (esriConfig, Map, MapView, FeatureLayer, Legend, Expand) {
  esriConfig.apiKey =
    "AAPK0dc236a37148458583b633e74790fb25s2jkA3Luv6rWUCl8U_PsMln5w_yQvw8xhRDVI95xThChjH1Tp8hCcDZZmF1e6kCB";

  const url =
    "https://services9.arcgis.com/q5uyFfTZo3LFL04P/arcgis/rest/services/survey123_0954ef4c3eb74d9989a91330c7740a9f/FeatureServer/0";

// Popup template
const template = {
  title: "{Name}",
  lastEditInfoEnabled: false,
  content: [{
    type: "fields",
    fieldInfos: [{
      fieldName: "Address",
      label: "Address"
    },{
      fieldName: "Industry",
      label: "Industry"
    }]
  },{
    type: "text",
    text: '<b>{expression/has-website}</b> <a href={expression/website-expr}>{expression/website-expr}</a>'
  }],
  expressionInfos: [{
    name: 'website-expr',
    title: 'Website: ',
    expression: "IIF(!IsEmpty($feature.Website), $feature.Website, null)"
  },{
    name: 'has-website',
    expression: 'IIf(!IsEmpty($feature.Website), "Website: ", "No website found for this business")' 
  }]

}

const uvrRenderer ={
  type: "unique-value",
  field: "Industry",
  defaultSynbol: {
    type: "simple-marker",
    color: "#b2b2b2",
    size: "10px"
  },
  uniqueValueInfos:[{
    value: "accessories_&_clothing",
    label: "Accessories & Clothing",
    symbol: {
      type: "simple-marker",
      color: "d9351a",
      size: "10px"
    }
  },{
    value: "arts_&_culture",
    label: "Arts & Culture",
    symbol: {
      type: "simple-marker",
      color: "#ffc730",
      size: "10px"
    }
  },{
    value: "auto",
    label: "Auto",
    symbol: {
      type: "simple-marker",
      color: "#144d59",
      size: "10px"
    }
  },{
    value: "food_+_beverage",
    label: "Food + Beverage",
    symbol: {
      type: "simple-marker",
      color: "#2c6954",
      size: "10px"
    }
  },{
    value: "hair_body_&_beauty",
    label: "Hair, Body & Beauty",
    symbol: {
      type: "simple-marker",
      color: "#ed9310",
      size: "10px"
    }
  },{
    value: "health_&_medicine",
    label: "Health & Medicine",
    symbol: {
      type: "simple-marker",
      color: "#8c213f",
      size: "10px"
    }
  },{
    value: "it_&_tech_hardware+software_",
    label: "IT & Tech",
    symbol: {
      type: "simple-marker",
      color: "#102432",
      size: "10px"
    }
  },{
    value: "legal",
    label: "Legal",
    symbol: {
      type: "simple-marker",
      color: "#a64f1b",
      size: "10px"
    }
  },{
    value: "management",
    label: "Management",
    symbol: {
      type: "simple-marker",
      color: "#18382e",
      size: "10px"
    }
  },{
    value: "non_profit_organization",
    label: "Non Profit Organization",
    symbol: {
      type: "simple-marker",
      color: "#b31515",
      size: "10px"
    }
  },{
    value: "religious",
    label: "Religious",
    symbol: {
      type: "simple-marker",
      color: "#4a0932",
      size: "10px"
    }
  }]
}


// Initializing FeatureLayer
  const featureLayer = new FeatureLayer({
    title: "Black-owned Businesses",
    url: url,
    copyright: "BGMAPP",
    popupTemplate: template,
    renderer: uvrRenderer
  });

  const map = new Map({
    // basemap: "arcgis-topographic", // Basemap layer service
    basemap: "dark-gray", // Basemap layer service
    layers: [featureLayer], //add the layer to the map
  });

  const view = new MapView({
    extent: {
      xmin: -118.98364392089809,
      ymin: 33.64236255586565,
      xmax: -117.5073560791019,
      ymax: 34.4638389963474,
      spatialReference: 4326,
    },
    map: map,
    // center: [-118.805, 34.027], // Longitude, latitude
    // zoom: 12, // Zoom level
    container: "viewDiv", // Div element
  });


  const legend = new Legend ({
    view: view,
    container: "legendDiv"
  })

  const expand = new Expand({
    view: view,
    content: document.getElementById("legendDiv"),
    expanded: true
  })

  view.ui.add(expand, "top-right")
});
