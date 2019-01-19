import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from 'react-router';
import { withNamespaces, TransProps } from 'react-i18next';
import Modal from '@material-ui/core/Modal';
import { P_RED, P_IVORY } from '../../config/Color';
import { MODAL_STYLE } from '../../config/Style';
import * as AuthService from '../../service/AuthService'
import * as ProjectService from '../../service/ProjectService'
import { transitionToLoginPage } from '../../util/transition';
import { DashBoardDispatcher } from '../../redux/DashBoard/DashBoardDispatcher';
import { DashBoardState } from '../../redux/DashBoard/DashBoardReducer';
import ProjectForm from '../../component/ProjectForm/ProjectForm';
import { Project } from '../../model/project';
import { Button } from '@material-ui/core';
import { List } from 'immutable';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { StyledComponentProps, ClassNameMap, CSSProperties } from '@material-ui/core/styles/withStyles';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';

import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';

export interface DashBoardProps extends RouteComponentProps<any> {
}

export interface DashBoardViewerState extends React.Props<any> {
  toggleDrawer: boolean;
  anchorEl: HTMLElement |  null;
}

type MergedProps = StateProps & DispatchProps & DashBoardProps & StyledComponentProps & TransProps;

class DashBoard extends React.Component<MergedProps, DashBoardViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      toggleDrawer: false,
      anchorEl: null
    }
  }

  componentWillMount() {
    this.props.action.dashboard.loadProjects();
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps: DashBoardProps) {
  }

  render() {
    const { /*t,*/ classes } = this.props;
    const { anchorEl } = this.state;
    const openGroup = Boolean(anchorEl);
    const projects = this.props.dashboard.getProjects();
    if (!classes) return;
    return (
      <div className="main-contents">
        <div style={{height: '100%', width:'300px', padding: '10px', backgroundColor: P_RED, float: 'left'}}>
          <p><Button className={classes.button} onClick={this.handleOpenProjectModal.bind(this)} >プロジェクトを作成する</Button></p>
          <p><Button className={classes.button} onClick={this.handleGroupOpen.bind(this)}>グループを作成する</Button></p>
        </div>
        <div style={{height: '100%', width:'calc(100% - 300px)', padding: '10px', backgroundColor: P_IVORY, float: 'left'}}>
          { projects && projects.size > 0 && (
            this.renderProjects(projects, this.props.classes || {})
          )}
        </div>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.props.dashboard.isShowProjectModal()}
          onClose={this.handleCloseProjectModal.bind(this)}
        >
          <div style={MODAL_STYLE} >
            <ProjectForm onSubmit={this.handleSubmitProject.bind(this)} onClose={this.handleCloseProjectModal.bind(this)}></ProjectForm>
          </div>
        </Modal>
        <Popover
          //className={this.props.classes ? this.props.classes.popover : ''}
          classes={{
            paper: classes.paper
          }}
          id="simple-popper"
          open={openGroup}
          anchorEl={anchorEl}
          onClose={this.handleGroupClose.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography >The content of the Popover.</Typography>
          <TextField fullWidth={true} />
          <Button color='primary'>Test</Button>
        </Popover>
      </div>
    );
  }

  renderProjects(projects: List<Project>, classes: Partial<ClassNameMap<string>>) {
    const rows: any = [];
    
    projects.forEach(pr => {
      if (pr) {
        const card = 
        <Card className={classes.card} key={pr.id}>
          <CardActionArea className={classes.action} onClick={ (event) => { this.transitionProject(pr.id); } }>
            <CardContent className={classes.content}>
                <Typography component='p'>
                  { pr.name }
                </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.cardActions} >
              <Button size='small' className={classes.cardButton} color='primary' onClick={ (event) => {event.stopPropagation(); /* edit */} }>EDIT</Button>
              <Button size='small' className={classes.cardButton} color='secondary' onClick={ (event) => {event.stopPropagation(); this.deleteProjectConfirm(pr.id)} }>DEL</Button>
          </CardActions>
        </Card>
        rows.push(card);
      }
    });
    return rows;
  }

  transitionProject(id: string) {
    location.href = '#/project/' + id
  }

  deleteProjectConfirm(projectId: string) {
    this.props.action.messageDialog.showMessage('削除してもよろしいですか？', 
      [{ message: 'この操作は取り消すことができません。' }],
      () => { /* NOP */ },
      { delete: {
        action: () => {},
        caption: 'DELETE',
        color: 'secondary'
      }}
    );
  }

  handleSubmitProject(values: Project) {
    ProjectService.post(values);
    this.props.action.dashboard.updateProject(values);
    this.handleCloseProjectModal();
  }
  handleOpenProjectModal() {
    this.props.action.dashboard.showProjectModal();
  }

  handleCloseProjectModal() {
    this.props.action.dashboard.closeProjectModal();
  }

  handleGroupOpen(event: React.MouseEvent<HTMLElement>) {
    this.setState(Object.assign({}, this.state, {
      anchorEl: event.currentTarget,
    }));
  }

  handleGroupClose() {
    this.setState(Object.assign({}, this.state, {
      anchorEl: null,
    }));
  }

  logout() {
    AuthService.logout().then(() => {
      transitionToLoginPage();
    });
  }
}


interface StateProps {
  dashboard: DashBoardState;
  messageDialog: MessageDialogState;
}

interface DispatchProps {
  action: {
    dashboard: DashBoardDispatcher,
    messageDialog: MessageDialogDispatcher
  };
}

function mapStateToProps(state: AppState) {
  return { 
    dashboard: state.dashboard,
    messageDialog: state.component.messageDialog
   };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      dashboard: new DashBoardDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: DashBoardProps): MergedProps {
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
    width: '100%',
    minHeight: '70px'
  },
  content: {
    paddingTop: 0
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
  paper: {
    minWidth: 300,
    maxWidth: 300,
    maxHeight: 200,
    minHeight: 200,
  },
  button: {
    color: 'white'
  },
  cardActions: {
    padding: '0px 12px 4px'
  },
  cardButton: {
    margin: 0
  }
};

const i18n = withNamespaces()(DashBoard)
const connected = connect<StateProps, DispatchProps, DashBoardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(i18n);
export default withStyles(styles)(connected) as React.ComponentClass<DashBoardProps>;
