describe("Fonctionnel - Connexion", () => {
    it("Connecte un utilisateur connu depuis l'interface", () => {
        cy.fixture("users").then((users) => {
            cy.visit("http://localhost:4200/#/login");

            cy.get('[data-cy="login-input-username"]')
                .should("be.visible")
                .type(users.validUser.username);

            cy.get('input[type="password"]')
                .should("be.visible")
                .type(users.validUser.password);

            cy.get('[data-cy="login-submit"]')
                .should("be.visible")
                .click();

            cy.url().should("not.include", "/login");

            cy.get('[data-cy="nav-link-cart"]')
                .should("be.visible");
        });
    });
});