import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { InlineDatePicker } from 'material-ui-pickers';
import Label from './Lable'

export interface DateProps {
  label: string;
  onChangeValue: (date:Date) => void;
}
type MergedProps = DateProps & WrappedFieldProps;
class DateField extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ marginTop: '5px' }}>
        <Label caption={this.props.label} />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <InlineDatePicker value={this.props.input.value ? (new Date(this.props.input.value)).getTime() : null} 
            onChange={this.handleChange.bind(this)}
            format="YYYY/MM/DD"></InlineDatePicker>
        </MuiPickersUtilsProvider>
      </div>
    )
  }

  handleChange(value: Date) {
    this.props.onChangeValue(value);
  }
}

export default DateField as React.ComponentClass<MergedProps>;