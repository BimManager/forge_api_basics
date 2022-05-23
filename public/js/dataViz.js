async function visualizeRooms(viewer) {
  const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization');
  const modelInfo = new Autodesk.DataVisualization
        .Core.ModelStructureInfo(viewer.model);
  const devices = await createDevices(modelInfo);
  const viewableData = new Autodesk.DataVisualization.Core.ViewableData();
  viewableData.spriteSize = 16;
  const sprites = createSprites(devices);
  sprites.forEach((sprite) => viewableData.addViewable(sprite));
  await viewableData.finish();
  dataVizExt.addViewables(viewableData);
  await createHeatmap(viewer.model, modelInfo, devices);
}

function createDevices(modelInfo) {
  return new Promise((resolve, reject) => {
    modelInfo.getRoomList()
      .then((rooms) => {
        const devices = [];
        rooms.forEach((room) => {
          const centroid = room.bounds.getCenter();
          devices.push({
            id: room.name, 
            roomId: room.id,
            position: { x: centroid.x, y: centroid.y, z: centroid.z },
            sensorTypes: ['temperature', 'humidity'],
            type: 'combo'
          });
        });
        resolve(devices);
      });
  });
}

function createSprites(devices) {
  const sprites = [];
  let id = 1;
  devices.forEach((device) => {
    sprites.push(
      new Autodesk.DataVisualization.Core.SpriteViewable(
        device.position,
        new Autodesk.DataVisualization.Core.ViewableStyle(
          Autodesk.DataVisualization.Core.ViewableType.SPRITE,
          new THREE.Color(0xffffff),
          'https://d2zqnmauvnpnnm.cloudfront.net/assets-1/images/thermometer.svg'
        ),
        id++)
    );
  });
  return sprites;
}

async function createHeatmap(model, modelInfo, devices) {
  const heatmapData = await modelInfo.generateSurfaceShadingData(devices);
  await dataVizExt.setupSurfaceShading(model, heatmapData);
  /*{
    type: 'PlanarHeatmap'
    });*/
  dataVizExt.registerSurfaceShadingColors(
    'temperature', [0xff0000, 0x00ff00, 0x00000ff]);
  function getSensorValue(device, sensorType) {
    return Math.random();
  }
  const levelRooms = await modelInfo.getLevelRoomsMap();
  dataVizExt.renderSurfaceShading(
    Object.keys(levelRooms), 'temperature', getSensorValue);
  viewer.isolate(devices.map((device) => device.roomId));
  setInterval(() => {
    dataVizExt.updateSurfaceShading(getSensorValue);
  }, 2000);
}
