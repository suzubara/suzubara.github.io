import { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import Highlight from 'reveal.js/plugin/highlight/highlight'
import Notes from 'reveal.js/plugin/notes/notes'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/dracula.css'

import asyncImg from './async.png'

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

let generator = myGenerator();

generator.next(); // {value: 1, done: false}
generator.next(); // {value: 2, done: false}
generator.next(); // {value: 3, done: true}
`

  const asyncExample = `async function f() {
  return 1;
}
`
  const modalCallback = `const MyImages = (): React.ReactElement => {
  const confirmDeleteImageModal = useModal()

  const reallyDeleteImage = (): void => {
      // Make API call to delete the image
    }

  const handleDeleteImage = (): void => {
    confirmDeleteImageModal.open()
  }

  return (
    <div>
      <Button type="button" onClick={handleDeleteImage}>
        Delete image
      </Button>

      <DeleteImageModal
        isOpen={confirmDeleteImageModal.isOpen}
        onClose={(): void => {
          confirmDeleteImageModal.close()
        }}
        onConfirm={(): void => {
          reallyDeleteImage()
          confirmDeleteImageModal.close()
        }}
      />
    </div>
  )
}`

  const modalGenerator = `const confirmationModalFlow = function*(
  modal: ModalHook,
  onConfirmed: () => void,
  onCanceled?: () => void
): Generator<undefined, void, unknown> {
  modal.openModal()
  const confirmed = yield
  modal.closeModal()
  if (confirmed) onConfirmed()
  else if (onCanceled) onCanceled()
}`

  const modalComponent = `const MyImages = (): React.ReactElement => {
  const confirmDeleteImageModal = useModal()

  const deleteImageFlow = (): Generator<undefined, void, unknown> =>
    confirmationModalFlow(confirmDeleteImageModal, (): void => {
      // Make API call to delete the image
    })

  const deleteImageGenerator = useGenerator(deleteImageFlow)

  const handleDeleteImage = (): void => {
    deleteImageGenerator.startGenerator()
    deleteImageGenerator.next()
  }

  return (
    <div>
      <Button type="button" onClick={handleDeleteImage}>
        Delete image
      </Button>

      <DeleteImageModal
        isOpen={confirmDeleteImageModal.isOpen}
        onClose={(): void => {
          deleteImageGenerator.next(false)
        }}
        onConfirm={(): void => {
          deleteImageGenerator.next(true)
        }}
      />
    </div>
  )
}`

  const genericConfirmationGenerator = `
    const useConfirmationGenerator
  `

  const genericConfirmation = `const MyImages = (): React.ReactElement => {
  const confirmDeleteImageModal = useModal()

  const deleteImageFlow = (): Generator<undefined, void, unknown> =>
    confirmationModalFlow(confirmDeleteImageModal, (): void => {
      // Make API call to delete the image
    })

  const deleteImageGenerator = useGenerator(deleteImageFlow)

  const handleDeleteImage = (): void => {
    deleteImageGenerator.startGenerator()
    deleteImageGenerator.next()
  }

  return (
    <div>
      <Button type="button" onClick={handleDeleteImage}>
        Delete image
      </Button>

      <DeleteImageModal
        isOpen={confirmDeleteImageModal.isOpen}
        onClose={(): void => {
          deleteImageGenerator.next(false)
        }}
        onConfirm={(): void => {
          deleteImageGenerator.next(true)
        }}
      />
    </div>
  )
}`

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
            When it returns, it's done. so what is that useful for? well I
            learned about generators a couple jobs ago when we were building out
            complex onboarding flows with logic branches. We used Redux sagas,
            which uses generators to orchestrate actions. but now that we have
            GraphQL and we just do everything on the server anyways, we don't
            need Redux or Redux sagas for anything.
          </aside>
        </section>
        <section>
          <h4>async / await</h4>

          <img src={asyncImg.src} />

          <aside className="notes">
            First lets talk about async/await. This lets us start doing
            something that might take some time, wait for it to finish, and then
            continue with what we were doing. Before we had async/await or
            promises, we had to do things with callbacks. IF THERE'S TIME -
            callbacks
          </aside>
        </section>
        <section>
          <h4>async / await</h4>
          <pre>
            <code data-trim className="language-typescript">
              {modalCallback}
            </code>
          </pre>

          <aside className="notes">
            But this only works when the thing we're waiting on is a computer.
            like querying a database or making an API call, the thing we're
            waiting for can tell our code that its done and we can proceed.
          </aside>
        </section>
        <section>
          <h4>async / await</h4>

          <pre>
            <code data-trim className="language-typescript">
              {modalGenerator}
            </code>
          </pre>

          <aside className="notes">
            What if what we're waiting for isn't a computer, but a person? What
            am I talking about? Here's an example - a confirmation modal. Let's
            say we have an app where you can upload images, and if you delete an
            image we want to ask are you really sure? You can do this with
            callbacks. but also generators
          </aside>
        </section>
        <section>
          <h4>async / await</h4>
          <pre>
            <code data-trim className="language-typescript">
              {modalComponent}
            </code>
          </pre>

          <aside className="notes">
            What if what we're waiting for isn't a computer, but a person? What
            am I talking about? Here's an example - a confirmation modal. Let's
            say we have an app where you can upload images, and if you delete an
            image we want to ask are you really sure? You can do this with
            callbacks. but also generators
          </aside>
        </section>
      </div>
    </div>
  )
}

export default App
