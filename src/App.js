import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Filter from "./components/filter.component";
import "./App.css";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const styles = {
  root: {
    paddingTop: "15px",
    align: "center",
    justifyContent:"center", 
    alignItems:"center",
    textAlign: "center"
  },
  gridContainer: {
    align: "center",
    justifyContent:"center", 
    alignItems:"center",
    textAlign: "center",
  }
};

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          filterStartDate: null,
          filterEndDate: null
      };
  }

  handleFilterDateChange = (dateType, date) => {
    this.setState({ [dateType]: date });
  }

  render = () => {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={3}>
            <Filter 
              filterStartDate = {this.state.filterStartDate}
              filterEndDate = {this.state.filterEndDate}
              handleFilterDateChange = {this.handleFilterDateChange}
            />
          </Grid>
          <Grid item xs={8}>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);