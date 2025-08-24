import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"

import { TURNS} from "./constants.js"
import { checkEndGame, checkWinnerFrom } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { resetGameStorage, saveGameToStorage } from "./logic/storage/index.js"



function App() {
  
  const [board, setBoard] = useState( ()=> { 
    const boardFromStorage =window.localStorage.getItem('board')

    return boardFromStorage
    ? JSON.parse(boardFromStorage)
    : Array(9).fill(null)
  })


  const [turn, setTurn]  =useState(()=>{
    const turnFromeStorage = window.localStorage.getItem('turn')

    return turnFromeStorage ?? TURNS.X
  })

  const [winner, setWinner]= useState(null)

  

  const resetGame =()=>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  
  const updateBoard=(index)=>{

    if (board[index]|| winner) return

    const newBoard = [... board]
    newBoard[index]=turn
    setBoard(newBoard)
    const newTurn = turn===TURNS.X? TURNS.O: TURNS.X
    setTurn(newTurn)

    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    const newWinner =checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    }else if (checkEndGame(newBoard)) {

      setWinner(false)
      
    }
  }

  return (
    <main className="board" >

      <h1>3 en raya</h1>
      <button onClick={resetGame} >Resetear el juego</button>
      <section  className="game" >
        {

          board.map((square, index)=>{
            return (
              <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
          
        }
      </section>
      <section className="turn">
        <Square isSelected={turn===TURNS.X} >{TURNS.X}</Square>
        <Square isSelected={turn===TURNS.O} >{TURNS.O }</Square>
        
      </section>
      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
