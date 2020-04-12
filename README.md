# Udacity: React Nanodegree - Project 1 (MyReads)

To get started developing right away:

* install all project dependencies with `npm install`
* start the development server with `npm start`

Dependencies used:
`react-spinners` : loading spinner for UI purposes
`react-toastify` : alert library

Components can be found in the `src/components/` directory

Helper functions can be found in `src/helpers` director (All works cited on top of files)
- debounce function was taken from David Walsh Blog as a way to optimize the searching algorithm
- formatShelf uses a regex from StackOverflow 

Things to note:
1. I chose to include the BooksAPI module within the root component, and have events be passed up from child components to parent components to communicate changes
2. There were cases where props needed to be passed down to child components, and the state of those components depended on those props
- In these cases, `getDerivedStateFromProps` was used in the `BooksList` component
3. This application would benefit from a stronger state management sysem, i.e. Redux, since there are situations where props are being passed down through intermediary components without ever being used
- Ex. `updateBooks` prop for `BooksList` and `SearchBooks` component
- If we had a global store, you would never need to call an `updateBooks` hook, and would be able to commit a mutation to the store's state directly from the component that needed to
4. The console is throwing an error related to the `react-toastify` library, insinuating that the DOMNode is not being removed properly
   
Thanks very much and hope you enjoy playing around with this reading list!
