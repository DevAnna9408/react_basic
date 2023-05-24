// import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

/*
* App 안에 있는 로직이 화면을 구성한다.
*
* * */

function Header(props){
  return <header>
    <h1>
      <a
          href="/"
          onClick={ event => {
            event.preventDefault()
            props.onChangeMode() }}
      >
        {props.title}
      </a>
    </h1>
  </header>
}

function Nav(props) {

  const lists = []

  props.topics.forEach(c => {
    lists.push(

        // 배열을 렌더링 할 때는 vue처럼 key를 선언 해 줘야 한다.

        <li key={c.id}>
          <a
              id={c.id} href={'/read/'+c.id}
              onClick={ event => {
              event.preventDefault();
              props.onChangeMode(Number(event.target.id));
          }}
          >
            {c.title}
          </a>
        </li>
    )
  })

  return(
      <nav>
        <ol>
          {lists}
        </ol>
      </nav>
  )

}

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function App() {

  // const _mode = useState('WELCOME')
  //
  // /*
  // * state는 배열을 리턴하는데
  // * 0번째 원소는 상태의 값을 읽을 때 쓰는 데이터익
  // * 두 번째 값은 상태의 값을 변경할 때 사용하는 함수이다.
  // * */
  // console.log(_mode)
  //
  // const mode = _mode[0]
  // const setMode = _mode[1]

  const[ mode, setMode ] = useState('WELCOME')
  const [ id, setId ] = useState(null)
  const [ nextId, setNextId ] = useState(4)
  const [ topics, setTopics ] = useState([
    { id:1, title:'html', body:'html is..'},
    {id:2, title:'css', body:'css is..'},
    { id:3, title:'javascript', body:'javascript is..'}
  ])

  let content = null
  let contextControl = null

  if(mode === 'WELCOME') {

    content = <Article title = 'WELCOME' body = 'Hello Web!'/>

  } else if(mode === 'READ') {

    let title, body = null

    topics.forEach(c => {
      if(c.id === id) {
        title = c.title
        body = c.body
      }
    })

    content = <Article title = {title} body = {body}/>
    contextControl =
    <>
        <li>
          <a
              href={"/update/" + id}
              onClick={event => {
                event.preventDefault()
                setMode('UPDATE')
              }}
          >
            Update
          </a>
        </li>
        <li>
            <input
                type={"button"}
                value={"Delete"}
                onClick={ () => {
                    const newTopics = []
                    topics.forEach(c => {
                        if (c.id !== id) {
                            newTopics.push(c)
                        }
                    })
                    setTopics(newTopics)
                    setMode('WELCOME')
                }}
            />
        </li>
    </>

  } else if (mode === 'CREATE') {
    content = <Create
                onCreate={(_title, _body) => {
                  const newTopic = { id:nextId, title:_title, body:_body }
                  const newValue = [...topics]
                  newValue.push(newTopic)
                  setTopics(newValue)
                  setMode('READ')
                  setId(nextId)
                  setNextId(nextId + 1)
                }}
    />
  } else if(mode === 'UPDATE') {
      let title, body = null

      topics.forEach(c => {
          if(c.id === id) {
              title = c.title
              body = c.body
          }
      })
    content = <Update
        title = {title}
        body = {body}
        onUpdate = {(title, body) => {
            const newTopic = { id: id, title: title, body:body }
            const newTopics = [...topics]
            for(let i=0; i < newTopics.length; i++){
                if(newTopics[i].id === id) {
                    newTopics[i] = newTopic
                    break
                }
            }
            setTopics(newTopics)
            setMode('READ')
        }}
    />
  }

  function Create (props) {
    return(
      <article>
        <h2>Create</h2>
        <form onSubmit={event => {
          event.preventDefault()
          const title = event.target.title.value
          const body = event.target.body.value
          props.onCreate(title, body)
        }}>
          <p>
            <input
                type={"text"}
                name={"title"}
                placeholder={"title"} />
          </p>
          <p>
            <textarea
                name={"body"}
                placeholder={"body"}/>
          </p>
          <p>
            <input
                type={"submit"}
                value={"create"}/>
          </p>
        </form>
      </article>
    )
  }

  function Update (props) {
      const [title, setTitle] = useState(props.title)
      const [body, setBody] = useState(props.body)
    return(
        <article>
          <h2>Update</h2>
          <form onSubmit={event => {
            event.preventDefault()
            const title = event.target.title.value
            const body = event.target.body.value
            props.onUpdate(title, body)
          }}>
            <p>
              <input
                  type={"text"}
                  name={"title"}
                  placeholder={"title"}
                  value={title}
                  onChange={event => {
                      setTitle(event.target.value)
                  }}
              />
            </p>
            <p>
            <textarea
                name={"body"}
                placeholder={"body"}
                value={body}
                onChange={event => {
                    setBody(event.target.value)
                }}
            />
            </p>
            <p>
              <input
                  type={"submit"}
                  value={"Update"}
              />
            </p>
          </form>
        </article>
    )

  }

  return (
    <div className="App">
      <Header
          title={"WEB"}
          onChangeMode={ () =>  { setMode('WELCOME') } }/>
      <Nav
          topics = {topics}
          onChangeMode = { (_id) => {
            setMode('READ')
            setId(_id)
          } }
      />
      { content }
      <ul>
        <li>
          <a
              href={'/create'}
              onClick={ event => {
                event.preventDefault()
                setMode('CREATE')
              }}>
            Create
          </a>
        </li>
        { contextControl }
      </ul>
    </div>
  );
}

export default App;
