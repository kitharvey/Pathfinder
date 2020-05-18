import {aStar} from "./algo/astar.js";
import {getNodesInShortestPathOrder} from "./algo/astar.js";
import {createNodesDOM, getNodes} from './board.js'
const GRID = document.querySelector(".grid")
const BTNS = document.querySelector(".buttons")
const FIND = document.querySelector(".find-path")
const RANDWALLS = document.querySelector(".random-walls")
const CLR = document.querySelector(".clear")
export const ROW = 41, COL = 91
const speed = 10

const animateAStar = (visitedNodesInOrder, nodesInShortestPathOrder, startNode, endNode) => {
    GRID.style.pointerEvents = "none"
    BTNS.style.pointerEvents = "none"
    for (let i = 0; i <= visitedNodesInOrder.length-1; i++) {
        if (i === visitedNodesInOrder.length-1) {
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