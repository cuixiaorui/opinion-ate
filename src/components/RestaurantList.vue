<template>
  <div>
    <v-progress-circular
      indeterminate
      color="primary"
      data-testid="loading-indicator"
      v-if="loading"
    ></v-progress-circular>
    <v-alert v-if="loadError" type="error" data-testid="loading-error"
      >Restaurants could not be loaded</v-alert
    >
    <v-list-itme
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      data-testid="restaurant"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ restaurant.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-itme>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
  name: 'RestaurantList',
  methods: mapActions({
    loadRestaurants: 'restaurants/load',
  }),
  computed: mapState({
    restaurants: state => state.restaurants.records,
    loading: state => state.restaurants.loading,
    loadError: state => state.restaurants.loadError,
  }),
  mounted() {
    this.loadRestaurants();
  },
};
</script>
