import {aStar} from "./algo/astar.js";
import {getNodesInShortestPathOrder} from "./algo/astar.js";

const GRID = document.querySelector(".grid")
const BTNS = document.querySelector(".buttons")
const FIND = document.querySelector(".find-path")
const RANDWALLS = document.querySelector(".random-walls")
const CLR = document.querySelector(".clear")
const ROW = 41, COL = 91



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


const createNodesDOM = () => {
    nodesInitialize()
    let START_ROW = 20
    let START_COL = 10
    let END_ROW = 20
    let END_COL = 83
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
                            isDragging = true
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
                            START_ROW = 23
                            START_COL = 10
                            END_ROW = 23
                            END_COL = 84
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

const getNodes = () => {
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








const speed = 10

const animateAStar = (visitedNodesInOrder, nodesInShortestPathOrder, startNode, endNode) => {
    GRID.style.pointerEvents = "none"
    BTNS.style.pointerEvents = "none"
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder, startNode, endNode)
        }, speed * i)
        }
        setTimeout(() => {
        const node = visitedNodesInOrder[i]
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node-visited'
        document.getElementById(`node-${startNode.row}-${startNode.col}`).className = 'isStart'
        document.getElementById(`node-${endNode.row}-${endNode.col}`).className = 'isEnd'
        }, speed * i)
    }

}


const animateShortestPath = (nodesInShortestPathOrder, startNode, endNode) => {
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
        const node = nodesInShortestPathOrder[i]
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node-shortest-path'
        document.getElementById(`node-${startNode.row}-${startNode.col}`).className = 'isStart'
        document.getElementById(`node-${endNode.row}-${endNode.col}`).className = 'isEnd'

        if(i === nodesInShortestPathOrder.length-1) {
            GRID.style.pointerEvents = "auto"
            BTNS.style.pointerEvents = "auto"
        }
        }, speed * i)
    }
}

const clearPath = () => {
    for(let row = 0; row < ROW; row++){
        for(let col = 0; col < COL; col++){
            const nodesDOM = document.getElementById(`node-${row}-${col}`)
            if (nodesDOM.className === 'node-visited') nodesDOM.className = 'node'
            if (nodesDOM.className === 'node-shortest-path') nodesDOM.className = 'node'
        }
    }
}

const clearWalls = () => {
    for(let row = 0; row < ROW; row++){
        for(let col = 0; col < COL; col++){
            const nodesDOM = document.getElementById(`node-${row}-${col}`)
            if (nodesDOM.className === 'node-wall') nodesDOM.className = 'node'
        }
    }
}

const randomWalls = () => {
    for(let row = 0; row < ROW; row++){
        setTimeout(() => {
        for(let col = 0; col < COL; col++){
            setTimeout(() => {
                const nodesDOM = document.getElementById(`node-${row}-${col}`)
                if (Math.floor(Math.random()*4) === 0 && nodesDOM.className === 'node') nodesDOM.className = 'node-wall'
            },speed * col)
        }
    },speed * row)
    }
}

const findPath = () => {
    const {node, startNode, endNode} = getNodes()
    const visitedNodesInOrder = aStar(node, startNode, endNode, ROW, COL)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode)
    animateAStar(visitedNodesInOrder, nodesInShortestPathOrder, startNode, endNode)
}



const Main = () => {
    createNodesDOM()
    FIND.onclick = () =>{
        clearPath() 
        findPath()
    }
    RANDWALLS.onclick = () => {
        clearPath()
        clearWalls()
        randomWalls()
    }
    CLR.onclick = () => {
        clearWalls()
        clearPath()
    }
}


window.onload = Main()