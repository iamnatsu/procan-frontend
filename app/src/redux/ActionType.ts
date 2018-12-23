export const enum ActionType {
  // component
  MessageDialogUpdateAction = 'MessageDialogUpdateAction',
  MessageDialogUpdateIsShowAction = 'MessageDialogUpdateIsShowAction',

  // UserSelector
  UserSelectorUpdateIsShowAction = 'UserSelectorUpdateIsShowAction',
  UserSelectorUpdateCandidates = 'UserSelectorUpdateCandidates',
  UserSelectorUpdateSelections = 'UserSelectorUpdateSelections',
  
  // TaskFormUpdateIsShowAction = 'TaskFormUpdateIsShowAction',
  TaskFormUpdateTask = 'TaskFormUpdateTask',

  // container
  // login
  LoginUpdateLoginUser = 'LoginUpdateLoginUser',
  LoginDestory = 'LoginDestory',
  LoginSetErrorMessage = 'LoginSetErrorMessage',

  // dashboard
  DashBoardIsShowProjectModal = 'DashBoardIsShowProjectModal',
  DashBoardUpdateProject = 'DashBoardUpdateProject',
  DashBoardUpdateProjects = 'DashBoardUpdateProjects',

  // project
  ProjectIsShowProjectModal = 'ProjectIsShowProjectModal',
  ProjectIsShowTaskModal = 'ProjectIsShowTaskModal',
  ProjectUpdateProject = 'ProjectUpdateProject',
  ProjectUpdateTasks = 'ProjectUpdateTasks',
  ProjectAddTask = 'ProjectAddTask',
  ProjectUpdateTask = 'ProjectUpdateTask',
}
