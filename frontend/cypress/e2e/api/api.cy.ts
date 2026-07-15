describe("API - Authentification", () => {

  it("Refuse l'accès au panier lorsqu'un utilisateur n'est pas connecté", () => {

    cy.request({
      method: "GET",
      url: "/orders",
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.equal(401);

    });

  });

});