function createSquareCoordinates() {
  let array = [];
  let xAxis = 0;
  for (let i = 0; i < 8; i++) {
    for (let yAxis = 0; yAxis < 8; yAxis++) {
      array.push(xAxis + "" + yAxis);
    }
    xAxis++;
  }
  return array;
}

function addEdgesToGameBoard() {
  let coordinates = createSquareCoordinates();
  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    const moves = getMoves([parseInt(coordinate[0]), parseInt(coordinate[1])]);
    for (let j = 0; j < moves.length; j++) {
      const move = moves[j];
      gameBoard.addEdge(coordinate, move[0] + "" + move[1]);
    }
  }
}


function getMoves(coordinate) {
  const upLeft = [coordinate[0] - 1, coordinate[1] + 2];
  const upRight = [coordinate[0] + 1, coordinate[1] + 2];

  const downLeft = [coordinate[0] - 1, coordinate[1] - 2];
  const downRight = [coordinate[0] + 1, coordinate[1] - 2];

  const leftUp = [coordinate[0] - 2, coordinate[1] + 1];
  const leftDown = [coordinate[0] - 2, coordinate[1] - 1];

  const rightUp = [coordinate[0] + 2, coordinate[1] + 1];
  const rightDown = [coordinate[0] + 2, coordinate[1] - 1];
  const moves = [
    upLeft,
    upRight,
    downLeft,
    downRight,
    leftUp,
    leftDown,
    rightUp,
    rightDown
  ];
  const sortedMoves = [];
  moves.forEach((coordinate) => {
    if (
      coordinate[0] <= 7 &&
      coordinate[0] >= 0 &&
      coordinate[1] <= 7 &&
      coordinate[1] >= 0
    ) {
      sortedMoves.push(coordinate);
    }
  });
  return sortedMoves;
}

//With the help of codevolution on youtube I was able to get a much better grasp on how a graph works.
function Graph() {
  let adjacencyList = [];

  function addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = new Set();
    }
  }

  function removeVertex(vertex) {
    if (!this.adjacencyList[vertex]) return;
    for (let adjacentVertex of this.adjacencyList[vertex]) {
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  function addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }

    this.adjacencyList[vertex1].add(vertex2);
    this.adjacencyList[vertex2].add(vertex1);
  }

  function hasEdge(vertex1, vertex2) {
    return (
      this.adjacencyList[vertex1].has(vertex2) &&
      this.adjacencyList[vertex2].has(vertex1)
    );
  }

  function removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].delete(vertex2);
    this.adjacencyList[vertex2].delete(vertex1);
  }

  function display() {
    for (let vertex in this.adjacencyList) {
      console.log(vertex + " -> " + [...this.adjacencyList[vertex]]);
    }
  }
  return {
    adjacencyList,
    addVertex,
    addEdge,
    hasEdge,
    removeEdge,
    removeVertex,
    display
  };
}

function bfs(root, target) {
  const queue = [root];
  const visited = [root];
  let current;
  while (queue.length != 0) {
    current = queue[0];

    queue.shift();
    let adjacentList = [...gameBoard.adjacencyList[current]];

    for (let i = 0; i < adjacentList.length; i++) {
      let adjacentVertex = adjacentList[i];

      if (adjacentVertex == target) {
        gameBoard.adjacencyList[adjacentVertex].previous = current;
        return current;
      }
      if (!visited.includes(adjacentVertex)) {
        gameBoard.adjacencyList[adjacentVertex].previous = current;
        visited.push(adjacentVertex);
        queue.push(adjacentVertex);
      }
    }
  }

  return current;
}

const gameBoard = Graph();
addEdgesToGameBoard();

function buildPath(endPoint, startPoint) {
  const path = [endPoint];
  while (endPoint != startPoint) {
    let previous = gameBoard.adjacencyList[endPoint].previous;
    path.push(previous);
    endPoint = previous;
  }
  return path.reverse();
}

function knightMoves(startPoint, endPoint) {
  bfs(startPoint, endPoint);
  const path = buildPath(endPoint, startPoint);
  return path;
}

function displayMessage(path) {
  let displayPath = [];
  console.log(`=> You made it in ${path.length - 1} moves! Here's your path:`);
  for (let i = 0; i < path.length; i++) {
    let move = path[i];
    displayPath.push([+move[0], +move[1]]);
  }
  console.log(...displayPath);
}

displayMessage(knightMoves("33", "43"));
displayMessage(knightMoves("77", "00"));
