import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { TextField } from '@material-ui/core';
import Label from './Lable'

export interface TextProps {
  label: string;
  type?: string;
  placeholder?: string;
  inputProps?: Object;
  autoFocus?: boolean
}
type MergedProps = TextProps & WrappedFieldProps;
class Text extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ margin: '5px' }}>
        <Label caption={this.props.label} />
        <TextField type={this.props.type ? this.props.type : 'text'} autoFocus={this.props.autoFocus || false}
          inputProps={this.props.inputProps || {}}
          placeholder={this.props.placeholder || ''} {...this.props.input}></TextField>
      </div>
    )
  }
}

export default Text as React.ComponentClass<MergedProps>;