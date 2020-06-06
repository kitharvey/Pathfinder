import {ROW, COL} from './path.js'
const GRID = document.querySelector(".grid")

const createNode = (row,col) => {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        distance: Infinity,
        heuristic: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    }
}

const nodesInitialize = () => {
    const NODES = []
    for(let row = 0; row < ROW; row++){
        const NODESROW = []
        for (let col = 0; col < COL; col++) {
            const node = createNode(row, col)
            NODESROW.push(node)
        }
        NODES.push(NODESROW)
    }
    return NODES
}


export const createNodesDOM = () => {
    nodesInitialize()
    let START_ROW = 20
    let START_COL = 20
    let END_ROW = 20
    let END_COL = 50
    let isPressed, objectStatus, nodeStatus
    for(let row = 0; row < ROW; row++){
        const NODEROWS = document.createElement("div")
        NODEROWS.className = `node-row`
        NODEROWS.id = `node-row-${row}`
        for(let col = 0; col < COL; col++){
            const nodesDOM = document.createElement("div")
            nodesDOM.id =`node-${row}-${col}`
            nodesDOM.className = `node`
            if (row === START_ROW && col === START_COL) nodesDOM.className = 'isStart'
            else if (row === END_ROW && col === END_COL) nodesDOM.className = 'isEnd'
            nodesDOM.onmousedown = () => {      
                isPressed = true
                if(nodesDOM.className === 'isStart'){
                    objectStatus = nodesDOM.className
                }
                else if(nodesDOM.className === 'isEnd'){
                    objectStatus = nodesDOM.className
                }
        
                else if (objectStatus === undefined){
                    if(nodesDOM.className === 'node'  || nodesDOM.className === 'node-visited' || nodesDOM.className === 'node-shortest-path') {
                        nodesDOM.className = 'node-wall'
                    }
                    else if(nodesDOM.className === 'node-wall') {
                        nodesDOM.className = 'node'
                    }
                } 
            }
            nodesDOM.onmouseenter = () =>{
                if (isPressed){
                    if(objectStatus === undefined) {
                        if(nodesDOM.className === 'node' || nodesDOM.className === 'node-visited' || nodesDOM.className === 'node-shortest-path') nodesDOM.className = 'node-wall'
                        else if(nodesDOM.className === 'node-wall' && objectStatus === undefined) nodesDOM.className = 'node'
                    }


                    if(objectStatus != undefined) {
                        if(nodesDOM.className === 'node' || nodesDOM.className === 'node-wall' || nodesDOM.className === 'node-visited' || nodesDOM.className === 'node-shortest-path'){
                            nodeStatus = nodesDOM.className
                            nodesDOM.className = objectStatus
                            if(objectStatus === 'isStart'){
                                START_ROW = row
                                START_COL = col
                            }
                            else if(objectStatus === 'isEnd'){
                                END_ROW = row
                                END_COL = col
                            }
                        }
                        else if(nodesDOM.className === 'isStart' && objectStatus != undefined || nodesDOM.className === 'isEnd' && objectStatus != undefined ){
                            isPressed = false
                            objectStatus = undefined
                            nodeStatus = undefined
                            nodesDOM.className = 'node'
                            START_ROW = 20
                            START_COL = 20
                            END_ROW = 20
                            END_COL = 50
                            let startNode = document.getElementById(`node-${START_ROW}-${START_COL}`)
                            startNode.className = 'isStart'
                            let endNode = document.getElementById(`node-${END_ROW}-${END_COL}`)
                            endNode.className = 'isEnd'
                        }
                    }
                    
                }  
            }
            nodesDOM.onmouseout = () => {
                if (isPressed === true && objectStatus != undefined) {
                    if (nodeStatus === undefined){
                        nodesDOM.className = 'node'
                    }
                    else{
                        nodesDOM.className = nodeStatus
                    }
                } 
            }
            nodesDOM.onmouseup = () => {
                isPressed = false
                objectStatus = undefined
            }
            
            NODEROWS.appendChild(nodesDOM)
        }
        GRID.appendChild(NODEROWS)
    }
}

export const getNodes = () => {
    const node = nodesInitialize()
    let startNode, endNode
    for(let row = 0; row < ROW; row++){
        for(let col = 0; col < COL; col++){
            const nodesDOM = document.getElementById(`node-${row}-${col}`)
            if (nodesDOM.className === 'node-wall') node[row][col].isWall = true
            if (nodesDOM.className === 'isStart') {
                node[row][col].isStart = true
                startNode = node[row][col]
            }
            if (nodesDOM.className === 'isEnd') {
                node[row][col].isEnd = true
                endNode = node[row][col]
            }
        }
    }
    return {node, startNode, endNode}
}