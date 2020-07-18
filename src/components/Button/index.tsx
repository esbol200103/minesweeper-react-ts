import React from 'react';
import './button.scss';
import {CellState, CellValue} from '../../types';


interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowPar: number, colPar: number): (...args: any[]) => void;
  onContext(rowPar: number, colPar: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({row, col, state, value, onClick, onContext, red}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
        if (value === CellValue.bomb){
            return <span className = "cell" role = "img" aria-label = "bomb">
            💣
            </span>
        }
        else if (value === CellValue.none) {
            return null;
        }
        else {
            return <span className = "cell cell__number" aria-label = "number">{value}</span>;
        }
    }
    else if (state === CellState.flagged) {
        return <span className = "cell" role = "img" aria-label = "flag">
        🚩
        </span>
    }
    return null;
  }
  return (<div onClick = {onClick(row, col)} onContextMenu = {onContext(row, col)}
    className = {`button ${state === CellState.visible ? 'visible' : ""} value-${value} ${red ? "red" : ""}`}>
    {renderContent()}
  </div>
  );
}

export default Button;
