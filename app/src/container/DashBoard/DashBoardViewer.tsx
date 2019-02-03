import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from 'react-router';
import { withNamespaces, TransProps } from 'react-i18next';
import Modal from '@material-ui/core/Modal';
import { P_RED, P_IVORY, P_BLACK, P_RED_LIGHT } from '../../config/Color';
import { MODAL_STYLE } from '../../config/Style';
import * as AuthService from '../../service/AuthService'
import * as ProjectService from '../../service/ProjectService'
import * as TaskService from '../../service/TaskService'
import * as GroupService from '../../service/GroupService'
import { transitionToLoginPage } from '../../util/transition';
import { DashBoardDispatcher } from '../../redux/DashBoard/DashBoardDispatcher';
import { DashBoardState } from '../../redux/DashBoard/DashBoardReducer';
import ProjectForm from '../../component/ProjectForm/ProjectForm';
import GroupForm from '../../component/GroupForm/GroupForm';
import { Project, ROOT_GROUP_ID } from '../../model/project';
import { Group } from '../../model/group';
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
import UserSelector from '../../component/UserSelector/UserSelector'
import UserCard from '../../component/UserCard/UserCard'
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import { UserCardDispatcher } from '../../redux/component/UserCard/UserCardDispatcher';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { default as CustomScrollbars } from 'react-custom-scrollbars';
import { MessageDialogActionMap } from '../../redux/component/MessageDialog/MessageDialogStore';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';

export interface DashBoardProps extends RouteComponentProps<any> {
}

export interface DashBoardViewerState extends React.Props<any> {
  toggleDrawer: boolean;
}

type MergedProps = StateProps & DispatchProps & DashBoardProps & StyledComponentProps & TransProps;

