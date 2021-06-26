import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { MissingRoom } from './pages/MissingRoom';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact render={() => <Home />} />
          <Route path="/rooms/new" render={() => <NewRoom />} />
          <Route path="/rooms/missing" render={() => <MissingRoom />} />
          <Route path="/rooms/:id" render={() => <Room />} />
          <Route path="/admin/rooms/:id" render={()=> <AdminRoom />} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
