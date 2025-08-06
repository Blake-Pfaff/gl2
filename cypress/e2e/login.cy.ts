/// <reference types="cypress" />

describe("Login flow", () => {
  beforeEach(() => {
    // start each test on the login page
    cy.visit("/login");
  });

  it("renders the login form", () => {
    cy.get("h1").contains("Log In");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  it("shows validation errors", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });

  it("rejects bad credentials", () => {
    cy.intercept("POST", "**/api/auth/callback/credentials", {
      statusCode: 401,
      body: {
        error: "CredentialsSignin",
        status: 401,
        ok: false,
        url: null,
      },
    }).as("loginAttempt");

    cy.get('input[name="email"]').type("noone@example.com");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginAttempt");
    cy.contains("Invalid email or password").should("be.visible");
  });
});
