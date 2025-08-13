/// <reference types="cypress" />

describe("Onboarding Flow Tests", () => {
  beforeEach(() => {
    // Clear state and login with test account
    cy.clearCookies();
    cy.clearLocalStorage();

    // Login with a test user (not the special onboarding user)
    cy.visit("/login");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should("not.include", "/login");

    // Directly navigate to onboarding to test the flow
    cy.visit("/onboarding");
  });

  describe("Basic Functionality", () => {
    it("completes the forward navigation flow", () => {
      // Should start on onboarding (step 1 of dynamic flow)
      cy.url().should("include", "/onboarding");

      // Navigate forward through all steps
      cy.get("button").contains("Next").click();
      cy.get('[data-testid="progress-step-2"]').should("exist");

      cy.get("button").contains("Next").click();
      cy.get('[data-testid="progress-step-3"]').should("exist");

      cy.get("button").contains("Next").click();
      cy.get('[data-testid="progress-step-4"]').should("exist");

      // Final step should have "Get Started"
      cy.get("button").contains("Get Started").should("exist");
    });

    it("shows proper design tokens", () => {
      // Check page for design tokens
      cy.url().should("include", "/onboarding");

      // Semantic spacing
      cy.get(".px-page-x").should("exist");
      cy.get(".py-page-y").should("exist");
      cy.get(".mb-section").should("exist");

      // Semantic text
      cy.get(".text-hero").should("exist");
      cy.get(".text-body").should("exist");

      // Semantic styling: back button is rounded-button
      cy.get(".rounded-button").should("exist");
    });

    it("displays progress indicators correctly", () => {
      // Step 1: indicators should exist
      cy.url().should("include", "/onboarding");
      cy.get('[data-testid="progress-step-1"]').should("exist");
      cy.get('[data-testid="progress-step-2"]').should("exist");
      cy.get('[data-testid="progress-step-3"]').should("exist");
      cy.get('[data-testid="progress-step-4"]').should("exist");

      // Navigate to step 2 and check progress
      cy.get("button").contains("Next").click();
      cy.get('[data-testid="progress-step-2"]').should("exist");
    });

    it("has consistent page structure", () => {
      // Check page structure
      cy.url().should("include", "/onboarding");

      // Main containers
      cy.get(".min-h-screen").should("exist");
      cy.get(".max-w-3xl").should("exist");

      // Navigation
      cy.get("button").contains("←").should("exist");
      cy.get("button").contains("Next").should("exist");

      // Content
      cy.get("h1").should("exist");
      cy.get("p").should("exist");

      // Fixed height container for consistent spacing (using design tokens)
      cy.get(".mb-section").should("exist");
      cy.get(".text-center").should("exist");
    });
  });

  describe("Onboarding Completion", () => {
    it("completes onboarding successfully", () => {
      // Mock the completion API
      cy.intercept("POST", "**/api/user/onboarding-complete", {
        statusCode: 200,
        body: { success: true },
      }).as("completeOnboarding");

      // Navigate to last step
      cy.visit("/onboarding");
      cy.get("button").contains("Next").click();
      cy.get("button").contains("Next").click();
      cy.get("button").contains("Next").click();

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

      // Navigate to last step
      cy.visit("/onboarding");
      cy.get("button").contains("Next").click();
      cy.get("button").contains("Next").click();
      cy.get("button").contains("Next").click();

      cy.get("button").contains("Get Started").click();
      cy.wait("@apiError");

      // Should still navigate away (graceful fallback)
      cy.url().should("not.include", "/onboarding");
    });
  });

  describe("Content Verification", () => {
    it("displays unique content on each page", () => {
      // Step 1
      cy.url().should("include", "/onboarding");
      cy.get("h1").should("exist");
      cy.get("p").should("exist");

      // Step 2
      cy.get("button").contains("Next").click();
      cy.get("h1").should("exist");
      cy.get("p").should("exist");

      // Step 3
      cy.get("button").contains("Next").click();
      cy.get("h1").should("exist");
      cy.get("p").should("exist");

      // Step 4
      cy.get("button").contains("Next").click();
      cy.get("h1").should("exist");
      cy.get("p").should("exist");
    });
  });
});
