module.exports = extractPath;

function extractPath(shortestPaths, source, destination) {
  if (shortestPaths[source].predecessor !== undefined) {
    throw new Error("Invalid source vertex");
  }
  if (shortestPaths[destination].predecessor === undefined && destination !== source) {
    throw new Error("Invalid destination vertex");
  }

  return {
    weight: shortestPaths[destination].distance,
    path: runExtractPath(shortestPaths, source, destination)
  };
}

function runExtractPath(shortestPaths, source, destination) {
  var path = [];
  var currentNode = destination;

  while(currentNode !== source) {
    path.push(currentNode);
    currentNode = shortestPaths[currentNode].predecessor;
  }
  path.push(source);
  return path.reverse();
}
