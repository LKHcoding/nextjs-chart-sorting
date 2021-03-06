import { range, shuffle, uniqueId } from "lodash";
import {
  useState,
  FC,
  SetStateAction,
  Dispatch,
  memo,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import { tween } from "tweening-js";

type TSetArr = Dispatch<SetStateAction<number[]>>;
type TSetIdx = Dispatch<SetStateAction<number>>;
type TSetX = Dispatch<SetStateAction<number>>;
type TSet = Dispatch<SetStateAction<any>>;

const DURATION = 40;
const SIZE = 35;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;

const getArr = () => shuffle(range(1, SIZE + 1));
const initArr = range(1, SIZE + 1).map(() => 1);
const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH);

const swap = (arr: IExtendedBar[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

interface IExtendedBar {
  value: number;
  refSetX: MutableRefObject<TSetX>;
}

const sort = async (
  extendedBarArr: IExtendedBar[],
  setIdxI: TSetIdx,
  setIdxJ: TSetIdx
) => {
  // https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1,
    j = 1;
  while (i < extendedBarArr.length) {
    await tween(j, i, setIdxJ, DURATION).promise();
    j = i;
    while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
      await Promise.all([
        tween(
          getX(j),
          getX(j - 1),
          extendedBarArr[j].refSetX.current,
          DURATION
        ).promise(),
        tween(
          getX(j - 1),
          getX(j),
          extendedBarArr[j - 1].refSetX.current,
          DURATION
        ).promise(),
      ]);
      swap(extendedBarArr, j, j - 1);

      await tween(j, j - 1, setIdxJ, DURATION).promise();
      j = j - 1;
    }
    await tween(i, i + 1, setIdxI, DURATION).promise();
    i = i + 1;
  }
};

interface IPropsBar {
  value: number;
  idx: number;
  refSetX: MutableRefObject<TSetX>;
}

const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refSetX } = props;
  const [x, setX] = useState(getX(idx));
  const style = { height: value * 10, transform: `translateX(${x}px)` };
  refSetX.current = setX;

  return (
    <>
      <div style={style} className="bar" />
      <style jsx>{`
        .bar {
          position: absolute;
          width: 20px;
          background-color: white;
          border: solid 1px black;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

interface IPropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}

const areArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr;
};

const Board: FC<IPropsBoard> = (props) => {
  const { arr, refExtendedBarArr } = props;
  const extendedBarArr = arr.map((value) => ({
    value,
    refSetX: useRef<TSetX>(null),
  }));
  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr;
  }, [arr]);

  return (
    <div className="board">
      {extendedBarArr.map((item, i) => {
        // console.log("render Bar");
        return (
          <Bar
            key={`${uniqueId("set")}:${i}`}
            value={item.value}
            idx={i}
            refSetX={item.refSetX}
          />
        );
      })}
      <style jsx>{`
        .board {
          width: 100%;
          height: 400px;
          background-color: black;
          color: white;
          border: solid 1px black;
          border-radius: 5px;
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
  );
};

const MemorizedBoard = memo(Board, areArrEqual);

const InsertionSort = () => {
  const [arr, setArr] = useState(initArr);
  const [idxI, setIdxI] = useState(1);
  const [idxJ, setIdxJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const refExtendedBarArr = useRef<IExtendedBar[]>([]);
  useEffect(() => setArr(getArr()), []);

  const handleShuffle = () => {
    setArr(getArr());
    setIdxI(1);
    setIdxJ(1);
  };
  const handleSort = async () => {
    setIsRunning(true);
    await sort(refExtendedBarArr.current, setIdxI, setIdxJ);
    setIsRunning(false);
  };

  return (
    <div>
      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />
      <div
        className="index i"
        style={{ transform: `translateX(${getX(idxI)}px)` }}
      >
        &nbsp;&nbsp;i
      </div>
      <div
        className="index j"
        style={{ transform: `translateX(${getX(idxJ)}px)` }}
      >
        &nbsp;&nbsp;j
      </div>

      <div className="buttonBox">
        {!isRunning && <button onClick={handleShuffle}>shuffle</button>}
        {!isRunning && <button onClick={handleSort}>sort</button>}
        {isRunning && <div className="running">Running...</div>}
      </div>

      <style jsx>{`
        .buttonBox {
          width: 100%;
          height: 70px;
          background-color: white;
          border: solid 1px black;
          text-align: right;
        }
        button {
          padding: 5px;
          margin: 10px;
          font-size: 30px;
          border-radius: 5px;
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
          margin-top: 26px;
          background-color: #bfbfff;
          color: black;
          font-weight: bold;
          border-radius: 3px;
          border: solid 1px #7a7a7a;
          margin-left: 1px;
        }
        .index.i {
          margin-top: 2px;
          background-color: #ffff91;
          color: black;
          font-weight: bold;
          border-radius: 3px;
          border: solid 1px #7a7a7a;
          margin-left: 1px;
        }
      `}</style>
    </div>
  );
};
export default InsertionSort;
