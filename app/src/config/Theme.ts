import { createMuiTheme } from '@material-ui/core/styles';
import { MAIN_COLOR, ACCENT_COLOR, P_LIGHT_BLUE } from './Color';

export const topMuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff'
    }
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      contained: {
        color: P_LIGHT_BLUE,
        backgroundColor: 'white'
      }
    },
    MuiInputLabel: {
      root: {
        color: 'white',
      }
    },
    MuiFormLabel: {
      focused: {
        '&$focused': {
          color: 'white'
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

export const appTheme = createMuiTheme({
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
      },
      label: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    },
    MuiToolbar: {
      regular: {
        '@media (min-width: 600px)': {
          minHeight: '50px'
        }
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    MuiPopover: {
      paper: {
        padding: 10
      }
    }
  }
});
