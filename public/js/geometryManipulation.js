function createMeshForSelection(viewer) {
  const sceneId = 'foo';
  if (!viewer.overlays.hasScene(sceneId)) {
    viewer.overlays.addScene(sceneId);
  }
  const tree = viewer.model.getInstanceTree()
  let material = new THREE.MeshBasicMaterial({
    color: 0xff0000, wireframe: true
  });
  viewer.getSelection().forEach((dbId) => {
    tree.enumNodeFragments(dbId, (fragId) => {
      const proxy = viewer.impl.getRenderProxy(viewer.model, fragId);
      proxy.meshProxy = new THREE.Mesh(proxy.geometry, material);
      proxy.meshProxy.matrix.copy(proxy.matrixWorld);
      proxy.meshProxy.matrixWorldNeedsUpdate = true;
      proxy.meshProxy.matrixAutoUpdate = false;
      proxy.meshProxy.frustumCulled = false;
      viewer.impl.addOverlay(sceneId, proxy.meshProxy);
      /*    const mat = viewer.model.getFragmentList().getMaterial(fragId);
            const geom = viewer.model.getFragmentList().getGeometry(fragId);
            let mesh = new THREE.Mesh(geom, material);
            viewer.overlays.addMesh(mesh, sceneId);
            //viewer.model.getFragmentList().setMaterial(fragId, mat);*/
    }, true);
  });
  viewer.impl.invalidate(true);
}

function updateMaterial(viewer) {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide, reflectivity: 0.0,
    flashShading: true, transparent: true,
    opacity: 0.5, color: 0x73ceff
  });
  viewer.impl.matman().addMaterial('dummyMaterial', material);
  const tree = viewer.model.getInstanceTree();
  viewer.getSelection().forEach((dbId) => {
    tree.enumNodeFragments(dbId, (fragId) => {
      viewer.model.getFragmentList().setMaterial(fragId, material);
      const fragProxy = viewer.impl.getFragmentProxy(
        this.viewer.model, fragId);
      fragProxy.updateAnimTransform();
    }, true);
  });
  viewer.impl.invalidate(true);
}

function translateSelection(viewer, position) {
  transformSelection(viewer, { position: position });
}

function transformSelection(viewer, transforms) {
  function getTransform(fragProxy) {
    const matrix = new THREE.Matrix4();
    fragProxy.getWorldMatrix(matrix);
    fragProxy.position = new THREE.Vector3();
    fragProxy.quaternion = new THREE.Quaternion();
    fragProxy.scale = new THREE.Vector3();
    matrix.decompose(fragProxy.position,
                     fragProxy.quaternion,
                     fragProxy.scale);
  }
  
  const tree = viewer.model.getInstanceTree();
  viewer.getSelection().forEach((dbId) => {
    tree.enumNodeFragments(dbId, (fragId) => {
      const fragProxy = viewer.impl.getFragmentProxy(viewer.model, fragId);
      getTransform(fragProxy);
      fragProxy.position = transforms.position || fragProxy.position;
      fragProxy.quaternion = transforms.quaternion || fragProxy.selection;
      fragProxy.scale = transforms.scale || fragProxy.scale;
      fragProxy.updateAnimTransform();
      viewer.impl.sceneUpdated(true);
    });
  });
}
