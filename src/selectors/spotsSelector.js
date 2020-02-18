import { createSelector } from 'reselect';
import { regionSelector } from '../Reducers/map';
import { spotsSelectorGlobal } from '../Reducers/spots';

// const deltaMul = 1.2;

export default createSelector(
  regionSelector,
  spotsSelectorGlobal,
  (region, spots) => {
    if (!spots) {
      return [];
    }
    const res = spots
      .map((spot) => {
        const longitude = spot.location.coordinates[0];
        const latitude = spot.location.coordinates[1];
        return {
          ...spot,
          location: { ...spot.location, longitude, latitude }
        };
      });
    return res;
  }
);
