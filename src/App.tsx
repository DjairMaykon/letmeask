import { Button } from './components/Button'
import { ButtonCount } from './components/ButtonCount'

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button text="Botão 1" />
      <Button>Botão 2</Button>
      <ButtonCount />
    </div>
  );
}

export default App;
