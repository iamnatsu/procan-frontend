import { createMuiTheme } from '@material-ui/core/styles';

export const topMuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#fff"
    }
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      contained: {
        color: '#88C542',
        backgroundColor: "white"
      }
    },
    MuiInputLabel: {
      root: {
        color: 'white',
      }
    },
    MuiFormLabel: {
      focused: {
        "&$focused": {
          color: "white"
        }
      }
    },
    MuiInput: {
      root: {
        color: 'white',
      },
      underline: {
        '&:before': {
          borderBottom: '1px solid #fff',
        },
        '&:hover:before': {
          borderBottom: '1px solid #fff',
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: '1px solid #fff',
        },
        '&:after': {
          borderBottom: '2px solid #fff',
        },
      }
    },
  }
});