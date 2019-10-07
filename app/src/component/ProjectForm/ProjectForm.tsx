import * as React from 'react';
import { connect } from 'react-redux';
import { reduxForm, InjectedFormProps, Field, FieldArray, change } from 'redux-form';
import { withNamespaces, TransProps } from 'react-i18next';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Project, PermissionLevel } from '../../model/project';
import { DashBoardState } from 'src/redux/DashBoard/DashBoardReducer';
import Text from '../Fields/Text';
import Select from '../Fields/Select';
import Select2, { SelectOption }  from '../Fields/Select2';
import { Button } from '@material-ui/core';
import { Group } from '../../model/group';
import Assignee from '../Fields/Assignee';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onClose?: () => void;
  onSubmit?: any;
}
export interface ProjectFormState {
}

type ProjectFormProps = OwnProps & InjectedFormProps<Project, OwnProps, ProjectFormState> & DispatchProps & StateProps & TransProps;

class ProjectForm extends React.Component<ProjectFormProps, ProjectFormState> {
  render(): JSX.Element {
    const style = Object.assign({}, this.props.style, { padding: '15px' });
    const t = this.props.t || ((s: string) => s);
    const options = {
      PUBLIC: { value: PermissionLevel.PUBLIC, caption: t('permission_level_public') },
      GROUP: { value: PermissionLevel.GROUP, caption: t('permission_level_group') },
      ASSIGNEES: { value: PermissionLevel.ASSIGNEES, caption: t('permission_level_assignees') },
    };
    return (
      <form className='project' style={style} onSubmit={this.props.handleSubmit}>
        <Field component={Text} name='name' label={'名称'} fullWidth={true} autoFocus={true}></Field>
        <br />
        <FieldArray component={Assignee} name='assignees' label={t('member')}></FieldArray>
        <Field component={Select} name='permissionLevel' label={t('permission_level')} options={options} ></Field>
        <Field component={Select2} name='groupId' label={t('group')} options={this.getGroupOptions()} onChangeSelect={this.handleGroupChange.bind(this)}></Field>
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
const i18n = withNamespaces()(reduxFormObject)
const connected: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(i18n);

export default connected;

