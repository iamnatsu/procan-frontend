import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { TextField } from '@material-ui/core';
import Label from './Lable'

export interface TextProps {
  label: string;
}
type MergedProps = TextProps & WrappedFieldProps;
class Text extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ marginTop: '5px' }}>
        <Label caption={this.props.label} />
        <TextField {...this.props.input}></TextField>
      </div>
    )
  }
}

export default Text as React.ComponentClass<MergedProps>;