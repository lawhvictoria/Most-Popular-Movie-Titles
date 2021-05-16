import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Typography } from "@material-ui/core";

const styles = {
    posterImage: {
        height: "120px"
    },
    movieDetails: {
        textAlign: "left",
    },
    container: {
        marginBottom: "10px",
        border: "3px solid grey",
        alignItems:"center"
    }
};

class MovieDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posterPath: null,
            title: null,
            releaseDate: null,
            runtime: null,
            genres: null,
            voteAverage: null,
            metascore: null,
            certification: null
        };
    }

    componentDidMount = () => {
        const getRequestURL = "https://api.themoviedb.org/3/movie/" + this.props.movieID + "?api_key=" + process.env.REACT_APP_API_KEY + "&language=en-US";
        axios.get(getRequestURL)
            .then(response => this.processAPIResponse(response));
    }

    processAPIResponse = (response) => {
        this.setPosterImage(response.data.poster_path);
        this.setMovieProperties(response.data);
    }

    getCertificationRating = (movieId) => {
        const certificationURL = "https://api.themoviedb.org/3/movie/" + movieId + "/release_dates?api_key=" + process.env.REACT_APP_API_KEY;
        axios.get(certificationURL)
            .then(response => this.setCertificationRating(response.data.results));
    }

    setCertificationRating = (results) => {
        let certificationResult = "";
        const unitedStatesCertification = results.find((countryOfRelease) => { return countryOfRelease.iso_3166_1 === "US" });
        if (unitedStatesCertification) {
            certificationResult = unitedStatesCertification.release_dates[0].certification;
        }
        const certification = certificationResult === "" ? "Not Rated" : certificationResult;
        this.setState({ certification: certification });
    }

    setPosterImage = (posterPath) => {
        const posterURL = "https://image.tmdb.org/t/p/w500" + posterPath;
        this.setState({ posterPath: posterURL });
    }

    setMovieProperties = (data) => {
        this.getCertificationRating(data.id);
        const convertedRuntime = this.convertMinsToHrsMins(data.runtime);
        const listOfGenres = this.getGenreNames(data.genres).join(", ");
        this.setState({
            title: data.original_title,
            releaseDate: data.release_date,
            runtime: convertedRuntime,
            voteAverage: data.vote_average,
            metascore: data.popularity,
            genres: listOfGenres
        });
    }

    convertMinsToHrsMins = (minutes) => {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        return hours + " hour(s) " + mins + " minutes";
      }
    
    getGenreNames = (listOfGenres) => {
        return listOfGenres.map(genre => genre.name);
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container spacing={2} className={classes.container}>
                <Grid item>
                    <img 
                        src={this.state.posterPath} 
                        className={classes.posterImage}
                        alt={this.state.title}
                    />
                </Grid>
                <Grid item className={classes.movieDetails}>
                    <Typography variant="h6">
                        <strong>{this.state.title}</strong> ({this.state.releaseDate})
                    </Typography>
                    <Typography variant="h6">
                        {this.state.certification} | {this.state.runtime} | {this.state.genres}
                    </Typography>
                    <Typography variant="h6">
                        <strong>IMDB Rating:</strong> {this.state.voteAverage}/10 | <strong> Metascore:</strong> {this.state.metascore}
                    </Typography>
                </Grid>
            </Grid>
      );
    }
}

export default withStyles(styles)(MovieDetails);