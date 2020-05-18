const aStar = (grid, start, end, ROW, COL) => {
    const visitedNodes = []
    const unvisitedNodes = []
    start.distance = 0
    start.totalDistance = Heuristic(start.row, start.col, end.row, end.col)
    unvisitedNodes.push(start)
    while(unvisitedNodes.length){
        sortNodesByDistance(unvisitedNodes)
        const current = unvisitedNodes.shift()

        if (current === end) return visitedNodes
        if (current.isWall) continue
        if (current.distance === Infinity) return visitedNodes
        current.isVisited = true
        visitedNodes.push(current)
        updateUnvisitedNeighbors(current, grid, end, unvisitedNodes, ROW, COL)
    }

    return visitedNodes
}



const updateUnvisitedNeighbors = (node, grid, end, unvisitedNodes, ROW, COL) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, ROW, COL)

    for (const neighbor of unvisitedNeighbors) {
        let tempDist = node.distance + 1
        if(unvisitedNodes.includes(neighbor)){
            if (tempDist < neighbor.distance) {
                neighbor.distance = tempDist
                neighbor.heuristic = Heuristic(node.row, node.col, end.row, end.col)
                neighbor.totalDistance = node.distance + neighbor.heuristic
                neighbor.previousNode = node
            }
        }
        else {
            neighbor.distance = tempDist
            neighbor.heuristic = Heuristic(node.row, node.col, end.row, end.col)
            neighbor.totalDistance = node.distance + neighbor.heuristic
            neighbor.previousNode = node
            unvisitedNodes.push(neighbor)
        }
    }

}

const getUnvisitedNeighbors = (node, grid, ROW, COL) => {
    const neighbors = []
    const {col, row} = node

    if (col > 0)  neighbors.push(grid[row][col - 1])
    if (col < COL-1)  neighbors.push(grid[row][col + 1])
    if (row > 0)  neighbors.push(grid[row - 1][col])
    if (row < ROW-1)  neighbors.push(grid[row + 1][col])
    // if (col > 0 && row > 0) neighbors.push(grid[row - 1][col - 1])
    // if (col < COL-1 && row < ROW-1)  neighbors.push(grid[row + 1][col + 1])
    // if (col < COL-1 && row > 0)  neighbors.push(grid[row - 1][col + 1])
    // if (col > 0 && row < ROW-1)  neighbors.push(grid[row + 1][col - 1])
    
    return neighbors.filter(neighbor => !neighbor.isVisited)
}


const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance)
}


const Heuristic = (currentRow, currentCol, targetRow, targetCol) => {
    let row =  Math.abs( targetRow - currentRow)
    let col = Math.abs( targetCol - currentCol)
    let dist = row + col
    return dist
}


// const Heuristic = (currentRow, currentCol, targetRow, targetCol) => {
//     let row =  Math.pow(Math.abs( targetRow - currentRow), 2)
//     let col = Math.pow(Math.abs( targetCol - currentCol), 2)
//     let dist = Math.sqrt(row + col)
  
//     return dist
// }


 const getNodesInShortestPathOrder = (finishNode) => {
    const nodesInShortestPathOrder = []
    let currentNode = finishNode
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousNode
    }
    return nodesInShortestPathOrder
}


export {aStar}

export {getNodesInShortestPathOrder}