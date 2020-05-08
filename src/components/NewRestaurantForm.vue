<template>
  <form @submit.prevent="handleSave">
    <v-alert
      v-if="serverError"
      type="error"
      data-testid="new-restaurant-server-error"
    >
      The restaurant could not be saved. Please try agein
    </v-alert>
    <v-alert
      v-if="validationError"
      type="error"
      data-testid="new-restaurant-name-error"
    >
      Name is required
    </v-alert>
    <v-text-field
      placeholder="Add Restaurant"
      filled
      type="text"
      data-testid="new-restaurant-name-field"
      v-model="name"
    ></v-text-field>

    <v-btn
      type="submit"
      color="primary"
      class="black--text"
      data-testid="new-restaurant-submit-button"
      >Add</v-btn
    >
  </form>
</template>

<script>
import {mapActions} from 'vuex';
export default {
  name: 'NewRestaurantForm',
  data() {
    return {
      name: '',
      validationError: false,
      serverError: false,
    };
  },

  methods: {
    ...mapActions({
      createRestaurant: 'restaurants/create',
    }),
    handleSave() {
      if (!this.name) {
        this.validationError = true;
        return;
      }

      this.serverError = false;
      this.validationError = false;
      this.createRestaurant(this.name)
        .then(() => {
          this.name = '';
        })
        .catch(() => {
          this.serverError = true;
        });
    },
  },
};
</script>

<style></style>
