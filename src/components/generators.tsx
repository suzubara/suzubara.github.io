import { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import Highlight from 'reveal.js/plugin/highlight/highlight'
import Notes from 'reveal.js/plugin/notes/notes'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/dracula.css'

function App() {
  const deckDivRef = useRef<HTMLDivElement>(null) // reference to deck container div
  const deckRef = useRef<Reveal.Api | null>(null) // reference to deck reveal instance

  useEffect(() => {
    // Prevents double initialization in strict mode
    if (deckRef.current) return

    deckRef.current = new Reveal(deckDivRef.current!, {
      transition: 'slide',
      // other config options
    })

    deckRef.current.initialize({ plugins: [Highlight, Notes] }).then(() => {
      // good place for event handlers and plugin setups
    })

    return () => {
      try {
        if (deckRef.current) {
          deckRef.current.destroy()
          deckRef.current = null
        }
      } catch (e) {
        console.warn('Reveal.js destroy call failed.')
      }
    }
  }, [])

  const generatorExample = `function* myGenerator () {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();
let one = generator.next();

alert(JSON.stringify(one)); // {value: 1, done: false}
`

  const asyncExample = `async function f() {
  return 1;
}
`

  return (
    <div className="reveal" ref={deckDivRef}>
      <div className="slides">
        <section>
          <h1>Async user flows with generators</h1>
          <h3>Suzanne Rozier</h3>
          <h6>Austin JS 3/17/2025</h6>

          <aside className="notes">
            Hi I'm Suzanne, I work at Square. At AustinJS a few months back
            someone was talking about generators, and said something about
            wanting to know if anyone had a production use case for them.
          </aside>
        </section>
        <section>
          <h4>What is a generator?</h4>
          <pre>
            <code data-trim className="language-typescript">
              {generatorExample}
            </code>
          </pre>

          <aside className="notes">
            First: what is a generator? this is a lightning talk, not a deep
            dive, so I'm keeping it simple. A generator is a special kind of
            function, you know it's special because of the star. It's like a
            state machine. After defining a generator function, you invoke it
            and then call next to step through. It will pause at each yield.
            When it returns, it's done.
          </aside>
        </section>
        <section>
          <h4>async / await</h4>
          <pre>
            <code data-trim className="language-typescript">
              {asyncExample}
            </code>
          </pre>

          <aside className="notes">First lets talk about async/await.</aside>
        </section>
      </div>
    </div>
  )
}

export default App
