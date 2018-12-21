import * as React from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import MessageDialogStore, { MessageDialogActionMap } from '../../redux/component/MessageDialog/MessageDialogStore';
import { AppState } from 'src/redux';

export interface StateProps {
  MessageDialog: MessageDialogStore;
}
export interface DispatchProps {
  actions: MessageDialogDispatcher;
}
type MessageDialogProps = StateProps & DispatchProps;

export interface MessageDialogState {}

export class MessageDialog extends React.Component<MessageDialogProps, MessageDialogState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (!this.props.MessageDialog.isShow()) return null;
    return (
      <Dialog open={this.props.MessageDialog.isShow()}>
        {this.props.MessageDialog.getTitle() && <DialogTitle>{this.props.MessageDialog.getTitle()}</DialogTitle>}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {this.renderInner(this.props.MessageDialog.getMessageList())}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {this.renderActions()}
        </DialogActions>
      </Dialog>
    );
  }

  renderInner(messageList: Array<any>) {
    let result = [];
    let index = 1;
    for (const message of messageList) {
      if (message && message.message === '\n') {
        result.push(<span key={'message-' + index} style={{ height: '25px', display: 'block' }} />);
      } else {
        result.push(<span key={'message-' + index} style={{ display: 'block' }} >{this.renderCode(message.code) + message.message + this.renderDetail(message)}</span>);
      }
      index++;
    }
    return result;
  }

  renderCode(code?: string) {
    return (code != null) ? '[code=' + code + '] ' : '';
  }

  renderDetail(message: any) {
    if (message.target && message.value) {
      return '(' + message.target + ':' + message.value + ')';
    } else if (message.target) {
      return '(' + message.target + ')';
    } else if (message.value) {
      return '(' + message.value + ')';
    } else {
      return '';
    }

  }

  renderActions() {
    const buttons: any = [];
    buttons.push(
      <Button key='close' onClick={this.closeAction.bind(this)} autoFocus>close</Button>
    );
    const actionMap: MessageDialogActionMap = this.props.MessageDialog.getActionMap() ? this.props.MessageDialog.getActionMap().toJS() : {};
    if (actionMap && Object.keys(actionMap).length > 0) {
      Object.keys(actionMap).forEach(k => {
        buttons.push(
          <Button key={k} onClick={actionMap[k].action.bind(this)} color={actionMap[k].color} >{actionMap[k].caption}</Button>
        );
      })
    }
    return buttons;
  }

  closeAction() {
    this.props.actions.closeMessage();
    let action = this.props.MessageDialog.getModalAction()
    if (action) action();
  }
}

const mapStateToProps = (state: AppState) => {
  return { MessageDialog: state.component.messageDialog };
}
const mapDispatchToProps = (dispatch: any) => {
  return { actions: new MessageDialogDispatcher(dispatch) }
}
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(MessageDialog);
