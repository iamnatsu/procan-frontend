import * as React from 'react';
import { connect } from 'react-redux';
import { reduxForm, InjectedFormProps, Field, FieldArray } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Group } from '../../model/group';
import { DashBoardState } from 'src/redux/DashBoard/DashBoardReducer';
import Text from '../Fields/Text';
import { Button } from '@material-ui/core';
import Assignee from '../Fields/Assignee';
import DeleteIcon from '@material-ui/icons/Delete';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onDelete?: (groupId: string) => void;
  onClose?: () => void;
  onSubmit?: any;
}
export interface GroupFormState {
}

type GroupFormProps = OwnProps & InjectedFormProps<Group, OwnProps, GroupFormState> & DispatchProps & StateProps;

class GroupForm extends React.Component<GroupFormProps, GroupFormState> {
  render(): JSX.Element { 
    const style = Object.assign({}, this.props.style, { padding: '15px' })
    return (
      <form className='group' style={style} onSubmit={this.props.handleSubmit}>
        <Field component={Text} name='name' fullWidth={true} autoFocus={true}></Field>
        <br />
        <FieldArray component={Assignee} name='assignees' label='メンバー'></FieldArray>
        <footer style={{ marginTop: '10px' }}>
          <Button type='submit' variant='contained' color='primary' style={{ width: '100px'}}>OK</Button>
          <Button type='button' color='secondary' style={{ width: '100px', marginLeft: '10px' }} onClick={this.props.onClose}>CANCEL</Button>
          { this.props.dashboard.getGroup().get('id') && 
            <Button type='button' color='default' style={{ position: 'absolute', right: '10px', textDecoration: 'underline' }}
              onClick={(() => { if (this.props.onDelete) this.props.onDelete(this.props.dashboard.getGroup().get('id'))}).bind(this)}>
              <DeleteIcon />
              DELETE</Button> }
        </footer>
      </form>
    );
  } 
}

interface StateProps {
  dashboard: DashBoardState
}

interface DispatchProps {
}

function mapStateToProps(state: AppState) {
  return {
    dashboard: state.dashboard,
    initialValues: state.dashboard.getGroup().toJS()
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
  };
}
function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: GroupFormProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const reduxFormObject: any = reduxForm<Group, OwnProps, GroupFormState>({ form: FormName.GroupForm, enableReinitialize: true})(GroupForm);
const connected: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormObject);

export default connected;

