import { faker } from "@faker-js/faker";

describe("replying as the assistant", () => {
  it("saves the new reply in the database then shows new convertsation to reply to when requested", () => {
    cy.signInWithEmail("cypress@example.com");
    cy.visit("/create/assistant_reply");

    cy.get('[data-cy="propt-id"').then((promptIdElement) => {
      const promptId = promptIdElement.text();

      const reply = faker.lorem.sentence();
      cy.log({ reply });
      cy.get('[data-cy="reply"').type(reply);

      cy.get('[data-cy="submit"]').click();
      // TODO: Verify that it stored the message
      cy.get('[data-cy="new-task"]').click();

      cy.get('[data-cy="propt-id"').should((promptIdElement) => {
        expect(promptIdElement.text()).not.to.eq(promptId);
      });
    });
  });
  it("gets a new convertsation to reply to when current one skipped", () => {
    // TODO: Functionality not yet implemented
  });
});

export {};
