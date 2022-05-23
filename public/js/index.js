window.addEventListener('load', initializeViewer, false);

function initializeViewer() {
  let options = {
    api: 'derivativeV2',
    env: 'AutodeskProduction',
    endpoint: '/api/forge/viewerproxy',
    shouldInitializeAuth: false,
    memory: {
      limit: 5000
    },
    getAccessToken: function(onTokenReady) {
      fetch('/api/forge/auth/token')
        .then(function(response) {
          response.json()
            .then(function(token) {
              onTokenReady(token.access_token, token.expires_in);
            });
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  Autodesk.Viewing.Initializer(options, function() {
    let htmlDiv = document.getElementById('forgeViewer');
    viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);      
    let status = viewer.start();
    if (status > 0) {
      console.error('Failed to initialise the Viewer: WebGL not supported.');
    } else {
      console.info('Initialization has completed successfully.');
      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);
    }
  });


  // LOADING A MODEL
  //const modelUrn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9obGlvX3Jldml0X21vZGVscy9yYWNfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0';
  const urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9obGlvX3Jldml0X21vZGVscy9yYWNfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0'
  const modelUrn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9obGlvX3Jldml0X21vZGVscy9yYWNfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0'
  let doc;
  let dataVizExt;
  fetch('http://localhost:3000/api/forge/modelderivative/' + urn + '/manifest')
    .then((res) => {
      if (res.ok) {
        res.json()
          .then((body) => {
            doc = new Autodesk.Viewing.Document(body, modelUrn);
            doc.downloadAecModelData();
            const manifestNodes = doc.getRoot().search({
              type: 'geometry', role: '3d', isMasterView: true });
            if (manifestNodes.length > 0) {
              viewer.loadDocumentNode(doc, manifestNodes[0]);
              viewer.loadExtension('Autodesk.DocumentBrowser');
              viewer.loadExtension('Autodesk.DataVisualization')
                .then((dataViz) => {
                  dataVizExt = dataViz;
                });
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    })
    .catch(function (error) {
      console.error(error);
    });  
}

/*    Autodesk.Viewing.Document.load(
      modelUrn, onDocumentLoadSuccess, onDocumentLoadFailure);

      function onDocumentLoadSuccess(doc) {
      const bubbleNodeRoot = doc.getRoot();
      const views = bubbleNodeRoot.getNamedViews();      
      // getDefaultGeometry(searchMasterView, loadLargestView);
      let defaultModel = doc.getRoot().getDefaultGeometry(true);
      viewer.loadExtension('Autodesk.DocumentBrowser');
      doc.downloadAecModelData();
      viewer.loadDocumentNode(doc, defaultModel);
      }

      function onDocumentLoadFailure() {
      console.error('Failure loading a model...');
      }*/

// event.model
async function onModelLoaded(event) {
  const viewer = event.target;
  //visualizeRooms(viewer);
}

