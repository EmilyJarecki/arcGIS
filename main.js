require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/FeatureTable",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/Graphic",
  "esri/rest/route",
  "esri/rest/support/RouteParameters",
  "esri/rest/support/FeatureSet",
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  Legend,
  Expand,
  FeatureTable,
  Locate,
  Search,
  Graphic,
  route,
  RouteParameters,
  FeatureSet
) {

  esriConfig.apiKey =
    "AAPK0dc236a37148458583b633e74790fb25s2jkA3Luv6rWUCl8U_PsMln5w_yQvw8xhRDVI95xThChjH1Tp8hCcDZZmF1e6kCB";

  const url =
    "https://services9.arcgis.com/q5uyFfTZo3LFL04P/arcgis/rest/services/survey123_0954ef4c3eb74d9989a91330c7740a9f/FeatureServer/0";

  const routeUrl =
    "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

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

  // Beginning view
  const view = new MapView({
    extent: {
      xmin: -118.98364392089809,
      ymin: 33.64236255586565,
      xmax: -117.5073560791019,
      ymax: 34.4638389963474,
      spatialReference: 4326,
    },
    map: map,

    // Div element
    container: "viewDiv",
  });

  const legend = new Legend({
    view: view,

    // Div element
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

    // Fires every time a different option is selected from dropdown
    const filterSelect = document.getElementById("filter");

    filterSelect.addEventListener("input", (event) => {
      let filterExpression;

      // This is the "all" option
      if (event.target.value === "1=1") {
        filterExpression = event.target.value;

        // Filter by selected industry
      } else {
        filterExpression = `${field}='${event.target.value}'`;
      }

      // Apply the filter on the client-side layerView
      layerView.filter = {
        where: filterExpression,
      };
    });
  });

  view.when(() => {

    // Create the feature table
    const featureTable = new FeatureTable({

      // Required for feature highlight to work
      view: view,
      layer: featureLayer,

      // These are the fields that will display as columns
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

      // Div element
      container: document.getElementById("tableDiv"),
    });
  });

  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
  });

  const search = new Search({

    // Add Search widget
    view: view,
  });

  // Add a click handler to add graphics to the view.
  view.on("click", function (event) {

    // Reference the addGraphic function
    // The first click will create the origin
    if (view.graphics.length === 0) {
      addGraphic("origin", event.mapPoint);

      // The second click will create the destination
    } else if (view.graphics.length === 1) {
      addGraphic("destination", event.mapPoint);

      // Call the route service
      getRoute();

      // Subsequent clicks will clear the graphics to define a new origin and destination
    } else {
      view.graphics.removeAll();
      view.ui.empty("bottom-left");
      addGraphic("origin", event.mapPoint);
    }
  });

  // Create an addGraphic function to display a white marker for the origin location and a black marker for the destination.
  function addGraphic(type, point) {
    const graphic = new Graphic({
      symbol: {
        type: "simple-marker",
        color: type === "origin" ? "white" : "black",
        size: "8px",
      },
      geometry: point,
    });

    // Add the graphic to the view.
    view.graphics.add(graphic);
  }

  // Create a getRoute function to add RouteParameters and pass in the point graphics.
  function getRoute() {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: view.graphics.toArray(),
      }),

      returnDirections: true,
    });

    route
      .solve(routeUrl, routeParams)
      .then((data) => {

        // Responsible for displaying the route on the map
        showRoutes(data.routeResults);

        // Responsible for displaying the directions associated with the route
        showDirections(data.routeResults[0].directions.features);
      })
      .catch((error) => {
        console.log(error);
      });

    // For each route, it sets the symbol property to define the appearance of the route line which is blue
    function showRoutes(routes) {
      routes.forEach((result) => {
        result.route.symbol = {
          type: "simple-line",
          color: [5, 150, 255],
          width: 3,
        };
        view.graphics.add(result.route, 0);
      });
    }

    // Takes in parametes "directions" which is an array of directions
    function showDirections(directions) {

      // This function generates HTML
      function showRouteDirections(directions) {

        // New div element
        const directionsList = document.createElement("ol");

        // Iterates over array, providing each element with it's own "number"
        directions.forEach((result, i) => {
          const direction = document.createElement("li");
          direction.innerHTML =
            result.attributes.text +

            //  If the length attribute of the result object is greater than 0, it appends the length in miles to the direction text
            (result.attributes.length > 0
              ? " (" + result.attributes.length.toFixed(2) + " miles)"
              : "");
          directionsList.appendChild(direction);
        });
        directionsElement.appendChild(directionsList);
      }

      // Styling properties added to new div
      const directionsElement = document.createElement("div");
      directionsElement.innerHTML = "<h3>Directions</h3>";
      directionsElement.classList =
        "esri-widget esri-widget--panel esri-directions__scroller directions";
      directionsElement.style.marginTop = "0";
      directionsElement.style.padding = "0 15px";
      directionsElement.style.minHeight = "365px";

      // Called to populate the directionsElement with the directions
      showRouteDirections(directions);

      view.ui.empty("bottom-left");

      // An Expand widget is created with the view as a parameter and the directionsElement as its content. It is set to be initially expanded and displayed as a floating panel
      view.ui.add(
        new Expand({
          view: view,
          content: directionsElement,
          expanded: true,
          mode: "floating",
        }),
        "bottom-left"
      );
    }
  }

  // Locations of where features will be located
  view.ui.add(search, "top-right"); 
  view.ui.add(locate, "top-left");
  view.ui.add(expand, "top-right");
});
