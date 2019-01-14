import { Task } from '../model/task'

export function equals(t1: Task, t2: Task) {
  let result = true;
  const keys1 = Object.keys(t1).sort();
  const keys2 = Object.keys(t2).sort();

  if (keys1.length != keys2.length) return false;
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] != keys2[i]) {
      result = false;
      break;
    }
  }
  if (!result) return result;

  Object.keys(t1).forEach((key: keyof Task) => {
    if (!result) return;

    if (key === 'audit') {
      return;
    } else if (key === 'owner') {
      if (!t1.owner && !t2.owner) return;
      else if (!t1.owner && t2.owner) result = false;
      else if (t1.owner && !t2.owner) result = false;
      else if (t1.owner.id != t2.owner.id) result = false;
    } else if (key === 'assignees') {
      if (!t1.assignees && !t2.assignees) return;
      else if (!t1.assignees && t2.assignees) result = false;
      else if (t1.assignees && !t2.assignees) result = false;
      else if (t1.assignees.length != t2.assignees.length) result = false;
      else {
        for (let i = 0; i < t1.assignees.length; i++) {
          if (t1.assignees[i].id != t2.assignees[i].id) {
            result = false;
            break;
          }
        }
      }
    } else {
      if (t1[key] !== t2[key]) return result = false;
    }
  });

  return result;
}