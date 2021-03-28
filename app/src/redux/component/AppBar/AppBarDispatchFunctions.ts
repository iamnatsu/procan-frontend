import { AppBarUpdateConfig } from './AppBarCreator';
import { AppBarConfig } from '../../../model/common'

export class AppBarDispatchFunctions {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  update(config: AppBarConfig) {
    this.dispatch(AppBarUpdateConfig(config));
  }

}
