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

  it("Refuse l'ajout d'un produit en rupture de stock", () => {
    cy.login().then((token) => {
      cy.request("/products").then((productsResponse) => {
        expect(productsResponse.status).to.equal(200);

        const unavailableProduct = productsResponse.body.find(
          (product: any) => product.availableStock <= 0
        );

        expect(unavailableProduct).to.exist;

        cy.request({
          method: "PUT",
          url: "/orders/add",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            product: unavailableProduct.id,
            quantity: 1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.log(JSON.stringify(response.body));
          console.log(response.status, response.body);
        });
      });
    });
  });

  it("Récupère la fiche d'un produit", () => {

    cy.request("/products").then((productsResponse) => {

      expect(productsResponse.status).to.equal(200);

      const productId = productsResponse.body[0].id;

      cy.request(`/products/${productId}`).then((response) => {

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id", productId);
        expect(response.body).to.have.property("name");
        expect(response.body).to.have.property("description");
        expect(response.body).to.have.property("price");
        expect(response.body).to.have.property("availableStock");
      });
    });
  });

  it("Crée un nouvel avis", () => {

    cy.login().then((token) => {

      cy.request({
        method: "POST",
        url: "/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: "Excellent produit",
          comment: "Avis créé automatiquement avec Cypress",
          rating: 5,
        },
      }).then((response) => {

        expect(response.status).to.equal(200);

        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("title", "Excellent produit");
        expect(response.body).to.have.property("comment");
        expect(response.body).to.have.property("rating", 5);
      });
    });
  });

});