# Most Popular Movie Titles

This repo contains the code for a single-page web application that will list the most popular movie titles based on movies' average rating from The Movie Database(TMDB). 

## Demo
[http://ec2-34-207-182-11.compute-1.amazonaws.com/](http://ec2-34-207-182-11.compute-1.amazonaws.com/)

## Features
- List the titles of the most popular movies based on average ratings
- Adjust the time range of the results
- Supports infinite scrolling for new results

## Available Scripts
``` diff
- Note: You need to have your own API Key for TMDB in order to run the application. 
```
In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Technologies and Libraries Used
- **Create-React-App**: Base application
- **Material-UI**: Google's component library/UI framework for React
- **Axios**: Make GET requests from TMDB
- **npm**: Package manager to manage dependencies
- **AWS EC2**: Host the server-side JS