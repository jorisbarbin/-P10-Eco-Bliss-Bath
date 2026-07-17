describe("Fonctionnel - Panier", () => {

    it("Ajoute un produit au panier depuis l'interface", () => {

        cy.fixture("users").then((users) => {

            cy.visit("http://localhost:4200/#/login");

            cy.get('[data-cy="login-input-username"]')
                .type(users.validUser.username);

            cy.get('input[type="password"]')
                .type(users.validUser.password);

            cy.get('[data-cy="login-submit"]')
                .click();

            cy.url().should("not.include", "/login");

            cy.contains("Voir les produits")
                .click();

            cy.url().should("include", "#/products");

            cy.get('[data-cy="product-link"]')
                .should("have.length.greaterThan", 0)
                .first()
                .click();

            cy.get('[data-cy="detail-product-add"]')
                .should("be.visible");

            cy.get('[data-cy="detail-product-add"]')
                .click();

            cy.get('[data-cy="nav-link-cart"]')
                .click();

            cy.url().should("include", "#/cart");

            cy.get('[data-cy="cart-line-name"]')
                .should("have.length.greaterThan", 0);

        });

    });

});