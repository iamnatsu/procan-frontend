import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { Select as MuiSelect, MenuItem } from '@material-ui/core';

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
      <div style={{ marginTop: '5px' }}>
        {this.props.label && <p style={{color: "rgba(0, 0, 0, 0.54)"}}>{this.props.label}</p> }
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