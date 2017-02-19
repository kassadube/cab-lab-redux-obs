import React from 'react';

function App({ children }) {
  console.log(children);
  return <div>{children}</div>;
}

export default App;