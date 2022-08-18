import './styles/App.css';
import StartScreen from './Component/StartScreen'
import Biliards from "./Component/Biliards";
import Playstation from "./Component/Playstation";
import Confirm from "./Component/Confirm";
import { Router } from "react-router";


function App() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/*<Router location={} navigator={}*/}
        <StartScreen />
    </div>
  );
}

export default App;
