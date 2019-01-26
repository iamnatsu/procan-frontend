import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import ReactSelect from 'react-select';
import Label from './Lable'
import { FIELD_STYLE } from '../../config/Style';
import { StylesConfig } from 'react-select/lib/styles';

export interface SelectOption {
  label: string;
  value: string | number;
  color?: string;
}
export interface SelectProps {
  label: string;
  options: SelectOption[]
  style?: React.CSSProperties;
  onChangeSelect: (value: SelectOption) => void;
}
type MergedProps = SelectProps & WrappedFieldProps;

class Select extends Component<MergedProps, any> {
  render() {
    const { style, label } = this.props; 
    const styles = style ? Object.assign({}, FIELD_STYLE, style) : FIELD_STYLE;
    const colourStyles: StylesConfig = {
      control: (styles: any) => ({ ...styles,
       backgroundColor: 'transparent',
       border: 'none !important',
       borderRadius: '0px !important',
       borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
       boxShadow: 'none !important'  }),
      container: (styles: any) => ({ ...styles, border: 'none !important' }),
    };

    return (
      <div style={styles}>
        <Label caption={label} />
        <ReactSelect styles={colourStyles} 
          isSearchable={true}
          isClearable={true}
          defaultValue={this.findDefault()}
          options={this.props.options}
          onChange={this.handleChange.bind(this)}>
        </ReactSelect>
      </div>
    )
  }

  findDefault() {
    return this.props.options.find(o => o.value === this.props.input.value);
  }

  handleChange(value: SelectOption){
    if (this.props.onChangeSelect) this.props.onChangeSelect(value);
  }
}
export default Select as React.ComponentClass<MergedProps>;