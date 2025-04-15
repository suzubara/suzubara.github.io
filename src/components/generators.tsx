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

 const asyncExample = `async function myFunction() {
  await someOtherFunction();
  return 1;
}
`
  const modalCallback = `const MyImages = (): React.ReactElement => {
  // this is just a hook for tracking modal state
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
            <br /><br />
            I kind of have one? I learned about them at a previous job, where 
            we had to build a complex onboarding flow. We used Redux sagas which 
            use generators under the hood. So they're useful for building user 
            flows, but why?
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
            Ok so what is a generator? this is a lightning talk, not a deep
            dive, so I'm keeping it simple. A generator is a special kind of
            function, you know it's special because of the star.
            <br /><br />
            It's like a state machine. After defining a generator function, you invoke it
            and then call next to step through. It will pause at each yield.
            When it returns, it's done.
            <br /><br />
            so it's a function that can stop and wait for something before continuing.
            Kind of like something else we know:
          </aside>
        </section>
        <section>
          <h4>async / await</h4>

<pre>
            <code data-trim className="language-typescript">
              {asyncExample}
            </code>
          </pre>

          <aside className="notes">
             async/await! Async functions also fall in this category, it can stop and
            wait for something before it continues. but it can only wait for another
            async function. like making a network call or reading a file - things that are done by computers.
            <br /><br />
            this is useful but what if we want to wait for something that is done by a human?
          </aside>
        </section>
        <section>
          <h4>Confirmation modal</h4>
          <pre>
            <code data-trim className="language-typescript">
              {modalCallback}
            </code>
          </pre>

          <aside className="notes">
            Here's a simple example - a confirmation modal. Let's
            say we have an app where you can upload images, and if you delete an
            image we want to ask are you really sure?
            <br /><br />
            walk through code. we can do this by passing in event handlers which is fine.
            but it gets kind of messy when you have to keep doing this. we have to
            define a bunch of one off functions and then figure out how they all get hooked up together.
          </aside>
        </section>
        <section>
          <h4>Confirmation modal generator</h4>

          <pre>
            <code data-trim className="language-typescript">
              {modalGenerator}
            </code>
          </pre>

          <aside className="notes">
            What if we did it with a generator instead? walk through the code.
            <br /><br />
            now it's a little easier to see the flow and what happens at each step.
          </aside>
        </section>
        <section>
          <h4>Confirmation modal (but better!)</h4>
          <pre>
            <code data-trim className="language-typescript">
                    {modalComponent}
            </code>
          </pre>

          <aside className="notes">
            Walk through code. useGenerator is just a hook I wrote to help it play nice with React.
          </aside>
        </section>
        <section>
          <h4>the end!</h4>
          <p>suzubara.github.io/generators</p>
        </section>
      </div>
    </div>
  )
}

export default App
