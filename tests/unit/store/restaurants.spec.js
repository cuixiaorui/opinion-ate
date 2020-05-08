import Vuex from 'vuex';
import {createLocalVue} from '@vue/test-utils';
import restaurants from '@/store/restaurants';

describe('restaurants', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  describe('when loading succeeds', () => {
    let store;
    const records = [
      {
        id: 1,
        name: 'Sushi Place',
      },
      {
        id: 2,
        name: 'Pizza Place',
      },
    ];
    beforeEach(() => {
      const api = {
        loadRestaurants() {
          return Promise.resolve({data: records});
        },
      };
      store = new Vuex.Store({
        modules: {
          restaurants: restaurants(api),
        },
      });

      return store.dispatch('restaurants/load');
    });
    it('stores the restaurants', () => {
      expect(store.state.restaurants.records).toEqual(records);
    });

    it('clears the loading flag', () => {
      expect(store.state.restaurants.loading).toEqual(false);
    });
  });

  describe('initially', () => {
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          restaurants: restaurants(),
        },
      });
    });
    it('does not have the loading flag set', () => {
      expect(store.state.restaurants.loading).toEqual(false);
    });

    it('does not have the error flag set', () => {
      expect(store.state.restaurants.loadError).toEqual(false);
    });
  });

  describe('while loading ', () => {
    let store;
    beforeEach(() => {
      const api = {
        loadRestaurants: () => new Promise(() => {}),
      };

      store = new Vuex.Store({
        modules: {
          restaurants: restaurants(api, {loadError: true}),
        },
      });

      return store.dispatch('restaurants/load');
    });

    it('sets a loading flag', () => {
      expect(store.state.restaurants.loading).toEqual(true);
    });

    it('clear the error flag', () => {
      expect(store.state.restaurants.loadError).toEqual(false);
    });
  });

  describe('when loading fails ', () => {
    let store;
    beforeEach(() => {
      const api = {
        loadRestaurants: () => Promise.reject(),
      };

      store = new Vuex.Store({
        modules: {
          restaurants: restaurants(api),
        },
      });

      return store.dispatch('restaurants/load');
    });
    it('应该显示loadError图标', () => {
      expect(store.state.restaurants.loadError).toEqual(true);
    });

    it('不应该显示loading图标', () => {
      expect(store.state.restaurants.loading).toEqual(false);
    });
  });

  describe('create action', () => {
    const newRestaurantName = 'Sushi Place';
    const existingRestaurant = {id: 1, name: 'Pizza Place'};
    const responseRestaurant = {id: 2, name: newRestaurantName};

    let api;
    let store;
    let promise;
    beforeEach(() => {
      api = {
        createRestaurant: jest
          .fn()
          .mockName('createRestaurant')
          .mockRejectedValue(),
      };

      store = new Vuex.Store({
        modules: {
          restaurants: restaurants(api, {records: [existingRestaurant]}),
        },
      });
    });
    it('saves the restaurant to the server', () => {
      store.dispatch('restaurants/create', newRestaurantName);
      expect(api.createRestaurant).toHaveBeenCalledWith(newRestaurantName);
    });

    describe('when save succeeds', () => {
      beforeEach(() => {
        api.createRestaurant.mockResolvedValue(responseRestaurant);
        promise = store.dispatch('restaurants/create', newRestaurantName);
      });

      it('stores the returned restaurant in the store', () => {
        expect(store.state.restaurants.records).toEqual([
          existingRestaurant,
          responseRestaurant,
        ]);
      });

      it('resolves', () => {
        return expect(promise).resolves.toBeUndefined();
      });
    });

    describe('when save fails', () => {
      it('rejects', () => {
        api.createRestaurant.mockRejectedValue();
        promise = store.dispatch('restaurants/create', newRestaurantName);
        return expect(promise).rejects.toBeUndefined();
      });
    });
  });
});
