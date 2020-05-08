describe('Listing Restaurants', () => {
  it('shows restaurants from the server', async () => {
    const sushiPlace = 'Sushi Place';
    const pizzaPlace = 'Pizza Place';

    cy.server({force404: true});

    cy.route({
      method: 'GET',
      url:
        'https://api.outsidein.dev/e5kg5l48UnKAV2x4m1OMUVO9BkBaZ1tA/restaurants',
      response: [
        {id: 1, name: sushiPlace},
        {id: 2, name: pizzaPlace},
      ],
    });

    cy.visit('/');
    cy.contains(sushiPlace);
    cy.contains(pizzaPlace);
  });
});
