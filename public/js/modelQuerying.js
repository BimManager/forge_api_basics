function findAllInstancesByTypeUniqueId(propertyDb, uniqueId) {
  function userFunction(pdb, uniqueId) {
    const externalIdDbId = pdb.getExternalIdMapping();
    const dbId = externalIdDbId[uniqueId];
    const dbIds = [];
    if (dbId) {
      const item  = pdb.getObjectProperties(dbId);
      item.properties.forEach(function(property) {
        if (11 === property.type) dbIds.push(property.displayValue);
      });
    }
    return dbIds;
  }
  propertyDb.executeUserFunction(userFunction, uniqueId)
    .then(function(dbIds) {
      viewer.isolate(dbIds);
      viewer.fitToView(dbIds);
    })
    .catch(function(error) {
      console.error(error);
    });
}



function searchModel(model, text) {
  const tree = model.getInstanceTree();
  return new Promise(function(resolve, reject) {
    const nodes = [];
    model.search(text, (dbIds) => {
      dbIds.forEach((dbId) => {
        model.getProperties(dbId, (props) => {
          console.log(props);
        });
        nodes.push(dbId);
      });
      resolve(nodes);
    }, (error) => {
      reject(error);
    });
  });
}

function traverseAllNodes(viewer) {
  const tree = viewer.model.getInstanceTree();
  tree.enumNodeChildren(tree.getRootId(), (nodeId) => {
    console.log(tree.getNodeName(nodeId));
    tree.enumNodeFragments(nodeId, (fragId) => {
      const fragProxy = viewer.impl.getRenderProxy(viewer.model, fragId);
      console.log(fragProxy);
    }, true);
  }, true);
}
