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
        const getRequestURL = this.createRequestURL(page);
        axios.get(getRequestURL)
            .then(response => this.getListOfMovieIds(response.data));
    }

    createRequestURL = (page) => {
        let baseURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + process.env.REACT_APP_API_KEY + "&language=en-US&page=" + page;
        if (this.state.filterStartDate !== null) {
            const startDate = moment(this.state.filterStartDate).format('YYYY-MM-DD');
            baseURL = baseURL + "&primary_release_date.gte=" + startDate;
        }
        if (this.state.filterEndDate !== null) {
            const endDate = moment(this.state.filterEndDate).format('YYYY-MM-DD');
            baseURL = baseURL + "&primary_release_date.lte=" + endDate;
        }
        return baseURL;
    }

    getListOfMovieIds = (data) => {
        const extractListOfMovieIds = data.results.map(movie => movie.id);
        const listOfMovieIds = this.state.listOfMovieIds.concat(extractListOfMovieIds);
        this.setState({
            listOfMovieIds: listOfMovieIds,
            maxNumOfPages: data.total_pages
        });
    }

    handleFilterDateChange = (dateType, date) => {
        this.setState({ 
            [dateType]: date,
            listOfMovieIds: [],
            page: 1
        }, () => {
            this.getTopRatedMovies(1);
        });
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
        const isTheDocumentAlmostToTheBottom = window.innerHeight + document.documentElement.scrollTop >= (document.documentElement.offsetHeight * 0.8);
        const isSearchResultsOnLastPage = this.state.page >= this.state.maxNumOfPages;
        if (isTheDocumentAlmostToTheBottom && !isSearchResultsOnLastPage) {
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