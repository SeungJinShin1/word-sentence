import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// App 컴포넌트를 id가 'root'인 HTML 요소에 연결합니다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)