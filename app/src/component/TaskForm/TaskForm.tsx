import * as React from 'react';
import { connect } from 'react-redux';
import {  reduxForm, InjectedFormProps, Field, FieldArray } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Task } from '../../model/task';
import { TaskFormState as _TaskFormState } from 'src/redux/component/TaskForm/TaskFormReducer';
import Text from '../Fields/Text';
import Select from '../Fields/Select';
import { Button } from '@material-ui/core';
import { ProjectState } from 'src/redux/Project/ProjectReducer';
import { Project } from 'src/model/project';
import Assignee from '../Fields/Assignee';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onClose?: () => void;
  onSubmit?: any;
}
export interface TaskFormState {
}
type TaskFormProps = OwnProps & InjectedFormProps<Task, OwnProps, TaskFormState> & DispatchProps & StateProps;

class TaskForm extends React.Component<TaskFormProps, TaskFormState> {
  render(): JSX.Element { 
    const project: Project = this.props.project.getProject().toJS();
    const style = Object.assign({}, this.props.style, { padding: '10px' })
    return (
      <form autoComplete='off' className='task' style={style} onSubmit={this.props.handleSubmit}>
        <Field autoComplete='off' component={Text} name='name' label={'name'} autoFocus></Field>
    {/*false && <Field component={Text} name='statusId' label={'status'}></Field> */}
        <Field component={Select} name='statusId' label={'statusId'} options={this.toOptions(project.statuses)}></Field>
        <FieldArray component={Assignee} name='assignees'></FieldArray>
        <footer style={{ marginTop: '10px' }}>
          <Button type='submit' variant='contained' color='primary' style={{ width: '100px'}}>OK</Button>
          <Button type='button' color='secondary' style={{ width: '100px', marginLeft: '10px' }} onClick={this.props.onClose}>CANCEL</Button>
        </footer>
      </form>
    );
  }

  toOptions(statuses: Project['statuses']) {
    return statuses.map(status => { return { value: status.id, caption: status.name } });
  }
}

interface StateProps {
  taskForm: _TaskFormState
  project: ProjectState
}

interface DispatchProps {
}

function mapStateToProps(state: AppState) {
  const task = state.component.taskForm.getTask().toJS();
  return {
    taskForm: state.component.taskForm,
    project: state.project,
    initialValues: task //state.component.taskForm.getTask().toJS()
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
  };
}
function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: TaskFormProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const reduxFormObject: any = reduxForm<Task, OwnProps, TaskFormState>({ form: FormName.TaskForm, enableReinitialize: true})(TaskForm);
const connected: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormObject);

export default connected;

