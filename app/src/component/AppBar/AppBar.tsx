import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
// import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
// import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

import * as AuthService from '../../service/AuthService'
import { transitionToLoginPage } from '../../util/transition';
import { P_LIGHT_BLUE } from '../../config/Color';
import AppBarStore from '../../redux/component/AppBar/AppBarStore';
import { AppBarConfig } from '../../model/common'
import { AppState } from 'src/redux';

type MergedProps = StateProps & DispatchProps & StyledComponentProps;
class PrimarySearchAppBar extends React.Component<MergedProps, any> {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleProfileMenuOpen = (event: React.SyntheticEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  transitionToProfile = () => {
    this.handleMenuClose();
    location.href = '#/profile';
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event: React.SyntheticEvent) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const classes = this.props.classes as any;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const config: AppBarConfig  = this.props.appBar.get('config').toJS();

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.transitionToProfile}>Profile</MenuItem>
        <MenuItem onClick={this.logout}>LogOut</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {/*}
        <MenuItem>
          <IconButton color='inherit'>
            <Badge className={classes.margin} badgeContent={11} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        */}
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color='inherit'>
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position='static' className={classes.appBar}>
          <Toolbar>
            {/*
            <IconButton className={classes.menuButton} color='inherit' aria-label='Open drawer'>
              <MenuIcon />
            </IconButton>
            */}
            <Typography className={classes.title} variant='h6' color='inherit' noWrap>
            <a href='#/dashboard' style={{ color: 'white', display: 'block', textDecoration: 'none' }}>ProCan</a>
            </Typography>
            { config && config.isShowSearch && 
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder='Search…'
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  onKeyDown={config.searchAction}
                />
              </div>
            }
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/*
              <IconButton color='inherit'>
                <Badge className={classes.margin} badgeContent={1} color='secondary'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              */}
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup='true'
                onClick={this.handleProfileMenuOpen}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }

  logout() {
    AuthService.logout().then(() => {
      transitionToLoginPage();
    });
  }
}


const styles = (theme: Theme ) => createStyles({
  root: {
    width: '100%',
    height: 50,
    minHeight: 50,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        height: 48,
        minHeight: 50,
      },
    [theme.breakpoints.up('sm')]: {
        height: 50,
        minHeight: 50,
      }
  },
  appBar: {
    backgroundColor: P_LIGHT_BLUE
  },
  regular: {
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

export interface StateProps {
  appBar: AppBarStore;
}
export interface DispatchProps {
}
const mapStateToProps = (state: AppState) => {
  return { appBar: state.component.appBar };
}
const mapDispatchToProps = (dispatch: any) => {
  return {}
}

const styled = withStyles(styles as any)(PrimarySearchAppBar as any);
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(styled);
