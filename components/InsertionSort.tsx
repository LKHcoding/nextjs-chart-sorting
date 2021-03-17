import React, { FC, useState } from "react";
import { range, shuffle } from "lodash"

const SIZE = 30;
const getArr = () => {
  return shuffle(range(1,SIZE + 1));
}

const swap = (arr, a, b) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

const sort = (arr : number[]) => {

  let i = 1;
  while(i < arr.length) {
    let j=i
    while(j>0 && arr[j-1]>arr[j]){
      swap(arr, j, j-1);
      j--;
    }
    i++;
  }
}
interface IPropsBar {
  value: number;
  idx: number;
}
const Bar: FC<IPropsBar> = (props) => {
  const { value, idx } = props;
  const style = {
    height: value * 10,
    transform: `translateX(${idx*21}px)`
  }
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
  </>);
}

const InsertionSort = () => {

  const [arr, setArr] = useState(getArr());

  const handleShuffle = () => {
    setArr(getArr());
  }
  const handleSort = () => {
    const sortedArr = [...arr];
    sort(sortedArr);
    setArr(sortedArr);
  }
  return <div>
  <div className="board">
    {arr.map((value,i) => <Bar key={i} value={value} idx={i} />)}
  </div>

  <div className="buttonBox">
  <button onClick={handleShuffle}>shuffle</button>
  <button onClick={handleSort}>sort</button>
  </div>

  <style jsx>{`
    .board {
      width: 100%;
      height:200px;
      background-color: green;
      color: white;
      font-size: 40px;
      transform: rotateX(180deg)
    }

    .buttonBox {
      width: 100%;
      height: 60px;
      background-color: gray;
      text-align: right;
    }

    button {
      font-size : 40px;
    }
  
   
  `}</style>
  </div>;
};

export default InsertionSort;
