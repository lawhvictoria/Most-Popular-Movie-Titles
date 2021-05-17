import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class Filter extends Component {

    handleStartDateChange = (date) => {
        if (date === null) {
            this.props.handleFilterDateChange("filterStartDate", date);
        } else {
            const isDateValid = date && date.toString() !== "Invalid Date";
            if (isDateValid) {
                this.props.handleFilterDateChange("filterStartDate", date);
            } else {
                this.props.handleInvalidDateChange();
            }
        }
    }

    handleEndDateChange = (date) => {
        if (date === null) {
            this.props.handleFilterDateChange("filterEndDate", date);
        } else {
            const isDateValid = date && date.toString() !== "Invalid Date";
            if (isDateValid) {
                this.props.handleFilterDateChange("filterEndDate", date);
            } else {
                this.props.handleInvalidDateChange();
            }
        }
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
                        label={"Start Date (mm/dd/yyyy)"}
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
                        label={"End Date (mm/dd/yyyy)"}
                        value={this.props.filterEndDate}
                        onChange={this.handleEndDateChange}
                    />
                </MuiPickersUtilsProvider>
            </div>
        </>
      );
    }
}

export default Filter;