import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Filter from "./components/filter.component";
import MovieDetails from "./components/movie-details.component";
import "./App.css";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from "@material-ui/core";

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
    endOfResults: {
        textAlign: "center"
    },
    noSearchResults: {
        textAlign: "center"
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
        if (filteredListOfMovies.length < 2) {
            this.getMoreMovieData();
        }
        this.setState({ 
            listOfMovieIds: listOfMovieIds,
            maxNumOfPages: data.total_pages
        });
    }

    getFilteredListOfMovies = (results) => {
        let filteredListOfMovies = results;
        if (this.state.filterStartDate) {
            filteredListOfMovies = filteredListOfMovies.filter((movie) => {
                return new Date(movie.release_date) >= new Date(this.state.filterStartDate)
            });
        }
        if (this.state.filterEndDate) {
            filteredListOfMovies = filteredListOfMovies.filter((movie) => {
                return new Date(movie.release_date) <= new Date(this.state.filterEndDate)
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
            this.setState({
                    page: newPage
            });
            this.getTopRatedMovies(newPage);
        }
    }

    infiniteScroll = () => {
        const isTheDocumentAtTheBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
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
                <Grid item xs={9}>
                    {
                        this.state.listOfMovieIds && this.state.listOfMovieIds.length > 0 && this.state.page <= this.state.maxNumOfPages ? 
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
                            :
                            <Typography variant="h4" color="error" className={classes.noSearchResults}>There are no search results found, please try again.</Typography>
                    }
                    {
                        this.state.page >= this.state.maxNumOfPages ?
                            <Typography variant="h4" color="primary" className={classes.endOfResults}>You've reached the end of the search results.</Typography>
                            :
                            null
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(App);