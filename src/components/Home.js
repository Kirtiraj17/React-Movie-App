import React from 'react';
// Config
import { POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL } from '../config';
// API
import API from '../API';
// Components
import HeroImage from './HeroImage';
import SearchBar from './SearchBar';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import Button from './Button';
// Hook (custom)
import { useHomeFetch } from '../hooks/useHomeFetch';
// Image
import NoImage from '../images/no_image.jpg';

const Home = () => {
  const { state: state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore } = useHomeFetch();
  if(state) {
    console.log(state);
    if(error) {
      return <div>Something Went Wrong!</div>;
    }

    return (
      <React.Fragment>
        { !searchTerm && state.results[0] ?
        <HeroImage 
          image = {`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.results[0].backdrop_path}`}
          title = {state.results[0].original_title}
          text = {state.results[0].overview}
        /> 
        : null }
        <SearchBar setSearchTerm={setSearchTerm} />
        <Grid header={searchTerm ? 'Search Results: ' : 'Popular Movies'}>
          {state.results.map(movie => (
            <Thumb
              key={movie.id}
              image={movie.poster_path ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path : NoImage}
              movieId={movie.id}
              clickable
            />
          ))}
        </Grid>
        {loading && <Spinner />}
        {state.page < state.total_pages && !loading && (
          <Button text='Load More' callback={() => setIsLoadingMore(true)} />
        )}
      </React.Fragment>
    );
  } else {
    return <div>Home Page</div>;
  }
};

export default Home;