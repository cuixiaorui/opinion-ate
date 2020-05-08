describe('Creating a Restaurant', () => {
  it('allows adding restaurants', () => {
    const restaurantId = 27;
    const restaurantName = 'Sushi Place';

    cy.server({force404: true});

    cy.route({
      method: 'GET',
      url:
        'https://api.outsidein.dev/e5kg5l48UnKAV2x4m1OMUVO9BkBaZ1tA/restaurants',
      response: [],
    });

    cy.route({
      method: 'POST',
      url:
        'https://api.outsidein.dev/e5kg5l48UnKAV2x4m1OMUVO9BkBaZ1tA/restaurants',
      response: {
        id: restaurantId,
        name: restaurantName,
      },
    }).as('addRestaurant');

    cy.visit('/');

    // when
    // 输入要添加的餐厅名称
    // 点击添加按钮
    cy.get('[placeholder="Add Restaurant"]').type(restaurantName);
    cy.contains('Add').click();

    // then
    // 验证请求内容
    cy.wait('@addRestaurant')
      .its('requestBody')
      .should('deep.equal', {
        name: restaurantName,
      });

    cy.contains(restaurantName);
  });
});
