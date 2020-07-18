import {CellValue, CellState, Cell} from '../types';
export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];
  for (let i = 0; i < 15; ++i) {
       cells.push([]);
       for (let j = 0; j < 15; ++j) {
            cells[i].push({
              value: CellValue.none,
              state: CellState.open
            });
       }
  }

  let bombs = 0;
  while (bombs < 45) {
    const row = Math.floor(Math.random() * Math.floor(15));
    const col = Math.floor(Math.random() * Math.floor(15));
    if (!(cells[row][col].value === CellValue.bomb)){
       cells[row][col].value = CellValue.bomb;
       bombs ++;
    }
  }
  for (let i = 0; i < 15; ++i) {
       for (let j = 0; j < 15; ++j) {
            if (cells[i][j].value === CellValue.bomb) {
                if (j + 1 < 15 && cells[i][j + 1].value !== CellValue.bomb)cells[i][j + 1].value++;
                if (j - 1 >= 0 && cells[i][j - 1].value !== CellValue.bomb)cells[i][j - 1].value++;
                if (i + 1 < 15 && cells[i + 1][j].value !== CellValue.bomb)cells[i + 1][j].value++;
                if (i - 1 >= 0 && cells[i - 1][j].value !== CellValue.bomb)cells[i - 1][j].value++;
                if (i - 1 >= 0 && j - 1 >= 0  && cells[i - 1][j - 1].value !== CellValue.bomb)cells[i - 1][j - 1].value++;
                if (i - 1 >= 0 && j + 1 < 15 && cells[i - 1][j + 1].value !== CellValue.bomb)cells[i - 1][j + 1].value++;
                if (j - 1 >= 0 && i + 1 < 15 && cells[i + 1][j - 1].value !== CellValue.bomb)cells[i + 1][j - 1].value++;
                if (j + 1 < 15 && i + 1 < 15 && cells[i + 1][j + 1].value !== CellValue.bomb)cells[i + 1][j + 1].value++;
            }
       }
  }

  return cells;
};

export const clickedEmptyCell = (cells: Cell[][], rowPar: number, colPar: number): Cell[][] => {
  let tmp = cells.slice();
  let bfs = [];
  bfs.push(rowPar, colPar);
  while (bfs.length > 0){
     if (tmp[bfs[0]][bfs[1]].state === CellState.open){
       tmp[bfs[0]][bfs[1]].state = CellState.visible;
       if (bfs[0] - 1 >= 0 && tmp[bfs[0] - 1][bfs[1]].value !== CellValue.bomb){
           if (tmp[bfs[0] - 1][bfs[1]].value === CellValue.none) {
               bfs.push(bfs[0] - 1, bfs[1]);
           }
           else tmp[bfs[0] - 1][bfs[1]].state = CellState.visible;
       }
       if (bfs[0] + 1 < 15 && tmp[bfs[0] + 1][bfs[1]].value !== CellValue.bomb){
           if (tmp[bfs[0] + 1][bfs[1]].value === CellValue.none) {
               bfs.push(bfs[0] + 1, bfs[1]);
           }
           else tmp[bfs[0] + 1][bfs[1]].state = CellState.visible;
       }
       if (bfs[1] + 1 < 15 && tmp[bfs[0]][bfs[1] + 1].value !== CellValue.bomb){
           if (tmp[bfs[0]][bfs[1] + 1].value === CellValue.none) {
               bfs.push(bfs[0], bfs[1] + 1);
           }
           else tmp[bfs[0]][bfs[1] + 1].state = CellState.visible;
       }
       if (bfs[1] - 1 >= 0 && tmp[bfs[0]][bfs[1] - 1].value !== CellValue.bomb){
           if (tmp[bfs[0]][bfs[1] - 1].value === CellValue.none) {
               bfs.push(bfs[0], bfs[1] - 1);
           }
           else tmp[bfs[0]][bfs[1] - 1].state = CellState.visible;
       }
       if (bfs[0] - 1 >= 0 && bfs[1] + 1 < 15 && tmp[bfs[0] - 1][bfs[1] + 1].value !== CellValue.bomb){
           if (tmp[bfs[0] - 1][bfs[1] + 1].value === CellValue.none) {
               bfs.push(bfs[0] - 1, bfs[1] + 1);
           }
           else tmp[bfs[0] - 1][bfs[1] + 1].state = CellState.visible;
       }
       if (bfs[0] + 1 < 15 && bfs[1] + 1 < 15 && tmp[bfs[0] + 1][bfs[1] + 1].value !== CellValue.bomb){
           if (tmp[bfs[0] + 1][bfs[1] + 1].value === CellValue.none) {
               bfs.push(bfs[0] + 1, bfs[1] + 1);
           }
           else tmp[bfs[0] + 1][bfs[1] + 1].state = CellState.visible;
       }
       if (bfs[0] + 1 < 15 && bfs[1] - 1 >= 0 && tmp[bfs[0] + 1][bfs[1] - 1].value !== CellValue.bomb){
           if (tmp[bfs[0] + 1][bfs[1] - 1].value === CellValue.none) {
               bfs.push(bfs[0] + 1, bfs[1] - 1);
           }
           else tmp[bfs[0] + 1][bfs[1] - 1].state = CellState.visible;
       }
       if (bfs[0] - 1 >= 0 && bfs[1] - 1 >= 0 && tmp[bfs[0] - 1][bfs[1] - 1].value !== CellValue.bomb){
           if (tmp[bfs[0] - 1][bfs[1] - 1].value === CellValue.none) {
               bfs.push(bfs[0] - 1, bfs[1] - 1);
           }
           else tmp[bfs[0] - 1][bfs[1] - 1].state = CellState.visible;
       }
     }
     bfs.shift();
     bfs.shift();
  }
  return tmp;
}

export const clickedBomb = (cells: Cell[][], rowPar: number, colPar: number): Cell[][] => {
  const tmp = cells.slice();
  for (let i = 0; i < 15; ++i) {
    for (let j = 0; j < 15; ++j) {
       tmp[i][j].state = CellState.visible;
    }
  }
  return tmp;
}
