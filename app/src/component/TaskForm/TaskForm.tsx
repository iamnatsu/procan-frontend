import * as React from 'react';
import { connect } from 'react-redux';
import { reduxForm, InjectedFormProps, Field, FieldArray, FormProps, change } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { Task } from '../../model/task';
import { TaskFormState as _TaskFormState } from 'src/redux/component/TaskForm/TaskFormReducer';
import Text from '../Fields/Text';
//import Select from '../Fields/Select';
import DateField from '../Fields/Date';
import { Button } from '@material-ui/core';
import { ProjectState } from 'src/redux/Project/ProjectReducer';
import { Project } from 'src/model/project';
import Assignee from '../Fields/Assignee';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onClose?: () => void;
  onSubmit?: any;
  onDelete?: (id: string) => void;
}
export interface TaskFormState {
}
type TaskFormProps = OwnProps & InjectedFormProps<Task, OwnProps, TaskFormState> & DispatchProps & StateProps;
type MergedProps = TaskFormProps & FormProps<Task, TaskFormProps, TaskFormState>;

class TaskForm extends React.Component<MergedProps, TaskFormState> {
  render(): JSX.Element { 
    //const project: Project = this.props.project.getProject().toJS();
    const style = Object.assign({}, this.props.style, { padding: '10px' });
    return (
      <form autoComplete='off' className='task' style={style}>
          <IconButton aria-label="Clear" style={{position: 'absolute', top: '0px', right: '5px', zIndex: 1}}
            onClick={(() => {if (this.props.onClose) this.props.onClose()}).bind(this)}>
            <ClearIcon />
          </IconButton>
          <div className='clearfix'>
          <Field autoComplete='off' component={Text} name='name' label={'name'} autoFocus={true} fullWidth={true} style={{width: '500px'}}></Field>
          { /*}
          <Field component={Select} name='statusId' label={'statusId'} options={this.toOptions(project.statuses)}></Field>
          */}
          <FieldArray component={Assignee} name='assignees' label='assignees'></FieldArray>
          <Field component={Text} name='progress' label={'progress'} type='number' placeholder='%' inputProps={{min:0, max: 100}}></Field>
          <Field component={DateField} name='expectedStartDay' label={'expectedStartDay'} style={{ float: 'left' }}
                  onChangeValue={((date: number) => {this.onChangeDate('expectedStartDay', date)}).bind(this)}></Field>
          <Field component={DateField} name='expectedEndDay' label={'expectedEndDay'} style={{ float: 'left' }}
                  onChangeValue={((date: number) => {this.onChangeDate('expectedEndDay', date)}).bind(this)}></Field>
          <div style={{clear: 'both'}}></div>
          <Field component={Text} name='expectedCost' label={'expectedCost'} type='number' placeholder='人日'></Field>
          <Field component={DateField} name='actualStartDay' label={'actualStartDay'} style={{ float: 'left' }}
                  onChangeValue={((date: number) => {this.onChangeDate('actualStartDay', date)}).bind(this)}></Field>
          <Field component={DateField} name='actualEndDay' label={'actualEndDay'} style={{ float: 'left' }}
                  onChangeValue={((date: number) => {this.onChangeDate('actualEndDay', date)}).bind(this)}></Field>
          <div style={{clear: 'both'}}></div>
          <Field component={Text} name='actualCost' label={'actualCost'} type='number' placeholder='人日'></Field>
          <footer style={{ marginTop: '10px' }}>
          { this.props.taskForm.getTask().get('id') && 
            <Button type='button' color='default' style={{ position: 'absolute', right: '10px', textDecoration: 'underline' }}
              onClick={(() => { if (this.props.onDelete) this.props.onDelete(this.props.taskForm.getTask().get('id'))}).bind(this)}>
              <DeleteIcon />
              DELETE</Button> }
        </footer>
        </div>
      </form>
    );
  }

  toOptions(statuses: Project['statuses']) {
    return statuses.map(status => { return { value: status.id, caption: status.name } });
  }

  onChangeDate(target: string, value: number) {
    this.props.dispatch(change(FormName.TaskForm, target, value ? new Date(value) : null));
  }
}

interface StateProps {
  taskForm: _TaskFormState
  project: ProjectState
}

interface DispatchProps {
  dispatch: any;
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

