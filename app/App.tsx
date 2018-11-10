import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
//import { ConnectedRouter } from 'react-router-redux';
import { HashRouter } from "react-router-dom";
import { reducers, middlewares } from "./src/redux/";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { MAIN_COLOR, ACCENT_COLOR/*, ACCENT_COLOR, GREY*/ } from "./src/config/Color";
//import * as injectTapEventPlugin from "react-tap-event-plugin";

import App from "./src/container/Base/Base";

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: ACCENT_COLOR
    }
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: 'none !important',
      }
    },
    MuiButton: {
      contained: {
        color: 'white',
        backgroundColor: MAIN_COLOR
      }
    },
    MuiToolbar: {
      regular: {
        '@media (min-width: 600px)': {
          minHeight: "50px"
        }
      },
    }
  }
});

const store = createStore(reducers, middlewares);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <MuiThemeProvider theme={muiTheme}>
        <App />
      </MuiThemeProvider>
    </HashRouter>
  </Provider>,
  document.getElementById("app")
);
