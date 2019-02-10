import React, { Component } from 'react'
import { WrappedFieldArrayProps } from 'redux-form';
import { connect } from 'react-redux';
import { User } from '../../model/user'
import { IconButton, Avatar } from '@material-ui/core';
import { withStyles, StyledComponentProps } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import { UserCardDispatcher } from '../../redux/component/UserCard/UserCardDispatcher';
import Label from './Lable'
import { FIELD_STYLE } from '../../config/Style';
import AddIcon from '@material-ui/icons/AddCircle';

export interface AssigneeProps {
  label: string;
  style?: React.CSSProperties;
}
type MergedProps = AssigneeProps & DispatchProps & WrappedFieldArrayProps<User> & StyledComponentProps;

class Assignee extends Component<MergedProps, any> {
  render() {
    const { classes, style, label } = this.props;
    if (!classes || !classes.button) return null;

    const styles = style ? Object.assign({}, FIELD_STYLE, style) : FIELD_STYLE;
    return (
      <div style={styles}>
        <Label caption={label} />
        <div style={{marginTop: '5px'}}>{ this.renderAvatar() }</div>
        <IconButton aria-label="Clear" className={classes.addCircle} onClick={this.handleOpenUserSelector.bind(this)}>
          <AddIcon />
        </IconButton>
      </div>
    )
  }

  handleOpenUserSelector(event: React.MouseEvent<HTMLInputElement>) {
    this.props.action.userSelector.show(event.target as any, this.handleUserSelect.bind(this));
  }

  renderAvatar() {
    if (!this.props.fields.getAll()) return null;
    return this.props.fields.getAll().map((u, index) => {
      return <Avatar key={'task-' + u.id} onClick={((e: React.MouseEvent<HTMLInputElement>) => { this.handleOpenUserCard(e, u, index)}).bind(this)} 
        style={{ width: 36, height: 36, float: 'left', fontSize: '16px', cursor: 'pointer'}}>
        {u && u.name ? u.name.substr(0, 1) : '?'}</Avatar>
    })
  }

  handleOpenUserCard(event: React.MouseEvent<HTMLInputElement>, user: User, index: number) {
    this.props.action.userCard.show(event.target as any, user, (() => this.unAssign(index)).bind(this));
  }

  unAssign(index: number) {
    this.props.fields.remove(index);
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
    userSelector: UserSelectorDispatcher,
    userCard: UserCardDispatcher,
  };
}

function mapStateToProps(state: any) {
  return { };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      userSelector: new UserSelectorDispatcher(dispatch),
      userCard: new UserCardDispatcher(dispatch)
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: MergedProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  button: {
      minHeight: '36px',
      height: '36px',
      minWidth: '36px',
      width: '36px',
      borderRadius: '18px',
      border: 'solid 1px lightgray',
      padding: 0,
      lineHeight: 1
  },
  addCircle: {
    padding: '7px',
  }
};

const styled = withStyles(styles)(Assignee)
const connected: React.ComponentClass<MergedProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(styled);
//export default Assignee as React.ComponentClass<MergedProps>;
export default connected;
