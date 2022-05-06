import { useEffect, useState } from 'react';
// API
import API from '../API';
// Helpers
import { isPersistedState } from '../helpers';

const useMovieFetch = movieId => {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(false);

        const movie = await API.fetchMovie(movieId);
        const credits = await API.fetchCredits(movieId);
        // Get directors only
        const directors = credits.crew.filter(member => member.job === 'Director');

        setState({
          ...movie,
          actors: credits.cast,
          directors
        });

        setLoading(false);

      } catch (error) {
        setError(true);
      }
    };

    const sessionState = isPersistedState(movieId);
    if(sessionState) {
      console.log('Getting from sessionStorage');
      setState(sessionState);
      setLoading(false);
      return;
    }
    console.log('Getting from API');

    fetchMovie();
  }, [movieId]);

  // Write to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(movieId, JSON.stringify(state));
  }, [movieId, state]);

  return { state, loading, error };
};

export default useMovieFetch;