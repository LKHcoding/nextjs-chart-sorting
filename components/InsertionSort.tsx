import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { range, shuffle } from "lodash";

const DURATION = 20;
const SIZE = 30;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;

const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH);
const getArr = () => {
  return shuffle(range(1, SIZE + 1));
};

const swap = (arr, a, b) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

type TSetArr = Dispatch<SetStateAction<number[]>>;
type TSetIdx = Dispatch<SetStateAction<number>>;
type TSet = Dispatch<SetStateAction<any>>;
const delaySet = (value: any, setArr: TSet) =>
  new Promise((resolve) => {
    setArr(value);
    setTimeout(resolve, DURATION);
  });

const sort = async (
  arr: number[],
  setArr: TSetArr,
  setIdxI: TSetIdx,
  setIdxJ: TSetIdx
) => {
  let i = 1;
  while (i < arr.length) {
    let j = i;
    await delaySet(j, setIdxJ);
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      await delaySet([...arr], setArr);
      j--;
      await delaySet(j, setIdxJ);
    }
    i++;
    await delaySet(i, setIdxI);
  }
};
interface IPropsBar {
  value: number;
  idx: number;
}
const Bar: FC<IPropsBar> = (props) => {
  const { value, idx } = props;
  const style = {
    height: value * 10,
    transform: `translateX(${getX(idx)}px)`,
  };
  return (
    <>
      <div style={style} className="bar" />
      <style jsx>{`
        .bar {
          position: absolute;
          width: 20px;
          background-color: black;
        }
      `}</style>
    </>
  );
};

const InsertionSort = () => {
  const [arr, setArr] = useState(getArr());
  const [idxI, setIdxI] = useState(1);
  const [idxJ, setIdxJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const handleShuffle = () => {
    setArr(getArr());
    setIdxI(1);
    setIdxJ(1);
  };
  const handleSort = async () => {
    setIsRunning(true);
    await sort(arr, setArr, setIdxI, setIdxJ);
    setIsRunning(false);
  };
  return (
    <div>
      <div className="board">
        {arr.map((value, i) => (
          <Bar key={i} value={value} idx={i} />
        ))}
      </div>
      <div
        className="index i"
        style={{ transform: `translateX(${getX(idxI)}px)` }}
      >
        i
      </div>
      <div
        className="index j"
        style={{ transform: `translateX(${getX(idxJ)}px)` }}
      >
        j
      </div>

      <div className="buttonBox">
        {!isRunning && <button onClick={handleShuffle}>shuffle</button>}
        {!isRunning && <button onClick={handleSort}>sort</button>}
        {isRunning && <div className="running">Running...</div>}
      </div>

      <style jsx>{`
        .board {
          width: 100%;
          height: 200px;
          background-color: green;
          color: white;
          font-size: 40px;
          transform: rotateX(180deg);
        }

        .buttonBox {
          width: 100%;
          height: 60px;
          background-color: gray;
          text-align: right;
        }

        button {
          font-size: 40px;
        }
        .running {
          font-size: 40px;
        }
        .index {
          position: absolute;
          width: 20px;
          opacity: 0.8;
        }
        .index.j {
          background-color: blue;
          color: white;
        }
        .index.i {
          background-color: yellow;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default InsertionSort;
