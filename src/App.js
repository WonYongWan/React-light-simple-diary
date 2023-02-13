// export default된 React는 이름을 변경할 수 있지만 export된 나머지 {...}는 이름을 변경할 수 없다.
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const reducer = (state, action) => {
  switch(action.type) {
    case 'INIT' : {
      return action.data
    }
    case 'CREATE' : {
      const created_date = new Date().getTime();
      const newItem = {...action.data, created_date}
      return [newItem, ...state]
    }
    case 'REMOVE' : {
      return state.filter(it => it.id !== action.targetId);
    }
    case 'EDIT' : {
      return state.map(it => it.id === action.targetId ? {...it, content: action.newContent} : it);
    }
    default : 
    return state;
  }
}

// export default는 파일 하나당 1번만 사용할 수 있다.
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState([]);
  const [data, dispatch] = useReducer(reducer, []);

  const dateId = useRef(0);

  const getData = async() => {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments').then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random() * 5) + 1,
        created_date : new Date().getTime(),
        id : dateId.current++
      }
    });

    // setData(initData);
    dispatch({type:"INIT", data:initData});
  }

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({type:"CREATE", data:{author, content, emotion, id:dateId.current}});
    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id : dateId.current
    // }
    dateId.current += 1;
    // setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({type:"REMOVE", targetId});
    // setData(data => data.filter(it => it.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type:"EDIT", targetId, newContent});
    // setData(data => data.map(it => it.id === targetId ? {...it, content: newContent} : it));
  }, []);

  // App컴포넌트가 재생성될때 반환하는 함수들이 재생성되지 않게 하기 위해서 useMemo를 사용했다.
  const memoizedDispatches = useMemo(() => {
    return {onCreate, onRemove, onEdit}
  }, []);

  const getDiaryAnalysis = useMemo (() => {
      const goodCount = data.filter((it) => it.emotion >= 3).length;
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return {goodCount, badCount, goodRatio}
    }, [data.length]);

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor/>
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList/>
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
