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

  it("Refuse la connexion avec des identifiants invalides", () => {
    cy.fixture("users").then((users) => {
      cy.request({
        method: "POST",
        url: "/login",
        body: users.invalidUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401);

      });

    });
  });

it("Ajoute un produit disponible au panier", () => {

      cy.login().then((token) => {
          cy.request("/products").then((productsResponse) => {
              const product = productsResponse.body.find(
                  (p: any) => p.availableStock > 0
              );
              expect(product).to.exist;
              cy.request({
                  method: "PUT",
                  url: "/orders/add",
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                  body: {
                      product: product.id,
                      quantity: 1,
                  },
              }).then((response) => {
                  expect(response.status).to.equal(200);
              });
          });
      });
  });

  it("Retrouve le produit ajouté dans le panier", () => {

      cy.login().then((token) => {
          cy.request({
              method: "GET",
              url: "/orders",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }).then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property("orderLines");
              expect(response.body.orderLines).to.be.an("array");
              expect(response.body.orderLines.length).to.be.greaterThan(0);
              console.log(Object.keys(response.body));
          });
      });
  });

  it("Supprime un produit du panier", () => {
    cy.login().then((token) => {
      cy.request({
        method: "GET",
        url: "/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((orderResponse) => {
        expect(orderResponse.status).to.equal(200);
        expect(orderResponse.body.orderLines).to.be.an("array");
        expect(orderResponse.body.orderLines.length).to.be.greaterThan(0);
 
        const lineId = orderResponse.body.orderLines[0].id;

        cy.request({
          method: "DELETE",
          url: `/orders/${lineId}/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.equal(200);
          expect(deleteResponse.body.orderLines).to.be.an("array");
 
          const deletedLine = deleteResponse.body.orderLines.find(
            (line: any) => line.id === lineId
          );

          expect(deletedLine).to.not.exist;
        });
      });
    });
  });

});