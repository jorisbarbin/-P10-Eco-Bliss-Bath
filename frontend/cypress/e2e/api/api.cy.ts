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

  it("Récupère la liste des produits", () => {
    cy.request({
      method: "GET",
      url: "/products",
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it("Authentifie un utilisateur connu", () => {
    cy.fixture("users").then((users) => {

      cy.request({
        method: "POST",
        url: "/login",
        body: users.validUser,
      }).then((response) => {

        expect(response.status).to.equal(200);

        expect(response.body).to.have.property("token");
        expect(response.body.token).to.be.a("string");
        expect(response.body.token).to.not.be.empty;

      });

    });
  });
});