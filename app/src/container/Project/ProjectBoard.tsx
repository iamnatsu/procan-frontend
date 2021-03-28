import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { StyledComponentProps, CSSProperties } from '@material-ui/core/styles/withStyles';
import { P_IVORY } from '../../config/Color';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatchFunctions } from '../../redux/Project/ProjectDispatchFunctions';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatchFunctions } from '../../redux/component/MessageDialog/MessageDialogDispatchFunctions';
import { withStyles } from '@material-ui/core/styles';
import { DropTargetCollector, DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget, DropTargetSpec } from 'react-dnd';
import { ItemTypes } from '../../config/DnDItemType';
import { Button, TextField } from '@material-ui/core';
import ProjectStatus from './ProjectStatus';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Project } from '../../model/project';
import { Status } from '../../model/status';
import { default as CustomScrollbars } from 'react-custom-scrollbars';

export interface ProjectBoardProps {
  connectDropTarget?: ConnectDropTarget;
}
export interface ProjectBoardState { 
  isOpenStatusDialog: boolean;
  statusName: string;
}

interface DropProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  itemType: string | symbol | null;
}

type MergedProps = StateProps & DispatchProps & ProjectBoardProps & StyledComponentProps;

class ProjectBoard extends React.Component<MergedProps, ProjectBoardState> {
  constructor(props: MergedProps) {
    super(props);
    this.state = {
      isOpenStatusDialog: false,
      statusName: ''
    }
  }

  componentDidUpdate() {
    this.isMoving = false;
  }

  render() {
    const { connectDropTarget } = this.props;
    if (!connectDropTarget) return null;

    const project = this.props.project.getProject()
    if (!project || !project.toJS().id) return null;
    let statusCount = 0;
    if (project.get('statuses')) {
      statusCount = project.get('statuses').length | 0;
    } 
    const style = { width: '100%', height: '100%', backgroundColor: P_IVORY };
    this.isMoving = false;
    return <span>{ connectDropTarget(
      <div style={style}>
        <CustomScrollbars renderThumbHorizontal={this.renderThumbHorizontal.bind(this)}>
          <div style={{height: '100%', width: statusCount * (250 + 10) + 300}}>
            { this.renderProjectStatuses(project.toJS()) }
            <p><Button onClick={this.handleOpenStatus.bind(this)} color='primary' style={{marginTop: '10px'}}>ステータス（リスト）を追加</Button></p>
          </div>
        </CustomScrollbars>
    </div>)}
    <Dialog
          open={this.state.isOpenStatusDialog}
          onClose={this.handleCloseStatus.bind(this)}
          aria-labelledby='form-dialog-title'
        >
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='ステータス名'
              fullWidth
              onChange={this.handleChangeStatusName.bind(this)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseStatus.bind(this)} color='secondary'>
              Cancel
            </Button>
            <Button onClick={this.handleAddStatus.bind(this)} disabled={!this.state.statusName} color='primary'>
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </span>;
  }

  renderThumbHorizontal({ style, ...props }: any) {
    const finalStyle = {
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(0,0,0,.2)',
      position: 'relative',
      height: '100%',
      zIndex: 10
    };
    return <div style={finalStyle} {...props} />;
  }


  renderProjectStatuses(project: Project) {
    if (!project || !project.statuses || project.statuses.length <= 0) return;

    const row: any[] = [];
    const sorted = project.statuses.sort(this.statusComparator);
    sorted.forEach(s => {
      row.push(<ProjectStatus key={s.id} id={s.id || ''} name={s.name} pos={s.pos} handleMoveStatus={this.handleMoveStatus.bind(this)}></ProjectStatus>);
    });
    return row;
  }

  handleMoveStatus(dragId: string, hoverId: string) {
    if (this.isMoving) return;
    this.isMoving = true;
    const project: Project  = this.props.project.getProject().toJS();
    const s1 = project.statuses.find(s => s.id === dragId);
    const s2 = project.statuses.find(s => s.id === hoverId);
    if (s1 === undefined) return;
    if (s2 === undefined) return;
    const s1pos = s1.pos;
    const s2pos = s2.pos;
    s1.pos = s2pos;
    s2.pos = s1pos;
    const sorted = project.statuses.sort(this.statusComparator)
    project.statuses = sorted;
    this.props.action.project.updateProject(project);
  }
  private isMoving = false;
  
  statusComparator(s1: Status, s2: Status) {
    if (s1.pos < s2.pos) return -1;
    if (s1.pos > s2.pos) return 1;
    return 0;
  }
  
  handleCloseStatus() {
    this.setState({ isOpenStatusDialog: false });
  }

  handleOpenStatus() {
    this.setState(Object.assign({}, this.state, { statusName: ''}));
    this.setState({ isOpenStatusDialog: true });
  }

  handleChangeStatusName(event: React.SyntheticEvent<HTMLInputElement>) {
    this.setState(Object.assign({}, this.state, { statusName: event.currentTarget.value}));
  }

  handleAddStatus() {
    this.props.action.project.addStatus(this.props.project.getProject().toJS().id, this.state.statusName).then(() => {
      this.setState({ isOpenStatusDialog: false });
    })
  }
}


interface StateProps {
  project: ProjectState;
  messageDialog: MessageDialogState;
}

interface DispatchProps {
  action: {
    project: ProjectDispatchFunctions,
    messageDialog: MessageDialogDispatchFunctions
  };
}

function mapStateToProps(state: AppState) {
  return { 
    project: state.project,
    messageDialog: state.component.messageDialog
   };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      project: new ProjectDispatchFunctions(dispatch),
      messageDialog: new MessageDialogDispatchFunctions(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectBoardProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  card: {
    minWidth: 200,
    maxWidth: 200,
    margin: '0 10px 10px 0',
    float: 'left'
  },
  action: {
    width: '100%'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

const dropCollect: DropTargetCollector<DropProps> = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    itemType: monitor.getItemType()
  }
}
const dropTarget: DropTargetSpec<any> = {
  drop(props: ProjectBoardProps, monitor: any) {
    return;
  }
};

const connected = DropTarget<ProjectBoardProps>([ItemTypes.STATUS], dropTarget, dropCollect)(ProjectBoard);
const container = connect<StateProps, DispatchProps, ProjectBoardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(connected);
export default withStyles(styles)(container) as React.ComponentClass<ProjectBoardProps>;
