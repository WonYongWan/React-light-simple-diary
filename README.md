# 목차
[React에서 사용자 입력 처리하기](#react에서-사용자-입력-처리하기)<br/>
[React에서 DOM 조작하기 - useRef](#react에서-dom-조작하기---useref)

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
