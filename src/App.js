import logo from './logo.svg';
import './App.css';
import Header from './components/Header'; // 확장자(js) 생략가능
import Contents from './components/Contents';

function App() {
  return (
    <div className="App">
      <Header /> {/* 컴포넌트를 분리 후 import */}
      <Contents />
    </div>
  );
}

export default App;