class DashBoard extends React.Component<MergedProps, DashBoardViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      toggleDrawer: false,
    }
  }

  componentWillMount() {
    this.props.action.dashboard.loadProjects();
    this.props.action.dashboard.loadGroups();
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps: DashBoardProps) {
  }

  render() {
    const { /*t,*/ classes } = this.props;
    const projects = this.props.dashboard.getProjects();
    const { groupId } = this.props.match.params;
    if (!classes) return;
    return (
      <div className="main-contents">
        <div style={{height: '100%', width:'300px', padding: '10px', backgroundColor: P_RED, float: 'left'}}>
          <CustomScrollbars style={{width: 'calc(100% + 8px)'}}>
            <p><Button className={classes.button} onClick={(() => {this.transitionDashboard()})} >ダッシュボード</Button></p>
            <Divider style={{margin: '5px 0'}} />
            <p><Button className={classes.button} onClick={this.handleOpenProjectModal.bind(this)} >プロジェクトを作成する</Button></p>
            <p><Button className={classes.button} onClick={this.handleOpenGroupModal.bind(this)}>グループを作成する</Button></p>
            { this.renderGroups(classes) }
          </CustomScrollbars>
        </div>
        <div style={{height: '100%', width:'calc(100% - 300px)', padding: '10px', backgroundColor: P_IVORY, float: 'left'}}>
          <CustomScrollbars style={{width: 'calc(100% + 8px)'}}>
            { !groupId && <p className={classes.label}>参加中のプロジェクト{this.groupName(groupId)}</p> }
            { projects && projects.size > 0 && (
              this.renderProjects(projects, this.props.classes || {}, groupId)
            )}
          </CustomScrollbars>
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
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.props.dashboard.isShowGroupModal()}
          onClose={this.handleCloseGroupModal.bind(this)}
        >
          <div style={MODAL_STYLE} >
            <GroupForm onSubmit={this.handleSubmitGroup.bind(this)} onDelete={this.deleteGroupConfirm.bind(this)} onClose={this.handleCloseGroupModal.bind(this)}></GroupForm>
          </div>
        </Modal>
        <UserSelector />
        <UserCard />
      </div>
    );
  }

  renderProjects(projects: List<Project>, classes: Partial<ClassNameMap<string>>, gid = '') {
    const { groupId } = this.props.match.params;
    const rows: any = [];
    let groups: Group[] = this.props.dashboard.getGroups().toJS() || [];
    groups.unshift({id: ROOT_GROUP_ID, name: 'uncategrize'} as Group);
    if (gid) {
      groups = groups.filter(g => g.id === gid);
    }
    
    groups.map(g => {
      if (g.id === ROOT_GROUP_ID) {
        rows.push(
          <div key={'outer-' + g.id} style={{clear: 'both'}}>
            <p>&nbsp;</p>
            {this.renderProject(classes, projects)}
          </div>
        )
      } else {
        rows.push(
          <div key={'outer-' + g.id} style={{clear: 'both', paddingTop: groupId ? '0px' : '10px'}}>
            <p className={classes.label} style={{marginBottom: '5px'}}>{g.name}</p>
            {this.renderProject(classes, projects, g.id)}
          </div>
        )
      }
    });
    return rows;
  }

  renderProject(classes: any, projects: List<Project>, groupId = '') {
    const rows: any = [];
    projects
      .filter(pr => !groupId || (!!pr && pr.groupId == groupId))
      .forEach(pr => {
        if (!pr) return null;
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
              <Button size='small' className={classes.cardButton} color='primary' onClick={ (event) => {event.stopPropagation(); this.handleEditProject(pr.id)} }>EDIT</Button>
              <Button size='small' className={classes.cardButton} color='secondary' onClick={ (event) => {event.stopPropagation(); this.deleteProjectConfirm(pr.id)} }>DEL</Button>
          </CardActions>
        </Card>
        rows.push(card);
    });

    const newCard = 
    <Card className={classes.newCard} key={groupId + '-new'}>
      <CardActionArea className={classes.newAction} onClick={ (event) => { this.handleOpenProjectModal(); } }>
        <CardContent>
            <Typography component='p' style={{textAlign: 'center'}}>
              { "+ NEW PROJECT" }
            </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    rows.push(newCard);
    return rows;
  }

  renderGroups(classes: Partial<ClassNameMap<string>>) {
    const groups = this.props.dashboard.getGroups();
    if (!groups || groups.size <= 0) return null;
    return groups.map(g => { 
      if (g) return <p key={'p' + g.id}><Button key={g.id} className={classes.buttonGrp} 
        onClick={(() => {this.transitionDashboard(g.id)})}>{g.name}</Button>
        <IconButton aria-label="Clear" className={classes.editBtn} onClick={(() => { this.handleEditGroup(g.id) }).bind(this)}>
          <EditIcon />
        </IconButton>
        </p>
    });
  }

  handleEditGroup(groupId: string) {
    GroupService.get(groupId).then(res => {
      this.props.action.dashboard.updateGroup(res.data);
      this.props.action.dashboard.showGroupModal();
    });
  }

  groupName(groupId: string) {
    if (!groupId) return '';
    const group = this.props.dashboard.getGroups().find(g => !!g && g.id === groupId)
    return group && group.name ? ' [ ' +group.name + ' ]' : '';
  }

  transitionDashboard(groupId?: string) {
    location.href = '#/dashboard' + (groupId ? '/' + groupId : '');
  }

  transitionProject(id: string) {
    ProjectService.get(id).then(result => {
      this.props.action.project.localUpdateProject(result.data);
      TaskService.find(id).then(result => {
        this.props.action.project.initTasks(result.data);
        location.href = '#/project/' + id;
      });
    });
  }

  handleEditProject(id: string) {
    ProjectService.get(id).then(res => {
      this.props.action.dashboard.updateProject(res.data);
      this.props.action.dashboard.showProjectModal();
    });
  }

  deleteProjectConfirm(projectId: string) {
    this.deleteConfirm(
      { delete: {
        action: () => {
          ProjectService.del(projectId).then(res => {
            this.props.action.messageDialog.closeMessage();
            const index = this.props.dashboard.getProjects().findIndex(p => !!p && p.id === projectId);
            if (index >= 0) {
              const removed = this.props.dashboard.getProjects().remove(index);
              this.props.action.dashboard.updateProjects(removed.toJS());
            }
          });
        },
        caption: 'DELETE',
        color: 'secondary'
      }}
    )
  }

  deleteGroupConfirm(groupId: string) {
    this.deleteConfirm(
      { delete: {
        action: () => {
          GroupService.del(groupId).then(res => {
            this.props.action.messageDialog.closeMessage();
            const index = this.props.dashboard.getProjects().findIndex(p => !!p && p.id === groupId);
            if (index >= 0) {
              const removed = this.props.dashboard.getGroups().remove(index);
              this.props.action.dashboard.updateGroups(removed.toJS());
            }
          });
        },
        caption: 'DELETE',
        color: 'secondary'
      }}
    )
  }

  deleteConfirm(actionMap: MessageDialogActionMap) {
    this.props.action.messageDialog.showMessage('削除してもよろしいですか？', 
      [{ message: 'この操作は取り消すことができません。' }],
      () => { /* NOP */ },
      actionMap
    );
  }

  handleSubmitProject(values: Project) {
    if (!values.id) {
      ProjectService.post(values).then(res => {
        this.props.action.dashboard.updateProject(values);
        this.props.action.dashboard.updateProjects(this.props.dashboard.getProjects().push(res.data).toJS());
        this.handleCloseProjectModal();
      });
    } else {
      ProjectService.put(values).then(res => {
        this.props.action.dashboard.updateProject(values);
        const index = this.props.dashboard.getProjects().findIndex(p => !!p && p.id === values.id);
        this.props.action.dashboard.updateProjects(
          this.props.dashboard.getProjects().update(index, () => res.data ).toArray()
        );
        this.handleCloseProjectModal();
      });
    }
  }

  handleOpenProjectModal() {
    this.props.action.dashboard.updateProject(new Project());
    this.props.action.dashboard.showProjectModal();
  }

  handleCloseProjectModal() {
    this.props.action.dashboard.closeProjectModal();
  }

  handleSubmitGroup(values: Group) {
    if (!values.id) {
      GroupService.post(values).then(res => {
        this.props.action.dashboard.updateGroups(
          this.props.dashboard.getGroups().push(res.data).toArray()
        );
        this.handleCloseGroupModal();  
      });
    } else {
      GroupService.put(values).then(res => {
        const index = this.props.dashboard.getGroups().findIndex(g => !!g && g.id === values.id);
        this.props.action.dashboard.updateGroups(
          this.props.dashboard.getGroups().update(index, () => res.data ).toArray()
        );
        this.handleCloseGroupModal();
      });
    }
  }

  handleOpenGroupModal() {
    this.props.action.dashboard.updateGroup(new Group());
    this.props.action.dashboard.showGroupModal();
  }

  handleCloseGroupModal() {
    this.props.action.dashboard.closeGroupModal();
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
    project: ProjectDispatcher,
    messageDialog: MessageDialogDispatcher,
    userSelector: UserSelectorDispatcher,
    userCard: UserCardDispatcher,
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
      project: new ProjectDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch),
      userSelector: new UserSelectorDispatcher(dispatch),
      userCard: new UserCardDispatcher(dispatch),
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
  newCard: {
    minWidth: 200,
    maxWidth: 200,
    minHeight: 107,
    maxHeight: 107,
    margin: '0 10px 10px 0',
    float: 'left'
  },
  action: {
    width: '100%',
    minHeight: '70px'
  },
  newAction: {
    width: '100%',
    height: '107px',
    backgroundColor: P_RED_LIGHT
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
    color: 'white',
  },
  buttonGrp: {
    fontSize: '12px',
    color: 'white',
    marginLeft: '20px',
    width: '222px',
    justifyContent: 'left',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    display: 'block',
    float: 'left',
    textTransform: 'none'
  },
  editBtn: {
    padding: '6px'
  },
  cardActions: {
    padding: '0px 12px 4px'
  },
  cardButton: {
    margin: 0
  },
  label: {
    color: P_BLACK
  }
};

const i18n = withNamespaces()(DashBoard)
const connected = connect<StateProps, DispatchProps, DashBoardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(i18n);
export default withStyles(styles)(connected) as React.ComponentClass<DashBoardProps>;
