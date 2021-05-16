import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Filter from "./components/filter.component";
import MovieDetails from "./components/movie-details.component";
import "./App.css";
import axios from "axios";
import moment from 'moment'

import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    wrapper: {
        padding: "15px"
    },
    filter: {
        align: "center",
        justifyContent:"center", 
        alignItems:"center",
        textAlign: "center"
    },
    movieList: {
        textAlign: "center",
        margin: "auto"
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterStartDate: null,
            filterEndDate: null,
            page: 1,
            listOfMovieIds: [],
            maxNumOfPages: 0
        };
    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.infiniteScroll);
        this.getTopRatedMovies(this.state.page);
    }

    getTopRatedMovies = (page) => {
        const getRequestURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + process.env.REACT_APP_API_KEY + "&language=en-US&page=" + page;
        axios.get(getRequestURL)
            .then(response => this.getListOfMovieIds(response.data));
    }

    getListOfMovieIds = (data) => {
        const filteredListOfMovies = this.getFilteredListOfMovies(data.results);
        const filteredListOfMovieIds = filteredListOfMovies.map(movie => movie.id);
        const listOfMovieIds = this.state.listOfMovieIds.concat(filteredListOfMovieIds);
        const areThereLessThan2MoviesThatFitReq = filteredListOfMovies.length < 10;
        if (areThereLessThan2MoviesThatFitReq) {
            this.getMoreMovieData();
        }
        this.setState({ 
            listOfMovieIds: listOfMovieIds,
            maxNumOfPages: data.total_pages
        });
    }

    getFilteredListOfMovies = (results) => {
        let filteredListOfMovies = results;
        if (this.state.filterStartDate !== null) {
            filteredListOfMovies = filteredListOfMovies.filter((movie) => {
                return moment(movie.release_date) >= moment(this.state.filterStartDate);
            });
        }
        if (this.state.filterEndDate !== null) {
            filteredListOfMovies = filteredListOfMovies.filter((movie) => {
                return moment(movie.release_date) <= moment(this.state.filterEndDate);
            });
        }
        return filteredListOfMovies;
    }

    handleFilterDateChange = (dateType, date) => {
        this.setState({ 
            [dateType]: date,
            listOfMovieIds: [],
            page: 1
        });
        this.getTopRatedMovies(1);
    }

    getMoreMovieData = () => {
        const isSearchResultsOnLastPage = this.state.page >= this.state.maxNumOfPages;
        if (!isSearchResultsOnLastPage) {
            let newPage = this.state.page;
            newPage++;
            this.setState({ page: newPage });
            this.getTopRatedMovies(newPage);
        }
    }

    infiniteScroll = () => {
        const isTheDocumentAtTheBottom = window.innerHeight + document.documentElement.scrollTop >= (document.documentElement.offsetHeight * 0.75);
        const isSearchResultsOnLastPage = this.state.page >= this.state.maxNumOfPages;
        if (isTheDocumentAtTheBottom && !isSearchResultsOnLastPage) {
            this.getMoreMovieData();
        }
    }

    render = () => {
        const { classes } = this.props;

        return(
            <Grid container className={classes.wrapper}>
                <Grid item xs={3} className={classes.filter}>
                    <Filter
                        filterStartDate = {this.state.filterStartDate}
                        filterEndDate = {this.state.filterEndDate}
                        handleFilterDateChange = {this.handleFilterDateChange}
                    />
                </Grid>
                <Grid item xs={9} className={classes.movieList}>
                    {
                        this.state.listOfMovieIds && this.state.listOfMovieIds.length > 0 ? 
                            <div>
                                <List>
                                    {
                                        this.state.listOfMovieIds.map((movieId, index) => {
                                            return (
                                                <ListItem key={index}>
                                                    <MovieDetails movieID = {movieId} />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                                {
                                    this.state.page >= this.state.maxNumOfPages ?
                                        <Typography variant="h4" color="primary">You've reached the end of the search results.</Typography>
                                        :
                                        <div>
                                            <CircularProgress />
                                            <Typography variant="h5" color="primary" style={{ margin: "15px" }}>Getting more movie data...</Typography>
                                        </div>
                                }
                            </div>
                            :
                            this.state.page >= this.state.maxNumOfPages ? 
                                <Typography variant="h4" color="error">There are no search results found, please try again.</Typography>
                                :
                                <div>
                                    <CircularProgress />
                                    <Typography variant="h5" color="primary" style={{ margin: "15px" }}>Getting movie data...</Typography>
                                </div>
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(App);