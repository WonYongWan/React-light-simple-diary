import { useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

// const dummyList = [
//   {
//     id:1,
//     author: "이정환",
//     content: "하이 1",
//     emotion: 2,
//     created_date: new Date().getTime()
//   },
//   {
//     id:2,
//     author: "원용완",
//     content: "하이 1",
//     emotion: 3,
//     created_date: new Date().getTime()
//   },
//   {
//     id:3,
//     author: "김소라",
//     content: "하이 1",
//     emotion: 5,
//     created_date: new Date().getTime()
//   }
// ]

function App() {

  const [data, setData] = useState([]);

  const dateId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id : dateId.current
    }
    dateId.current += 1;
    setData([newItem, ...data]);
  }

  const onRemove = (targetId) => {
    const newDiaryList = data.filter(it => it.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(data.map(it => it.id === targetId ? {...it, content: newContent} : it));
  }

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate}/>
      <DiaryList onEdit={onEdit} onRemove={onRemove} dairyList={data}/>
    </div>
  );
}

export default App;
