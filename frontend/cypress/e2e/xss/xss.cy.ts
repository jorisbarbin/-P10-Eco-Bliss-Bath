describe("Sécurité - XSS", () => {
    it("N'exécute pas de script injecté dans un commentaire", () => {
        const xssPayload =
            '<img src="fake.jpg" onerror="window.xssDetected=true">';

        cy.login().then((token) => {
            cy.request({
                method: "POST",
                url: "/reviews",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    title: "Test de sécurité XSS",
                    comment: xssPayload,
                    rating: 5,
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
            });
        });

        cy.visit("http://localhost:4200/#/reviews", {
            onBeforeLoad(win) {
                (win as any).xssDetected = false;
            },
        });

        cy.window().should((win) => {
            expect((win as any).xssDetected).to.equal(false);
        });
    });

    it("N'exécute pas une balise script injectée dans un commentaire", () => {
        const xssPayload = '<script>window.xssDetected=true</script>';

        cy.login().then((token) => {
            cy.request({
                method: "POST",
                url: "/reviews",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    title: "Test XSS script",
                    comment: xssPayload,
                    rating: 5,
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
            });
        });

        cy.visit("http://localhost:4200/#/reviews", {
            onBeforeLoad(win) {
                (win as any).xssDetected = false;
            },
        });

        cy.window().should((win) => {
            expect((win as any).xssDetected).to.equal(false);
        });
    });
});
