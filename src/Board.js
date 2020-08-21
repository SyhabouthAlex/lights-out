import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({ length: nrows }, (_, i) => 
      Array.from({ length: ncols }, (_, j) => (
        {
          coord: `${i}-${j}`, 
          lit: Math.random() < chanceLightStartsOn 
        })
      )
    );
  };

  function hasWon() {
    return board.every(row => row.every(cell => !cell.lit));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x].lit = !boardCopy[y][x].lit;
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      let copy = [...oldBoard];
      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, copy);
      if (y < nrows - 1) {
        flipCell(y + 1, x, copy);
      }
      if (y > 0) {
        flipCell(y - 1, x, copy);
      }
      if (x < ncols - 1) {
        flipCell(y, x + 1, copy);
      }
      if (x > 0) {
        flipCell(y, x - 1, copy);
      }
      // TODO: return the copy
      return copy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <h1>Congratulations! You won!</h1>
  }
  // make table board
  return (
    <table className="Board">
      <tbody>
      {board.map(row => <tr className="Board-row">{row.map(cell => <Cell flipCellsAroundMe={() => flipCellsAround(cell.coord)} isLit={cell.lit} key={cell.coord}/>)}</tr>)}
      </tbody>
    </table>
  )
}

export default Board;
