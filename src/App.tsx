import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/AuthContext'
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  const GlobalStyles = createGlobalStyle`
    html {
      --color-text-1: ${theme.darkMode ? '#f8f8f8' : '#29292e'};
      --color-text-2:${theme.darkMode ? '#29292e' : '#f8f8f8'};
      --color-text-3: #737380;
      --color-text-4: #a8a8b3;
      --color-background-1:  ${theme.darkMode ? '#29292e' : '#f8f8f8'};
      --color-background-2:  ${theme.darkMode ? '#2d2d33' : '#fefefe'};
      --color-background-3:  #f4f0ff;
      --color-background-4:  ${theme.darkMode ? '#4c4c4c' : '#dbdcdd'};
      --color-border-1:  #a8a8b3;
      --color-border-2:  #e2e2e2;
      --color-primary:  ${theme.primary};
      --color-primary-2:  ${theme.primary_2};
      --color-secondary:  ${theme.secondary};
      --color-secondary-2:  ${theme.secondary_2};
    }
  `;

  return (
      <BrowserRouter>
        <AuthContextProvider>
          <GlobalStyles />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />
            <Route path="/admin/rooms/:id" component={AdminRoom} />
            <Route path="*" render={() => <Redirect to='/' />} />
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;
