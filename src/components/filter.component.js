import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const styles = {
};

class Filter extends Component {

    handleStartDateChange = (date) => {
        this.props.handleFilterDateChange("filterStartDate", date);
    }

    handleEndDateChange = (date) => {
        this.props.handleFilterDateChange("filterEndDate", date);
    }

    render() {
      return (
        <>
            <Typography variant="h6">
                Filter by Release Date Range
            </Typography>
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        maxDate={new Date()}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        label={"Start Date"}
                        value={this.props.filterStartDate}
                        onChange={this.handleStartDateChange}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        minDate={this.props.filterStartDate}
                        maxDate={new Date()}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        label={"End Date"}
                        value={this.props.filterEndDate}
                        onChange={this.handleEndDateChange}
                    />
                </MuiPickersUtilsProvider>
            </div>
        </>
      );
    }
}

export default withStyles(styles)(Filter);