import axios from 'axios';

const myAxios = axios.create({
  baseURL: 'https://api.outsidein.dev/e5kg5l48UnKAV2x4m1OMUVO9BkBaZ1tA',
});

export default {
  loadRestaurants() {
    return myAxios.get('/restaurants');
  },

  createRestaurant(restaurantName) {
    return myAxios
      .post('/restaurants', {
        name: restaurantName,
      })
      .then(res => res.data);
  },
};
