require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/FeatureTable",
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  Legend,
  Expand,
  FeatureTable
) {
  esriConfig.apiKey =
    "AAPK0dc236a37148458583b633e74790fb25s2jkA3Luv6rWUCl8U_PsMln5w_yQvw8xhRDVI95xThChjH1Tp8hCcDZZmF1e6kCB";

  const url =
    "https://services9.arcgis.com/q5uyFfTZo3LFL04P/arcgis/rest/services/survey123_0954ef4c3eb74d9989a91330c7740a9f/FeatureServer/0";

  // Popup template
  const template = {
    title: "{Name}",
    lastEditInfoEnabled: false,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Address",
            label: "Address",
          },
          {
            fieldName: "Industry",
            label: "Industry",
          },
        ],
      },
      {
        type: "text",
        text: "<b>{expression/has-website}</b> <a href={expression/website-expr}>{expression/website-expr}</a>",
      },
    ],
    expressionInfos: [
      {
        name: "website-expr",
        title: "Website: ",
        expression: "IIF(!IsEmpty($feature.Website), $feature.Website, null)",
      },
      {
        name: "has-website",
        expression:
          'IIf(!IsEmpty($feature.Website), "Website: ", "No website found for this business")',
      },
    ],
  };

  const uvrRenderer = {
    type: "unique-value",
    field: "Industry",
    defaultSynbol: {
      type: "simple-marker",
      color: "#b2b2b2",
      size: "10px",
    },
    uniqueValueInfos: [
      {
        value: "accessories_&_clothing",
        label: "Accessories & Clothing",
        symbol: {
          type: "simple-marker",
          color: "#d9351a",
          size: "10px",
        },
      },
      {
        value: "arts_&_culture",
        label: "Arts & Culture",
        symbol: {
          type: "simple-marker",
          color: "#ffc730",
          size: "10px",
        },
      },
      {
        value: "auto",
        label: "Auto",
        symbol: {
          type: "simple-marker",
          color: "#144d59",
          size: "10px",
        },
      },
      {
        value: "food_+_beverage",
        label: "Food + Beverage",
        symbol: {
          type: "simple-marker",
          color: "#2c6954",
          size: "10px",
        },
      },
      {
        value: "hair_body_&_beauty",
        label: "Hair, Body & Beauty",
        symbol: {
          type: "simple-marker",
          color: "#ed9310",
          size: "10px",
        },
      },
      {
        value: "health_&_medicine",
        label: "Health & Medicine",
        symbol: {
          type: "simple-marker",
          color: "#8c213f",
          size: "10px",
        },
      },
      {
        value: "it_&_tech_hardware+software_",
        label: "IT & Tech",
        symbol: {
          type: "simple-marker",
          color: "#102432",
          size: "10px",
        },
      },
      {
        value: "legal",
        label: "Legal",
        symbol: {
          type: "simple-marker",
          color: "#a64f1b",
          size: "10px",
        },
      },
      {
        value: "management",
        label: "Management",
        symbol: {
          type: "simple-marker",
          color: "#18382e",
          size: "10px",
        },
      },
      {
        value: "non_profit_organization",
        label: "Non Profit Organization",
        symbol: {
          type: "simple-marker",
          color: "#b31515",
          size: "10px",
        },
      },
      {
        value: "religious",
        label: "Religious",
        symbol: {
          type: "simple-marker",
          color: "#4a0932",
          size: "10px",
        },
      },
      // {
      //   value: "other",
      //   label: "Other",
      //   symbol: {
      //     type: "simple-marker",
      //     color: "d9351a",
      //     size: "10px",
      //   },
      // },
    ],
  };

  // Initializing FeatureLayer
  const featureLayer = new FeatureLayer({
    title: "Black-owned Businesses",
    // url is data
    url: url,
    copyright: "BGMAPP",
    popupTemplate: template,
    renderer: uvrRenderer,
  });

  const map = new Map({
    // Basemap layer service
    basemap: "arcgis-topographic", 
    // Add the layer to the map
    layers: [featureLayer], 
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

  const legend = new Legend({
    view: view,
    container: "legendDiv",
  });

  const expand = new Expand({
    view: view,
    content: document.getElementById("legendDiv"),
    expanded: true,
  });



  // Setting up client-side filtering
  view.whenLayerView(featureLayer).then((layerView) => {
    const field = "Industry";

    // fires every time a different option is selected from dropdown
    const filterSelect = document.getElementById("filter");

    filterSelect.addEventListener("input", (event) => {
      let filterExpression;

      // the "all" option
      if (event.target.value === "1=1") {
        filterExpression = event.target.value;

      //   // show all features with all other industries not included in the UniqueValueRenderer.uniqueValuesInfo
      // } else if (event.target.value === "other") {
      //   filterExpression = generateOtherSQLString(field);
        
        //filter by selected industry
      } else {
        filterExpression = `${field}='${event.target.value}'`;
      }

      // apply the filter on the client-side layerView
      layerView.filter = {
        where: filterExpression,
      };
    });
  });

  // generates a SQL string for all other industries not included in the UniqueValueRenderer.uniqueValuesInfo
  // function generateOtherSQLString(field) {
  //   let sqlString = "";

  //   //loop through and exclude all of these industries
  //   uvrRenderer.uniqueValueInfos.forEach((valueInfo) => {
  //     sqlString += `${field} <> '${valueInfo.value}' AND `;
  //   });

  //   // cut out the last `AND` string from the final sql string since the loop above adds one at the end
  //   let lastStrIndex = sqlString.lastIndexOf(`AND`);
  //   sqlString = sqlString.substring(0, lastStrIndex);
  //   return sqlString;
  // }

  // TODO Add the feature table widget
  view.when(() => {
    //create the feature table
    const featureTable = new FeatureTable({
      // required for feature highlight to work
      view: view,
      layer: featureLayer,
      // these are the fields that will display as columns
      fieldConfigs: [
        {
          name: "Name",
          label: "Business Name",
          direction: "asc",
        },
        {
          name: "Address",
          label: "Address",
        },
        {
          name: "Website",
          label: "Website",
        },
        {
          name: "Industry",
          label: "Industry",
        },
        {
          name: "Phone",
          label: "Phone number",
        },
      ],
      //saying where you want it to be displayed
      container: document.getElementById("tableDiv"),
    });
    // query for the selected features and zoom to them
    // featureTable.on("selection-change", zoomToSelectFeatures);
  });

  // // this function zooms into the selected features features based off the records selected or deselected from the FeatureTable
  // function zoomToSelectFeatures(event) {
  //   //check if rom is selcted or deselected
  //   if (event.added.length > 0) {
  //     //row was selected
  //     currentSelectedOIDs.push(event.added[0].objectId);
  //   } else {
  //     //row was deselected
  //     // remove the objectId from the currentSelectedOIds
  //     event.removed.forEach((feature, index) => {
  //       let deleteIndex = currentSelectedOIDs.indexOf(
  //         event.removed[index].objectId
  //       );
  //       currentSelectedOIDs.splice(deleteIndex, 1);
  //     });
  //   }
  //   // only perform the query and zoom to the extent if the currentSelectedOIDs is greater than 0
  //   if (currentSelectedOIDs.length > 0) {
  //     const query = featureLayer.createQuery();
  //     query.objectIds = currentSelectedOIDs;
  //     query.returnGeometry = true;
  //   }
  // }
  view.ui.add(expand, "bottom-right");
  view.ui.add(expand, "top-right");
});
