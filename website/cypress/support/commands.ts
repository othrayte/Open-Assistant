/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("signInWithEmail", (emailAddress) => {
  cy.log({ emailAddress });
  cy.request("GET", "/api/auth/csrf")
    .then((response) => {
      const csrfToken = response.body.csrfToken;
      cy.request("POST", "/api/auth/signin/email", {
        callbackUrl: "/",
        email: emailAddress,
        csrfToken,
        json: "true",
      });
    })
    .then(() => {
      cy.maildevGetMessageBySentTo(emailAddress.toLowerCase()).then((email) => {
        // Find and use login link
        const loginLink = email.html.match(
          /href="[^"]+(\/api\/auth\/callback\/[^"]+?)"/
        )[1];
        cy.visit(loginLink);
      });
    });
});

export {};
