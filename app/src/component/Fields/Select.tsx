import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { Select as MuiSelect, MenuItem } from '@material-ui/core';
import Label from './Lable'

export interface SelectOption {
  caption: string;
  value: string | number;
}
export interface SelectProps {
  label: string;
  options: {[k: string]: SelectOption}
}
type MergedProps = SelectProps & WrappedFieldProps;

class Select extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ margin: '5px' }}>
        <Label caption={this.props.label} />
        <MuiSelect  autoWidth={true} {...this.props.input}>
          {this.renderOptions()}
        </MuiSelect>
      </div>
    )
  }

  renderOptions() {
    const result: any = [];
    Object.keys(this.props.options).forEach(key => {
      result.push(
        <MenuItem key={key} value={this.props.options[key].value}>{this.props.options[key].caption}</MenuItem>
      )
    });
    return result;
  }
}
export default Select as React.ComponentClass<MergedProps>;