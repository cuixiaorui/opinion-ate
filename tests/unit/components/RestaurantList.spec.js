import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import {mount, createLocalVue} from '@vue/test-utils';

import RestaurantList from '@/components/RestaurantList.vue';
describe('RestaurantList', () => {
  Vue.use(Vuetify);
  function findByTestId(testId, index) {
    return wrapper.findAll(`[data-testid="${testId}"]`).at(index);
  }
  const records = [
    {id: 1, name: 'Sushi Place'},
    {id: 2, name: 'Pizza Place'},
  ];
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let wrapper;
  let restaurantsModule;

  const mountWithStore = (
    state = {records, loading: false, loadError: false},
  ) => {
    restaurantsModule = {
      namespaced: true,
      state,
      actions: {
        load: jest.fn().mockName('load'),
      },
    };
    const store = new Vuex.Store({
      modules: {
        restaurants: restaurantsModule,
      },
    });

    wrapper = mount(RestaurantList, {localVue, store});
  };

  describe('when loading succeeds', () => {
    beforeEach(() => {
      mountWithStore();
    });
    it('does not display the loading indicator while not loading', async () => {
      expect(wrapper.contains('[data-testid="loading-indicator"]')).toBe(false);
    });

    it('displays the restaurants', () => {
      expect(findByTestId('restaurant', 0).text()).toBe('Sushi Place');
      expect(findByTestId('restaurant', 1).text()).toBe('Pizza Place');
    });

    it('does not display the loading error', () => {
      mountWithStore();
      expect(wrapper.contains('[data-testid="loading-error"]')).toBe(false);
    });
  });

  describe('when loading fail', () => {
    it('displays the loading error ', () => {
      mountWithStore({loadError: true});
      expect(wrapper.contains('[data-testid="loading-error"]')).toBe(true);
    });
  });

  it('displays the loading indicator while loading', () => {
    mountWithStore({loading: true});
    expect(wrapper.contains('[data-testid="loading-indicator"]')).toBe(true);
  });

  it('loads restaurants on mount', () => {
    mountWithStore();
    expect(restaurantsModule.actions.load).toHaveBeenCalled();
  });
});
