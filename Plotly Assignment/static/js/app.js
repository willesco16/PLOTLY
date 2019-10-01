// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a function that builds the metadata panel:
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(selection) {
    console.log(selection);

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");    

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(selection).forEach(([key, value]) => {
      metadata.append("h6").text(`${key}: ${value}`);
    });
 });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a function that builds the plots:
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(selection) {
    console.log(selection);

    const otuIds = selection.otu_ids;
    const sampleValues = selection.sample_values;
    const otuLabels = selection.otu_labels;


    // Build a Bubble Chart using the sample data
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      }
    }];
    
    var bubbleLayout = {
      title: 'Bacteria',
      margin: {t: 0}
    };
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a Pie Chart
    var pieData = [{
      values: sampleValues.slice(0, 10),
      labels: otuIds.slice(0, 10),
      hoverinfo: otuLabels,
      type: "pie"
    }];

    var pieLayout = {
      margin: {t: 0, 1: 0}
    };
  
    Plotly.plot("pie", pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
