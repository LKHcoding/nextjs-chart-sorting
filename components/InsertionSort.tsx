import React, { useState } from "react";
import { range, shuffle } from "lodash"


const getArr = () => {
  return shuffle(range(1,11));
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
    {arr.join(',')}
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
