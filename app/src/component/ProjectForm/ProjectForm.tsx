import * as React from 'react';
import { connect } from 'react-redux';
import {  reduxForm, InjectedFormProps, Field } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Project} from '../../model/project';
import { DashBoardState } from 'src/redux/DashBoard/DashBoardReducer';
import Text from '../Fields/Text';
import Select from '../Fields/Select';
import { Button } from '@material-ui/core';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onClose?: () => void;
  onSubmit?: any;
}
export interface ProjectFormState {
}

type ProjectFormProps = OwnProps & InjectedFormProps<Project, OwnProps, ProjectFormState> & DispatchProps & StateProps;

class ProjectForm extends React.Component<ProjectFormProps, ProjectFormState> {
  static options = {
    PUBLIC: { value:'PLUBLIC', caption: '全員に公開' },
    GROUP: { value:'GROUP', caption: 'グループメンバーに公開' },
    ASSIGNEES: { value:'ASSIGNEES', caption: 'プロジェクトメンバーに公開' },
  }
  render(): JSX.Element { 
    const style = Object.assign({}, this.props.style, { padding: '10px' })
    return (
      <form className='project' style={style} onSubmit={this.props.handleSubmit}>
        { false && <Field component='input' name='name'></Field> }
        { true && <Field component={Text} name='name' label={'name'}></Field> }
        <Field component={Select} name='permissionLevel' label={'permissionLevel'} options={ProjectForm.options}></Field>
        <footer style={{ marginTop: '10px' }}>
          <Button type='submit' variant='contained' color='primary' style={{ width: '100px'}}>OK</Button>
          <Button type='button' color='secondary' style={{ width: '100px', marginLeft: '10px' }} onClick={this.props.onClose}>CANCEL</Button>
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
    initialValues: state.dashboard.getProject().toJS()
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
  };
}
function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectFormProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const reduxFormObject: any = reduxForm<Project, OwnProps, ProjectFormState>({ form: FormName.ProjectForm, enableReinitialize: true})(ProjectForm);
const connected: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormObject);

export default connected;

