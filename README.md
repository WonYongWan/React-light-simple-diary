# 목차
[React에서 사용자 입력 처리하기](#react에서-사용자-입력-처리하기)<br/>
[React에서 DOM 조작하기 - useRef](#react에서-dom-조작하기---useref)<br/>
[React에서 배열 사용하기 1 - 리스트 렌더링 (조회)](#react에서-배열-사용하기-1---리스트-렌더링-조회)<br/>
[React에서 배열 사용하기 2 - 데이터 추가하기](#react에서-배열-사용하기-2---데이터-추가하기)<br/>
[React에서 배열 사용하기 3 - 데이터 삭제하기](#react에서-배열-사용하기-3---데이터-삭제하기)<br/>

<br/>

# React에서 사용자 입력 처리하기
```js
import { useState } from "react";

// input, textarea, select 모두 name를 통해 서로를 구분할 수 있다.
const DiaryEditor = () => {
  const [state, setState] = useState({author:"", content:"", emotion: 1})

  // input, textarea, select 상태 관리
  const handleChangeState = (e) => {
    // 스프레드 연산자를 뒤에 표기하게 되면 state의 저장된 기본값들이 재할당 되므로 앞에 표기해야 한다.
    setState({...state, [e.target.name]: e.target.value})
  }

  // 가장 최신의 state값들을 출력하게 된다.
  const handleSubmit = () => {
    console.log(state);
    alert('저장 성공');
  }

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      {/* 바뀌는 값만 e.target.value를 통해 변경하고 나머지는 state의 저장된 값으로 지정한다. */}
      <div><input value={state.author} onChange={e => setState({author: e.target.value, content: state.content})} /></div>
      <div><textarea value={state.content} onChange={e => setState({content: e.target.value, author: state.author})} /></div>

      {/* state가 많아질 경우 스프레드 연산자를 통해 해결할 수 있다. */}
      <div><input value={state.author} onChange={e => setState({...state, author: e.target.value})} /></div>
      <div><textarea value={state.content} onChange={e => setState({...state, content: e.target.value})} /></div>

      {/* input, textarea, select를 한 함수에서 관리할 수 있다. */}
      <div><input name="author" value={state.author} onChange={handleChangeState} /></div>
      <div><textarea name="content" value={state.content} onChange={handleChangeState} /></div>
      <div>
        <select name="emotion" value={state.emotion} onChange={handleChangeState}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div><button onClick={handleSubmit}>일기 저장하기</button></div>
    </div>
  )
}

export default DiaryEditor;
```

# React에서 DOM 조작하기 - useRef
```js
// useRef를 사용하기 위해 아래와 같이 import해준다. useRef는 DOM 요소에 접근할 수 있는 기능을 한다.
import React, { useRef, useState } from "react";

const DiaryEditor = () => {
  const handleSubmit = () => {
    if(state.author.length < 1) {
      // 래퍼런스 객체 DOM요소를 선택하는 useRef라는 기능으로 생성한 아래와 같은 래퍼런스 객체는 현재 가리키는 값을 current 프로퍼티로 불러와 사용할 수 있다. = input name="author"
      authorInput.current.focus();
      return;
    }

    if(state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    alert('저장 성공');
  }

  // 아래와 같이 ref로 표기해주면 authorInput 레퍼런스 객체를 통해서 input태그에 접근할 수 있게 된다.
  return <div><input name="author" ref={authorInput} value={state.author} onChange={handleChangeState} /></div>
}
```

# React에서 배열 사용하기 1 - 리스트 렌더링 (조회)

```js
import DiaryItem from "./DiaryItem";

// ver.1
const DiaryList = ({dairyList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{dairyList.length}개의 일기가 있습니다.</h4>
      <div>
        {dairyList.map((obj, idx) => (
          // 최상위 태그는 key prop을 가지고 있어야 한다. map에서 idx를 가져와 value로 지정하는 방법과 고유 아이디 값을 지정하는 방법이 있는데 후자가 더 좋다.
          <div key={idx}>
          {/* <div key={obj.id}> 고유 아이디가 더 좋음 */}
            <div>작성자 : {obj.author}</div>
            <div>일기 : {obj.content}</div>
            <div>감정 : {obj.emotion}</div>
            <div>작성 시간(ms) : {obj.created_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ver.2
const DiaryList = ({dairyList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{dairyList.length}개의 일기가 있습니다.</h4>
      <div>
        {dairyList.map((obj) => (
          // 수정하기 등의 기능이 들어가야 하므로 ver.1처럼 지정하여 관리하는 것보다 컴포넌트를 새로 만드는 것이 더 낫다고 한다.
          <DiaryItem key={obj.id} {...obj}/>
        ))}
      </div>
    </div>
  );
}

// 값의 전달이 undefined로 되는 경우가 있을 수 있으므로 defaultProps를 통해 기본값을 설정할 수 있다. 
DiaryList.defaultProps = {
  dairyList: []
}

export default DiaryList;
```

```js
const DiaryItem = ({author, content, created_date, emotion, id}) => {
  return (
    <div className="DiaryItem">
      <div className="info">
        <span>작성자 : {author} | 감정 점수 : {emotion}</span>
        <br/>
        {/* 중요!! js의 new Date에 getTime메서드를 통해 현재 시간을 ms단위로 받고 아래처럼 새로운 new Date의 인자로 ms시간을 넣고 toLocaleString 메서드를 사용하면 2023. 2. 2. 오후 8:15:46 형태로 날짜를 반환 받을 수 있다. */}
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">{content}</div>
    </div>
  );
}

export default DiaryItem;
```

# React에서 배열 사용하기 2 - 데이터 추가하기

react에서는 데이터를 주고 받을때 단방향으로만 데이터가 흐른다. 즉 부모가 자식에게 데이터를 전달하는 것은 가능하지만 형제끼리는 데이터를 전달할 수 없다. 하지만 이벤트는 자식에서 부모로 전달할 수 있다.

```js
function App() {

  // data를 []로 설정한다.
  const [data, setData] = useState([]);

  // dateId는 0으로 설정한다.
  const dateId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    // newItem에 파라미터로 받은 author, content, emotion, created_date, dateId.current를 할당한다.
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id : dateId.current
    }
    // 데이터를 받을 때마다 +1씩 된다.
    dateId.current += 1;
    // newItem객체가 먼저 담기고 나머지 객체 데이터들이 전개된다.
    setData([newItem, ...data]);
  }

  return (
    <div className="App">
      {/* onCreate를 prop으로 전달한다. */}
      <DiaryEditor onCreate={onCreate}/>
      {/* data 배열을 prop으로 전달한다. */}
      <DiaryList dairyList={data}/>
    </div>
  );
}

export default App;
```

```js
import React, { useRef, useState } from "react";

const DiaryEditor = ({onCreate}) => {
  const [state, setState] = useState({author:"", content:"", emotion: 1});

  const authorInput = useRef();
  const contentInput = useRef();

  const handleChangeState = (e) => {
    setState({...state, [e.target.name]: e.target.value})
  }

  const handleSubmit = () => {
    if(state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if(state.content.length < 5) {
      contentInput.current.focus();
      return;
    }
    // 저장된 state key를 onCreate함수의 인수로 전달한다.
    onCreate(state.author, state.content, state.emotion);
    alert('저장 성공');
    setState({
      author: "",
      content: "",
      emotion: 1
    });
  }
}
```

```js
import DiaryItem from "./DiaryItem";

// App.js의 data를 전달 받았다.
const DiaryList = ({dairyList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{dairyList.length}개의 일기가 있습니다.</h4>
      <div>
        {dairyList.map((obj) => (
          <DiaryItem key={obj.id} {...obj}/>
        ))}
      </div>
    </div>
  );
}

DiaryList.defaultProps = {
  dairyList: []
}

export default DiaryList;
```

# React에서 배열 사용하기 3 - 데이터 삭제하기

부모의 데이터를 자식의 자식에게 전달하기 위해서는 일일이 다 전달 해줘야 한다.

```js
function App() {

  const [data, setData] = useState([]);

  // 클릭한 요소의 id값을 파라미터로 받아온다.
  const onDelete = (targetId) => {
    // filter메서드를 통해 data배열에 id값과 일치하지 않는 id값을 가진 데이터들만 따로 모아 반환한다.
    const newDiaryList = data.filter(it => it.id !== targetId);
    // data를 newDiaryList로 상태 변환을 해준다.
    setData(newDiaryList);
  };

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate}/>
      {/* onDelete 1차 전달 */}
      <DiaryList onDelete={onDelete} dairyList={data}/>
    </div>
  );
}

export default App;
```

```js
import DiaryItem from "./DiaryItem";

const DiaryList = ({onDelete, dairyList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{dairyList.length}개의 일기가 있습니다.</h4>
      <div>
        {dairyList.map((obj) => (
          {/* onDelete 2차 전달 */}
          <DiaryItem key={obj.id} {...obj} onDelete={onDelete}/>
        ))}
      </div>
    </div>
  );
}

DiaryList.defaultProps = {
  dairyList: []
}

export default DiaryList;
```

```js
const DiaryItem = ({onDelete, author, content, created_date, emotion, id}) => {
  return (
    <div className="DiaryItem">
      <div className="info">
        <span>작성자 : {author} | 감정 점수 : {emotion}</span>
        <br/>
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">{content}</div>
      {/* onDelete에 클릭한 요소의 id 인수로 전달 */}
      <button onClick={() => {if(window.confirm(`${id}번째 일기를 정말 삭제 하시겠습니까?`)) onDelete(id);}}>삭제하기</button>
    </div>
  );
}

export default DiaryItem;
```