export const enum ActionType {
  // component
  MessageDialogUpdateAction = 'MessageDialogUpdateAction',
  MessageDialogUpdateIsShowAction = 'MessageDialogUpdateIsShowAction',

  // UserSelector
  UserSelectorUpdateIsShowAction = 'UserSelectorUpdateIsShowAction',
  UserSelectorUpdateCandidates = 'UserSelectorUpdateCandidates',
  UserSelectorUpdateSelections = 'UserSelectorUpdateSelections',
  
  // UserCard
  UserCardUpdateIsShowAction = 'UserCardUpdateIsShowAction',

  // TaskFormUpdateIsShowAction = 'TaskFormUpdateIsShowAction',
  TaskFormUpdateTask = 'TaskFormUpdateTask',

  AppBarUpdateConfig = 'AppBarUpdateConfig',

  // container
  // login
  LoginUpdateLoginUser = 'LoginUpdateLoginUser',
  LoginDestory = 'LoginDestory',
  LoginSetErrorMessage = 'LoginSetErrorMessage',

  // dashboard
  DashBoardIsShowProjectModal = 'DashBoardIsShowProjectModal',
  DashBoardIsShowGroupModal = 'DashBoardIsShowGroupModal',
  DashBoardUpdateProject = 'DashBoardUpdateProject',
  DashBoardUpdateProjects = 'DashBoardUpdateProjects',
  DashBoardUpdateGroup = 'DashBoardUpdateGroup',
  DashBoardUpdateGroups = 'DashBoardUpdateGroups',

  // project
  ProjectIsShowProjectModal = 'ProjectIsShowProjectModal',
  ProjectIsShowTaskModal = 'ProjectIsShowTaskModal',
  ProjectUpdateMenuAnchor = 'ProjectUpdateMenuAnchor',
  ProjectUpdateProject = 'ProjectUpdateProject',
  ProjectLoadTasks = 'ProjectLoadTasks',
  ProjectUpdateTasks = 'ProjectUpdateTasks',
  ProjectAddTask = 'ProjectAddTask',
  ProjectUpdateTask = 'ProjectUpdateTask',
  ProjectChangeView = 'ProjectChangeView',
  ProjectShowPopOver = 'ProjectShowPopOver',
  ProjectUpdatePopOverValue = 'ProjectUpdatePopOverValue',

  // profile
  ProfileUpdateUser = 'ProfileUpdateUser',

  // gantt
  GanttUpdateScrollLeft = 'GanttUpdateScrollLeft',
  GanttUpdateScrollTop = 'GanttUpdateScrollTop',
  GanttUpdateScrollCoord = 'GanttUpdateScrollCoord',
  GanttUpdateWidth = 'GanttUpdateWidth',
  GanttUpdateStartDay = 'GanttUpdateStartDay',
  GanttUpdateWidthAndStartDay = 'GanttUpdateWidthAndStartDay',
  GanttUpdateHeaders = 'GanttUpdateHeaders',
  GanttUpdateSettingAnchor = 'GanttUpdateSettingAnchor',
}
