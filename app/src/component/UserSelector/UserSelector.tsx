import React, { Component } from 'react'
import { connect } from 'react-redux';
import { WrappedFieldProps } from 'redux-form';
import { Button, Popover, Typography, TextField, withStyles, StyledComponentProps } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import * as UserService from '../../service/UserService';
import { User } from '../../model/user';
import { AppState } from 'src/redux';
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import UserSelectorStore from '../../redux/component/UserSelector/UserSelectorStore';

export interface UserSelectorProps {
  onSubmit?: (selected: string[]) => void;
}
export interface UserSelectorState { }

type MergedProps = StateProps & DispatchProps & UserSelectorProps & WrappedFieldProps & StyledComponentProps;

class UserSelector extends Component<MergedProps, UserSelectorState> {
  render() {
    const isShow = this.props.userSelector.get('isShow');
    const anchorEl = this.props.userSelector.get('anchorEl');
    const { classes } = this.props;

    if (!classes) return null;
    return (
      <div style={{ marginTop: '5px' }}>
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
          <Typography>select assignee</Typography>
          <TextField fullWidth={true} onKeyDown={this.handleOnChange.bind(this)} placeholder="search by e-mail..." autoFocus />
          <Typography style={{marginTop: 10}}>target</Typography>
          <div style={{width: 280, height: 150, border: 'solid 1px #ddd', borderRadius: 4, overflowY: 'scroll'}}>
            {this.renderCandidates()}
          </div>
          <div style={{ textAlign: 'right', marginTop: '5px' }}>
            <Button color='primary' onClick={this.handleSubmit.bind(this)}>OK</Button>
            <Button color='secondary' onClick={this.handleClose.bind(this)}>CANCEL</Button>
          </div>
        </Popover>
      </div>
    )
  }

  renderCandidates() {
    const candidates: User[] = this.props.userSelector.getCandidates().toJS();
    if (!candidates || candidates.length <= 0) return null;

    const selections: { [id: string]: User } = this.props.userSelector.getSelections().toJS() || {};
    return candidates.map(c =>
      <div key={c.id} className={selections[c.id] ? 'candidate selected' : 'candidate'}
        onClick={(() => {this.selectCandidate(c)}).bind(this)}>{c.name}</div>
    )
  }

  selectCandidate(c: User) {
    let selections: { [id: string]: User } = this.props.userSelector.getSelections().toJS() || {};
    if (selections[c.id]) {
      delete selections[c.id];
    } else {
      selections[c.id] = c;     
    }
    this.props.actions.updateSelections(selections)
  }

  handleSubmit() {
    this.props.actions.close();
    if (this.props.onSubmit) this.props.onSubmit(this.props.userSelector.getSelections().toJS());
  }

  handleClose() {
    this.props.actions.close();
  }

  handleOnChange(event: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>) {
    if (event.keyCode === 13 && event.target && event.target.value) {
      UserService.suggest({key: 'loginId', value: event.target.value}).then(res => {
        this.props.actions.updateCandidate(res.data);
      })
    }
  }

}

const styles: Record<string, CSSProperties> = {
  paper: {
    minWidth: 300,
    maxWidth: 300,
    maxHeight: 300,
    minHeight: 300,
  }
};

export interface StateProps {
  userSelector: UserSelectorStore;
}
export interface DispatchProps {
  actions: UserSelectorDispatcher;
}

const mapStateToProps = (state: AppState) => {
  return { userSelector: state.component.userSelector };
}
const mapDispatchToProps = (dispatch: any) => {
  return { actions: new UserSelectorDispatcher(dispatch) }
}
const connected = withStyles(styles)(UserSelector)
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(connected);
