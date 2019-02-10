import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { InlineDatePicker } from 'material-ui-pickers';
import Label from './Lable'
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { createStyles, withStyles, Theme, StyledComponentProps } from '@material-ui/core/styles';
import { FIELD_STYLE } from '../../config/Style';

export interface DateProps {
  label: string;
  onChangeValue: (date:Date | null) => void;
  style?: React.CSSProperties;
}
type MergedProps = DateProps & WrappedFieldProps & StyledComponentProps;
class DateField extends Component<MergedProps, any> {
  render() {
    const { classes, style, label } = this.props; 
    if (!classes) return;

    const styles = style ? Object.assign({}, FIELD_STYLE, style) : FIELD_STYLE;
    return (
      <div style={styles}>
        <Label caption={label} />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <InlineDatePicker value={this.props.input.value ? (new Date(this.props.input.value)).getTime() : null} 
            onChange={this.handleChange.bind(this)}
            format="YYYY/MM/DD"></InlineDatePicker>
        </MuiPickersUtilsProvider>
        <IconButton aria-label="Clear" className={classes.root} onClick={(() => {this.handleChange(null)}).bind(this)}>
          <ClearIcon className={classes.icon} />
        </IconButton>
      </div>
    )
  }

  handleChange(value: Date | null) {
    this.props.onChangeValue(value);
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    padding: '3px'
  },
  icon: {
    fontSize: '16px'
  }
});
//export default DateField as React.ComponentClass<MergedProps>;
export default withStyles(styles)(DateField);