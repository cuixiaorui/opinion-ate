const restaurants = (api, stateOverrides) => ({
  namespaced: true,
  state: {
    records: [],
    loading: false,
    loadError: false,
    ...stateOverrides,
  },

  mutations: {
    storeRecords(state, records) {
      state.records = records;
      state.loading = false;
    },
    startLoading(state) {
      state.loading = true;
      state.loadError = false;
    },
    recordLoadingError(state) {
      state.loadError = true;
      state.loading = false;
    },

    addRecord(state, record) {
      state.records.push(record);
    },
  },
  actions: {
    load({commit}) {
      commit('startLoading');
      api
        .loadRestaurants()
        .then(res => {
          commit('storeRecords', res.data);
        })
        .catch(() => {
          commit('recordLoadingError');
        });
    },

    create({commit}, restaurantName) {
      return api.createRestaurant(restaurantName).then(data => {
        commit('addRecord', data);
      });
    },
  },
});

export default restaurants;
