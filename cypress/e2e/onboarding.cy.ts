/// <reference types="cypress" />

describe("Onboarding Flow Tests", () => {
  beforeEach(() => {
    // Clear state and login with test account
    cy.clearCookies();
    cy.clearLocalStorage();

    // Login with a test user (not the demo user)
    cy.visit("/login");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should("not.include", "/login");

    // Directly navigate to onboarding to test the flow
    cy.visit("/onboarding-one");
  });

  describe("Basic Functionality", () => {
    it("completes the forward navigation flow", () => {
      // Should start on page 1
      cy.url().should("include", "/onboarding-one");

      // Navigate forward through all pages
      cy.get("button").contains("Next").click();
      cy.url().should("include", "/onboarding-two");

      cy.get("button").contains("Next").click();
      cy.url().should("include", "/onboarding-three");

      cy.get("button").contains("Next").click();
      cy.url().should("include", "/onboarding-four");

      // Final page should have "Get Started"
      cy.get("button").contains("Get Started").should("exist");
    });

    it("shows proper design tokens", () => {
      // Check page 1 for design tokens
      cy.url().should("include", "/onboarding-one");

      // Semantic spacing
      cy.get(".px-page-x").should("exist");
      cy.get(".py-page-y").should("exist");
      cy.get(".mb-section").should("exist");

      // Semantic text
      cy.get(".text-hero").should("exist");
      cy.get(".text-body").should("exist");

      // Semantic styling
      cy.get(".rounded-card").should("exist");
      cy.get(".rounded-button").should("exist");
    });

    it("displays progress indicators correctly", () => {
      // Page 1: Step 1 should be active
      cy.url().should("include", "/onboarding-one");
      cy.get('[data-testid="progress-step-1"]').should("exist");
      cy.get('[data-testid="progress-step-2"]').should("exist");
      cy.get('[data-testid="progress-step-3"]').should("exist");
      cy.get('[data-testid="progress-step-4"]').should("exist");

      // Navigate to page 2 and check progress
      cy.get("button").contains("Next").click();
      cy.url().should("include", "/onboarding-two");
      cy.get('[data-testid="progress-step-2"]').should("exist");
    });

    it("has consistent page structure", () => {
      // Check page structure
      cy.url().should("include", "/onboarding-one");

      // Main containers
      cy.get(".min-h-screen").should("exist");
      cy.get(".max-w-3xl").should("exist");

      // Navigation
      cy.get("button").contains("←").should("exist");
      cy.get("button").contains("Next").should("exist");

      // Content
      cy.get("h1").should("exist");
      cy.get("p").should("exist");
      cy.get(".min-h-\\[220px\\]").should("exist");
    });
  });

  describe("Onboarding Completion", () => {
    it("completes onboarding successfully", () => {
      // Mock the completion API
      cy.intercept("POST", "**/api/user/onboarding-complete", {
        statusCode: 200,
        body: { success: true },
      }).as("completeOnboarding");

      // Navigate to final page
      cy.visit("/onboarding-four");

      // Complete onboarding
      cy.get("button").contains("Get Started").click();

      // Should call the API
      cy.wait("@completeOnboarding");

      // Should navigate away from onboarding
      cy.url().should("not.include", "/onboarding");
    });
  });

  describe("Error Handling", () => {
    it("handles API errors gracefully", () => {
      // Mock API failure
      cy.intercept("POST", "**/api/user/onboarding-complete", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("apiError");

      cy.visit("/onboarding-four");

      cy.get("button").contains("Get Started").click();
      cy.wait("@apiError");

      // Should still navigate away (graceful fallback)
      cy.url().should("not.include", "/onboarding-four");
    });
  });

  describe("Content Verification", () => {
    it("displays unique content on each page", () => {
      // Page 1
      cy.url().should("include", "/onboarding-one");
      cy.get("h1").should("contain.text", "Proximity");

      // Page 2
      cy.visit("/onboarding-two");
      cy.get("h1").should("contain.text", "Confidence");

      // Page 3
      cy.visit("/onboarding-three");
      cy.get("h1").should("contain.text", "Journey");

      // Page 4
      cy.visit("/onboarding-four");
      cy.get("h1").should("contain.text", "Begin");
    });
  });
});
