import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button, Avatar, Popover, Typography, withStyles, StyledComponentProps } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
//import { User } from '../../model/user';
import { AppState } from 'src/redux';
import { UserCardDispatcher } from '../../redux/component/UserCard/UserCardDispatcher';
import UserCardStore from '../../redux/component/UserCard/UserCardStore';

export interface UserCardProps { }
export interface UserCardState { }

type MergedProps = StateProps & DispatchProps & UserCardProps & StyledComponentProps;

class UserCard extends Component<MergedProps, UserCardState> {
  render() {
    const isShow = this.props.userCard.get('isShow');
    const anchorEl = this.props.userCard.get('anchorEl');
    const user = this.props.userCard.get('user');
    const { classes } = this.props;

    if (!classes) return null;
    return (
      <div style={{ margin: '5px' }}>
        <Popover
          classes={{
            paper: classes.paper
          }}
          id="simple-popper"
          open={isShow}
          onClose={this.handleClose.bind(this)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
        <div>
          <Avatar style={{ width: 36, height: 36, float: 'left', fontSize: '16px', marginRight: '5px'}}>
            {user && user.get('name') ? user.get('name').substr(0, 1) : '?'}</Avatar>
          <Typography style={{lineHeight: '36px'}}>{user.get('name')}</Typography>
          <Typography style={{lineHeight: '36px', opacity: 0.5}}>{user.get('loginId')}</Typography>
        </div>
        { this.props.userCard.get('onDelete') && 
          <div style={{ marginTop: '5px' }}>
            <Button color='secondary' onClick={this.handleOnDelete.bind(this)}>UNASSIGN</Button>
          </div>
        }
        </Popover>
      </div>
    )
  }

  handleClose() {
    this.props.actions.userCard.close();
  }

  handleOnDelete() {
    const user = this.props.userCard.get('user').toJS();
    const onDelete = this.props.userCard.get('onDelete');
    if (onDelete) onDelete(user);
    this.props.actions.userCard.close();
  }
}

const styles: Record<string, CSSProperties> = {
  paper: {
    minWidth: 250,
    maxWidth: 250,
    minHeight: 56,
  }
};

export interface StateProps {
  userCard: UserCardStore;
}
export interface DispatchProps {
  actions: {
    userCard: UserCardDispatcher;
  }
}

const mapStateToProps = (state: AppState) => {
  return { userCard: state.component.userCard };
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
      userCard: new UserCardDispatcher(dispatch) 
    }
  };
}
const connected = withStyles(styles)(UserCard)
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(connected);
