import React, {useEffect, useState} from 'react';
import NumberDisplay from '../NumberDisplay';
import {generateCells, clickedEmptyCell, clickedBomb} from '../../utils';
import Button from '../Button';
import {Cell, Face, CellState, CellValue} from '../../types';
import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [flagcnt, setFlagcnt] = useState<number>(45);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  useEffect(() => {
    const handleMousedown = (): void => {
      setFace(Face.oh);
    }
    const handleMouseup = (): void => {
      setFace(Face.smile);
    }
    window.addEventListener('mousedown', handleMousedown);
    window.addEventListener('mouseup', handleMouseup);

    return () => {
      window.removeEventListener('mousedown', handleMousedown);
      window.removeEventListener('mouseup', handleMouseup);
    }

  }, []);

  const handleCellClick = (rowPar: number, colPar: number) => (): void => {
    let tmp = cells.slice();
    if (!live) {
      let isABomb;
      if (tmp[rowPar][colPar].value === CellValue.bomb) isABomb = true;
      while (isABomb) {
        tmp = generateCells();
        if (tmp[rowPar][colPar].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      setLive(true);
    }
    const cur = tmp[rowPar][colPar];

    if (cur.state === CellState.flagged) {
        return;
    }

    if (cur.state === CellState.open) {
        if (cur.value === CellValue.bomb){
            tmp[rowPar][colPar].red = true;
            tmp = clickedBomb(tmp, rowPar, colPar);
            setCells(tmp);
            setFace(Face.lost);
            setLive(false);
            setHasLost(true);
            return;
        }
        else if (cur.value === CellValue.none) {
            tmp = clickedEmptyCell(tmp, rowPar, colPar);
        }
        else {
            tmp[rowPar][colPar].state = CellState.visible;
        }
    }
    let used = 0;
    for (let i = 0; i < 15; ++i) {
         for (let j = 0; j < 15; ++j) {
              if (cells[i][j].state === CellState.visible) used++;
         }
    }
    if (used === 180) {
      for (let i = 0; i < 15; ++i) {
           for (let j = 0; j < 15; ++j) {
                if (tmp[i][j].value === CellValue.bomb) {
                    tmp[i][j].state = CellState.flagged;
                }
           }
      }
      setCells(tmp);
      setHasWon(true);
      setFace(Face.won);
      setFlagcnt(30);
      setLive(false);
      return;
    }
    setCells(tmp);
  };

  useEffect(() => {
      if (live && time < 999) {
        const timer = setInterval(() => {
          setTime(time + 1);
        }, 1000);
        return () => {
          clearInterval(timer);
        }
      }
  }, [live, time]);

  const handleCellContext = (rowPar: number, colPar: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    if (!live) return;
    const tmp = cells.slice();
    const cur = cells[rowPar][colPar];
    if (cur.state === CellState.visible) {
        return;
    }
    else if (cur.state === CellState.open) {
        tmp[rowPar][colPar].state = CellState.flagged;
        setCells(tmp);
        setFlagcnt(flagcnt - 1);
    }
    else {
        tmp[rowPar][colPar].state = CellState.open;
        setCells(tmp);
        setFlagcnt(flagcnt + 1);
    }
  };

  const handleFaceClick = () => {
    if (live || hasLost || hasWon) {
      setLive(false);
      setHasLost(false);
      setHasWon(false);
      setTime(0);
      setFlagcnt(45);
      setCells(generateCells());
    }
  }
  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowId) =>
      row.map((cell, colId) =>
       <Button onClick = {handleCellClick} onContext = {handleCellContext} red = {cell.red}
       key = {`${rowId}-${colId}`} state = {cell.state} value = {cell.value} row = {rowId} col = {colId}/>)
    );
  }
  return (
    <div className = "App">
      <div className = "header">
        <NumberDisplay value = {flagcnt}/>
        <div className = "face" onClick = {handleFaceClick}>
          <span role = "img" aria-label = "face">
            {face}
          </span>
        </div>
        <NumberDisplay value = {time}/>
      </div>
      <div className = "body"> {renderCells()} </div>
    </div>
  )
};

export default App;
