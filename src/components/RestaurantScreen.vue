<template>
  <v-card>
    <v-card-title>Restaurants</v-card-title>
    <v-card-text>
      <NewRestaurantForm />
      <RestaurantList />
    </v-card-text>
  </v-card>
</template>

<script>
import RestaurantList from './RestaurantList';
import NewRestaurantForm from './NewRestaurantForm';
export default {
  name: 'RestaurantScreen',
  components: {
    RestaurantList,
    NewRestaurantForm,
  },
};
</script>
