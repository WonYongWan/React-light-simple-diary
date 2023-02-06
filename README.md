# 목차
[React에서 사용자 입력 처리하기](#react에서-사용자-입력-처리하기)<br/>
[React에서 DOM 조작하기 - useRef](#react에서-dom-조작하기---useref)<br/>
[React에서 배열 사용하기 1 - 리스트 렌더링 (조회)](#react에서-배열-사용하기-1---리스트-렌더링-조회)<br/>
[React에서 배열 사용하기 2 - 데이터 추가하기](#react에서-배열-사용하기-2---데이터-추가하기)<br/>
[React에서 배열 사용하기 3 - 데이터 삭제하기](#react에서-배열-사용하기-3---데이터-삭제하기)<br/>
[React에서 배열 사용하기 4 - 데이터 수정하기](#react에서-배열-사용하기-4---데이터-수정하기)<br/>
[React Lifecycle 제어하기 - useEffect](#react-lifecycle-제어하기---useeffect)<br/>
[React에서 API 호출하기](#react에서-api-호출하기)<br/>
[React developer tools](#react-developer-tools)<br/>
[최적화 1 - useMemo](#최적화-1---usememo)<br/>
[최적화 2 - React.memo](#최적화-2---reactmemo)<br/>

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

# React에서 배열 사용하기 4 - 데이터 수정하기

```js
function App() {

  const [data, setData] = useState([]);

  // onEdit의 경우 data의 id값이 targetId와 같을 경우에만 해당 id값을 아이템 ...it을 전개하고 content를 newContent로 저장한다.
  const onEdit = (targetId, newContent) => {
    setData(data.map(it => it.id === targetId ? {...it, content: newContent} : it));
  }

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate}/>
      {/* 최종적으로 DiaryItem에 전달될 onEdit이다. */}
      <DiaryList onEdit={onEdit} onRemove={onRemove} dairyList={data}/>
    </div>
  );
}

export default App;
```

```js
import { useRef, useState } from "react";

const DiaryItem = ({onEdit, onRemove, author, content, created_date, emotion, id}) => {

  const [isEdit, setIsEdit] = useState(false);
  // isEdit값이 false면 true로 true면 false로 변경한다. // 수정하기
  const toggleIsEdit = () => setIsEdit(!isEdit);

  const [localContent, setLocalContent] = useState(content);
  const localContentInput = useRef();

  // isEdit를 false로 변경하고 localContent를 content로 변경한다. // 수정 취소
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  }

  // localContent의 길이가 5미만일 경우 해당 돔에 focus를 하고 return한다.
  const handleEdit = () => {
    if(localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }

    // 수정을 허락할 경우 onEdit의 인수로 해당 id와 localContent값을 전달한다.
    if(window.confirm(`${id}번째 일기를 수정 하시겠습니까?`)) {
      onEdit(id, localContent);
      // isEdit값이 false면 true로 true면 false로 변경한다. // 수정하기
      toggleIsEdit();
    };
  }

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>작성자 : {author} | 감정 점수 : {emotion}</span>
        <br/>
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">
        {/* isEdit의 상태에 따른 노출되는 태그 변경 */}
        {isEdit ? 
        <><textarea ref={localContentInput} value={localContent} onChange={e => setLocalContent(e.target.value)}/></> : 
        <>{content}</>
        }
      </div>
      {/* isEdit의 상태에 따른 노출되는 태그 변경 */}
      {isEdit ? 
      <>
        <button onClick={handleQuitEdit}>수정 취소</button>
        <button onClick={handleEdit}>수정 완료</button>
      </> :
      <>
        <button onClick={handleRemove}>삭제하기</button>
        <button onClick={toggleIsEdit}>수정하기</button>
      </>
      }
    </div>
  );
}

export default DiaryItem;
```

# React Lifecycle 제어하기 - useEffect

React 컴포넌트의 생애 주기 (생명 주기)

탄생(화면에 나타나는 것 Mount) -> 변화(업데이트(리렌더) Update) -> 죽음(화면에서 사라짐 UnMount)

React는 기본적으로 Lifecycle마다 실행할 수 있는 메서드를 가지고 있다.

- ComponentDidMount (Mount)
- ComponentDidUpdate (Update)
- ComponentWillUnmount (UnMount)

다만 위의 메서드들은 class형 컴포넌트에서만 사용할 수 있다.

그리고 함수형 컴포넌트는 근본적으로 Lifecycle를 제어하는 메서드들 말고도 상태를 관리하는 state도 사용할 수 없다. (class컴포넌트만 가능)

하지만 지금까지 useState를 통해 상태를 관리해 왔다. 이는

앞에 use키워드를 붙이면 원래 class형 컴포넌트가 근본적으로 가지고 있는 기능을 함수형 컴포넌트에서 낚아채서 사용할 수 있는데 이를 React Hooks라고 한다.

State, Effect, Ref => 함수형 컴포넌트에서 사용 X

useState, useEffect, useRef => 함수형 컴포넌트에서 사용 O

### 왜 React Hooks가 나왔는가?

React Hooks는 2019.06 정식 출시된 기능이다.

class형 컴포넌트의 길어지는 코드 길이 문제 + 중복 코드, 가독성 문제 등등을 해결하기 위해 등장함

```js 
import React, { useEffect } from "react";

// 함수형 컴포넌트에서 Lifecycle를 제어하기 위해서는 useEffect라는 React Hooks를 사용해야 한다.
useEffect(() => {
  // todo... // Callback 함수
}, []) // [] => Dependency Array(의존성 배열) 이 배열 내에 들어있는 값이 변화하면 콜백 함수가 수행된다.
```

```js
import React, { useEffect, useState } from "react";

const Lifecycle = () => {
  
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    // Dependency Array가 있을 경우 최초 렌더 됐을때만 아래의 'Mount!'가 출력된다. 리렌더X
    console.log('Mount!');
  }, []);

  useEffect(() => {
    // Dependency Array를 전달하지 않을 경우 리렌더링 될 때마다 'Update!'가 출력된다.
    console.log('Update!');
  });

  useEffect(() => {
    // console.log(`count is update : ${count}`);
    if(count > 5) {
      alert('count가 5를 넘었습니다. 따라서 1로 초기화 됩니다.');
      setCount(1);
    }
  }, [count]); // Dependency Array의 값이 변경되면 콜백 함수가 수행된다.

  return (
    <div style={{padding: 20}}>
      <div>
        {count}
        <button onClick={() => {setCount(count + 1)}}>+</button>
      </div>
      <div>
        <input value={text} onChange={e => setText(e.target.value)} />
      </div>
    </div>
  );
}

export default Lifecycle;
```

```js
import React, { useEffect, useState } from "react";

// 한 파일당 하나의 컴포넌트만을 고집하지 않아도 된다. 상황에 따라서 판단
const UnmountTest = () => {

  useEffect(() => {
    console.log("Mount!");

    // Unmount를 확인하기 위해서는 콜백함수에 함수를 리턴하면 된다.
    return () => {
      // Unmount 시점에 실행되게 됨
      console.log("Unmount!");
    }
  }, []);

  return <div>Unmount Testing Component</div>
}

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  return (
    <div style={{padding: 20}}>
      <button onClick={toggle}>ON/OFF</button>
      {isVisible && <UnmountTest/>}
    </div>
  );
}

export default Lifecycle;
```

# React에서 API 호출하기

```js
import { useEffect, useRef, useState } from 'react';
import './App.css';

// https://jsonplaceholder.typicode.com/comments

function App() {

  const [data, setData] = useState([]);

  const dateId = useRef(0);

  // 함수 앞에 async를 붙이면 Pormis객체가 된다.
  const getData = async() => {
    // await은 비동기를 동기처럼 만들어 준다. res의 실행이 완료되기 전까지 다음 코드를 실행하지 않는다.
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

    // data의 상태변화
    setData(initData);
  }

  // useEffect안에 2번째 파라미터로 빈 배열 []을 기입하면 mount상태에서 실행된다.
  useEffect(() => {
    getData();
  }, []);
}

```

# React developer tools

구글 웹 스토어에 접속해 react developer tools를 검색한다.

설치 후 사이트 엑세스를 모든 사이트에서, 파일 URL에 대한 엑세스 허용, 시크릿모드에서 허용

react start 후 개발자 도구에서 Components tab에 들어가면 각 컴포넌트마다 어떤 state, props, ref, effect가 있는지 알 수 있다.

Components tab의 톱니바퀴 설정 클릭 후 Highlight updates when components render.에 체크하면 컴포넌트가 리렌더 될 때마다 확인할 수 있다.

# 최적화 1 - useMemo

Memoization이란 이미 계산 본 연산 결과를 기억 해 두었다가

동일한 계산을 시키면, 다시 연산하지 않고 기억 해 두었던 데이터를 반환 시키게 하는 방법

```js
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

function App() {

  const [data, setData] = useState([]);

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

    setData(initData);
  }

  useEffect(() => {
    getData();
  }, []);

  // useMemo를 사용하려면 아래와 같이 useMemo안에 함수를 넣어 사용하면 된다.
  const getDiaryAnalysis = useMemo (() => {
      console.log("일기 분석 시작");
    
      const goodCount = data.filter((it) => it.emotion >= 3).length;
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return {goodCount, badCount, goodRatio}
    }, [data.length]); // Dependency Array에 값을 넣고 그 값의 수정이 일어나면 콜백함수가 실행된다.

  // getDiaryAnalysis는 useMemo를 담고 있기 때문에 함수가 아닌 값으로서 동작한다. 
  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate}/>
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} dairyList={data}/>
    </div>
  );
}

export default App;
```

# 최적화 2 - React.memo

불필요한 리렌더를 React.memo를 통해 막을 수 있다.

```js
import React, { useState, useEffect } from "react";

// 아래와 같이 함수를 React.memo 메서드로 감싸주면 text에 변화가 일어나지 않는 이상 리렌더링 하지 않는다.
const TextView = React.memo(({text}) => {
  useEffect(() => {
    console.log(`Update :: Text : ${text}`);
  });
  return (
    <div>{text}</div>
  );
});

// 즉 count의 상태가 변화하면 count만 리렌더링, text의 상태가 변화하면 text만 리렌더링 한다.
const CountView = React.memo(({count}) => {
  useEffect(() => {
    console.log(`Update :: Count : ${count}`);
  });
  return (
    <div>{count}</div>
  );
});

const OptimizeTest = () => {

  const [count, setCount] = useState(1);
  const [text, setText] = useState('');

  return (
    <div style={{padding: 50}}>
      <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => setCount(count+1)}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    </div>
  );
}

export default OptimizeTest;
```

```js
import React, { useState, useEffect } from "react";

// count는 이전 값과 다음 값의 차이가 생기지 않기 때문에 리렌더링 되지 않는다.
const CounterA = React.memo(({count}) => {
  useEffect(() => {
    console.log(`Counter A update - count: ${count}`);
  });
  return <div>{count}</div>
});

// 객체는 비원시 타입이고 obj의 이전 값과 다음 값은 다른 메모리를 참조하고 있기 때문에 값이 같아도 다르다고 인식해 리렌더링 된다.
const CounterB = ({obj}) => {
  useEffect(() => {
    console.log(`Counter B update - count: ${obj.count}`);
  });
  return <div>{obj.count}</div>
};

// 이전값과 다음값이 같을 경우 true를 다를 경우 false를 반환한다.
const areEqual = (prevProps, nextProps) => {
  // return true // 이전 프롭스와 현제 프롭스가 같다 -> 리렌더링을 일으키지 않음
  // return false // 이전 프롭스와 현제 프롭스가 다르다 -> 리렌터링을 일으킨다.
  return prevProps.obj.count === nextProps.obj.count;
}

// React.memo의 두번째 파라미터로 비원시타입의 값을 비교하는 함수를 넣을 수 있다.
const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {

  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({count: 1});

  return (
    <div style={{padding: 50}}>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button onClick={() => setObj({count: obj.count})}>B button</button>
      </div>
    </div>
  );
}

export default OptimizeTest;
```