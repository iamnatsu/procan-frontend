import React, { Component } from 'react'
import { WrappedFieldArrayProps } from 'redux-form';
import { connect } from 'react-redux';
import { User } from '../../model/user'
import { Button, Avatar } from '@material-ui/core';
import UserSelector from '../../component/UserSelector/UserSelector'
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import Label from './Lable'

export interface AssigneeProps {
  label: string;
}
type MergedProps = AssigneeProps & DispatchProps & WrappedFieldArrayProps<User>;

class Assignee extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ marginTop: '5px' }}>
        <Label caption={this.props.label} />
        { this.renderAvatar() }
        <UserSelector />
        <Button onClick={this.handleOpenUserSelector.bind(this)}>+</Button>
      </div>
    )

  }

  handleOpenUserSelector(event: React.MouseEvent<HTMLInputElement>) {
    this.props.action.userSelector.show(event.target as any, this.handleUserSelect.bind(this));
  }

  renderAvatar() {
    if (!this.props.fields.getAll()) return null;
    return this.props.fields.getAll().map(u => {
      return <Avatar key={'task-' + u.id} style={{ width: 36, height: 36, float: 'left', fontSize: '16px'}}>
        {u && u.name ? u.name.substr(0, 1) : '?'}</Avatar>
    })
  }

  handleUserSelect(users: { [id: string]: User }) {
    const { fields } = this.props;
    Object.keys(users).forEach(id => {
      if (!fields.getAll() || fields.getAll().filter(u => u.id === id).length <= 0) {
        fields.push(users[id]);
      }
    });
  }
}

interface StateProps {
}

interface DispatchProps {
  action: {
    userSelector: UserSelectorDispatcher
  };
}

function mapStateToProps(state: any) {
  return { };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      userSelector: new UserSelectorDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: MergedProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const connected: React.ComponentClass<MergedProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Assignee);
//export default Assignee as React.ComponentClass<MergedProps>;
export default connected;
