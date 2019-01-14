import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { Select as MuiSelect, MenuItem } from '@material-ui/core';
import Label from './Lable'
import { FIELD_STYLE } from '../../config/Style';

export interface SelectOption {
  caption: string;
  value: string | number;
}
export interface SelectProps {
  label: string;
  options: {[k: string]: SelectOption}
  style?: React.CSSProperties;
}
type MergedProps = SelectProps & WrappedFieldProps;

class Select extends Component<MergedProps, any> {
  render() {
    const { style, label } = this.props; 
    const styles = style ? Object.assign({}, FIELD_STYLE, style) : FIELD_STYLE;
    return (
      <div style={styles}>
        <Label caption={label} />
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