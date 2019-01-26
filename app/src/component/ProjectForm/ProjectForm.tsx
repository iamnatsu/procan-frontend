import * as React from 'react';
import { connect } from 'react-redux';
import { reduxForm, InjectedFormProps, Field, change } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Project, PermissionLevel } from '../../model/project';
import { DashBoardState } from 'src/redux/DashBoard/DashBoardReducer';
import Text from '../Fields/Text';
import Select from '../Fields/Select';
import Select2, { SelectOption }  from '../Fields/Select2';
import { Button } from '@material-ui/core';
import { Group } from '../../model/group';

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
    PUBLIC: { value: PermissionLevel.PUBLIC, caption: '全員に公開' },
    GROUP: { value: PermissionLevel.GROUP, caption: 'グループメンバーに公開' },
    ASSIGNEES: { value: PermissionLevel.ASSIGNEES, caption: 'プロジェクトメンバーに公開' },
  }
  render(): JSX.Element { 
    const style = Object.assign({}, this.props.style, { padding: '10px' })
    return (
      <form className='project' style={style} onSubmit={this.props.handleSubmit}>
        <Field component={Text} name='name' label={'name'} autoFocus={true}></Field>
        <Field component={Select} name='permissionLevel' label={'permissionLevel'} options={ProjectForm.options} ></Field>
        <Field component={Select2} name='groupId' label={'groupId'} options={this.getGroupOptions()} onChangeSelect={this.handleGroupChange.bind(this)}></Field>
        <footer style={{ marginTop: '10px' }}>
          <Button type='submit' variant='contained' color='primary' style={{ width: '100px'}}>OK</Button>
          <Button type='button' color='secondary' style={{ width: '100px', marginLeft: '10px' }} onClick={this.props.onClose}>CANCEL</Button>
        </footer>
      </form>
    );
  }

  getGroupOptions(): SelectOption[] {
    const groups: Group[] = this.props.dashboard.getGroups() ? this.props.dashboard.getGroups().toJS() : [];
    return groups.map(g => ({
        value: g.id,
        label: g.name,
      }));
  }

  handleGroupChange(value?: SelectOption) {
    this.props.dispatch(change(FormName.ProjectForm, 'groupId', value ? value.value : null));
  }
}

interface StateProps {
  dashboard: DashBoardState
}

interface DispatchProps {
  dispatch: any;
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

