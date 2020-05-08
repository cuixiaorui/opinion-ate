import Vue from 'vue';
import Vuetify from 'vuetify';
import flushPromises from 'flush-promises';
import Vuex from 'vuex';
import {mount, createLocalVue} from '@vue/test-utils';
import NewRestaurantForm from '@/components/NewRestaurantForm.vue';
import api from '../../../src/api';

Vue.use(Vuetify);
describe('NewRestaurantForm', () => {
  const restaurantName = 'Sushi Place';
  const localVue = createLocalVue();
  localVue.use(Vuex);

  let restaurantsModule;
  let wrapper;

  beforeEach(() => {
    restaurantsModule = {
      namespaced: true,
      actions: {
        create: jest.fn().mockName('create'),
      },
    };

    const store = new Vuex.Store({
      modules: {
        restaurants: restaurantsModule,
      },
    });

    wrapper = mount(NewRestaurantForm, {
      localVue,
      store,
      attachToDocument: true,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('initially', () => {
    it('does not display a validation error', () => {
      const element = wrapper.find('[data-testid="new-restaurant-name-error"]')
        .element;
      expect(element).not.toBeDefined();
    });

    it('does not display a server error', () => {
      const element = wrapper.find(
        '[data-testid="new-restaurant-server-error"]',
      ).element;
      expect(element).not.toBeDefined();
    });
  });

  describe('when filled in', () => {
    beforeEach(() => {
      wrapper
        .find('[data-testid="new-restaurant-name-field"]')
        .setValue(restaurantName);

      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
    });

    it('dispatcher the create action', () => {
      expect(restaurantsModule.actions.create).toHaveBeenCalledWith(
        expect.anything(),
        restaurantName,
      );
    });

    it('clears the name', () => {
      const value = wrapper.find('[data-testid="new-restaurant-name-field"]')
        .element.value;
      expect(value).toEqual('');
    });
  });

  describe('when empty', () => {
    beforeEach(() => {
      wrapper.find('[data-testid="new-restaurant-name-field"]').setValue('');
      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
    });

    it('displays a valiadtion error', () => {
      const errorText = wrapper
        .find('[data-testid="new-restaurant-name-error"]')
        .text();
      expect(errorText).toContain('Name is require');
    });

    it('does not dispatch the create action', () => {
      expect(restaurantsModule.actions.create).not.toHaveBeenCalled();
    });
  });

  describe('when correcting a validation error', () => {
    beforeEach(() => {
      wrapper.find('[data-testid="new-restaurant-name-field"]').setValue('');
      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');

      wrapper
        .find('[data-testid="new-restaurant-name-field"]')
        .setValue(restaurantName);

      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
    });

    it('clears the validation error', () => {
      const element = wrapper.find('[data-testid="new-restaurant-name-error"]')
        .element;
      expect(element).not.toBeDefined();
    });
  });

  describe('when the store action rejects', () => {
    beforeEach(() => {
      restaurantsModule.actions.create.mockRejectedValue();

      wrapper
        .find('[data-testid="new-restaurant-name-field"]')
        .setValue(restaurantName);

      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
    });

    it('displays a server error', () => {
      expect(
        wrapper.find('[data-testid="new-restaurant-server-error"]').text(),
      ).toContain('The restaurant could not be saved. Please try agein');
    });

    it('does not clear the name', () => {
      const element = wrapper.find('[data-testid="new-restaurant-name-field"]')
        .element;
      expect(element.value).toEqual(restaurantName);
    });
  });

  describe('when retrying after a server error', () => {
    beforeEach(async () => {
      restaurantsModule.actions.create
        .mockRejectedValueOnce()
        .mockResolvedValueOnce();

      wrapper
        .find('[data-testid="new-restaurant-name-field"]')
        .setValue('Sushi Place');

      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
      await flushPromises();

      wrapper
        .find('[data-testid="new-restaurant-submit-button"]')
        .trigger('click');
    });

    it('clears the server error', () => {
      const element = wrapper.find(
        '[data-testid="new-restaurant-server-error"]',
      ).element;
      expect(element).not.toBeDefined();
    });
  });
});
