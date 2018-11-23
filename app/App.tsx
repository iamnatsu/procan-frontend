import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { reducers, middlewares } from './src/redux/';
import  './i18n';
import { MuiThemeProvider} from '@material-ui/core/styles';
import { appTheme } from './src/config/Theme';
import App from './src/container/Base/Base';

//import * as injectTapEventPlugin from 'react-tap-event-plugin';
//import { ConnectedRouter } from 'react-router-redux';

const store = createStore(reducers, middlewares);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <MuiThemeProvider theme={appTheme}>
        <App />
      </MuiThemeProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);
