import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { TextField } from '@material-ui/core';
import Label from './Lable'
import { FIELD_STYLE } from '../../config/Style';

export interface TextProps {
  label: string;
  type?: string;
  placeholder?: string;
  inputProps?: Object;
  autoFocus?: boolean
  style?: React.CSSProperties;
}
type MergedProps = TextProps & WrappedFieldProps;
class Text extends Component<MergedProps, any> {
  render() {
    const { style, label } = this.props; 
    const styles = style ? Object.assign({}, FIELD_STYLE, style) : FIELD_STYLE;
    return (
      <div style={styles}>
        <Label caption={label} />
        <TextField type={this.props.type ? this.props.type : 'text'} autoFocus={this.props.autoFocus || false}
          inputProps={this.props.inputProps || {}}
          placeholder={this.props.placeholder || ''} {...this.props.input}></TextField>
      </div>
    )
  }
}

export default Text as React.ComponentClass<MergedProps>;