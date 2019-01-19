import { Record, Map } from 'immutable';
import { AppBarConfig } from '../../../model/common';

const AppBarRecord = Record({ 
  config: Map()
});

export default class AppBarStore extends AppBarRecord {
  setConfig(config: AppBarConfig) {
    return this.set('config', Map(config)) as this;
  }
}