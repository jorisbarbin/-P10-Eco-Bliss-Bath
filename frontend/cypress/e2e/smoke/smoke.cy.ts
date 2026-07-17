describe("Smoke tests - Eco Bliss Bath", () => {

    it("Affiche les champs et le bouton de connexion", () => {

        cy.visit("http://localhost:4200/#/login");

        cy.get('[data-cy="login-input-username"]').should("be.visible");
        cy.get('input[type="password"]').should("be.visible");
        cy.get('[data-cy="login-submit"]').should("be.visible");

    });

    it("Affiche un bouton d'ajout au panier pour un utilisateur connecté", () => {
        cy.fixture("users").then((users) => {
            cy.visit("http://localhost:4200/#/login");
            
            cy.get('[data-cy="login-input-username"]')
                .type(users.validUser.username);
            cy.get('input[type="password"]')
                .type(users.validUser.password);
            cy.get('[data-cy="login-submit"]')
                .click();
            cy.url().should("not.include", "/login");
            cy.contains("button", "Voir les produits")
                .should("be.visible")
                .click();
            cy.get('[data-cy="product-link"]')
                .should("have.length.greaterThan", 0)
                .first()
                .click();
            cy.get('[data-cy="detail-product-add"]')
                .should("be.visible");
        });
    });
});