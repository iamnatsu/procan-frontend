import { Record, Map, List } from 'immutable';
import { Project } from '../../model/project';
import { Group } from '../../model/group';


const DashBoardRecord = Record({ 
  isShowProjectModal: false,
  isShowGroupModal: false,
  project: Map(),
  projects: List(),
  group: Map(),
  groups: List(),
});
export default class DashBoardStore extends DashBoardRecord {

  isShowProjectModal() {
    return this.get('isShowProjectModal');
  }

  setIsShowProjectModal(isShowProjectModal: boolean): this {
    return this.set('isShowProjectModal', isShowProjectModal) as this;
  }

  isShowGroupModal() {
    return this.get('isShowGroupModal');
  }

  setIsShowGroupModal(isShowGroupModal: boolean): this {
    return this.set('isShowGroupModal', isShowGroupModal) as this;
  }

  getProject(): Map<keyof Project, any> {
    return this.get('project');
  }

  setProject(project: Project): this {
    return this.set('project', Map(project)) as this;
  }

  getProjects(): List<Project> {
    return this.get('projects');
  }

  setProjects(projects: Array<Project>): this {
    return this.set('projects', List(projects)) as this;
  }

  getGroup(): Map<keyof Group, any> {
    return this.get('group');
  }

  setGroup(gropu: Group): this {
    return this.set('group', Map(gropu)) as this;
  }

  getGroups(): List<Group> {
    return this.get('groups');
  }

  setGroups(groups: Array<Group>): this {
    return this.set('groups', List(groups)) as this;
  }
}
