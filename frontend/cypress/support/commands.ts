declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<string>;
        }
    }
}

Cypress.Commands.add("login", () => {

    return cy.fixture("users").then((users) => {

        return cy.request({
            method: "POST",
            url: "/login",
            body: users.validUser,
        }).then((response) => {

            return response.body.token;

        });

    });

});

export {};