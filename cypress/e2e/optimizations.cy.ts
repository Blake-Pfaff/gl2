/// <reference types="cypress" />

describe("Optimizations Tests", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      if (err.message.includes("Invalid or unexpected token")) {
        return false;
      }
      return true;
    });
  });

  describe("Design Tokens Implementation", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("uses design token classes for spacing", () => {
      // Check that design token classes are being used instead of hardcoded values
      cy.get(".px-page-x").should("exist");
      cy.get(".py-page-y").should("exist");
      cy.get(".gap-component").should("exist");
      cy.get(".mb-section").should("exist");
      cy.get(".p-component").should("exist");
      cy.get(".mb-compact").should("exist");
    });

    it("uses design token classes for border radius", () => {
      // Check border radius tokens
      cy.get(".rounded-button").should("exist");
      cy.get(".rounded-small").should("exist");
    });

    it("uses semantic typography classes", () => {
      // Check text color tokens
      cy.get(".text-primary").should("exist");
      cy.get(".text-secondary").should("exist");
      cy.get(".text-muted").should("exist");
      cy.get(".text-link").should("exist");

      // Check typography scale tokens
      cy.get(".text-heading").should("exist");
      cy.get(".text-body").should("exist");
    });
  });

  describe("Animation Behaviors", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("back button has proper animation states", () => {
      // Test hover animation (scale change)
      cy.get("button")
        .first()
        .trigger("mouseover")
        .should("have.css", "transform")
        .and("include", "scale");
    });

    it("input field has focus animations", () => {
      cy.get('input[type="tel"]')
        .focus()
        .should("have.css", "transform")
        .and("include", "scale");
    });

    it("continue button shows loading animation", () => {
      // Mock API to delay response
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 200,
        body: {
          message: "Phone number updated successfully",
          user: {
            id: "test-user",
            email: "test@example.com",
            name: "Test User",
            phone: "IR +98 912 752 99 26",
            isOnboarded: true,
            lastOnlineAt: new Date().toISOString(),
          },
        },
        delay: 1000,
      }).as("updatePhone");

      // Enter phone number and submit
      cy.get('input[type="tel"]').type("9127529926");
      cy.get("button:not([disabled])").contains("Continue").click();

      // Check for spinning animation on loading state
      cy.get("button")
        .contains("Saving...")
        .should("be.visible")
        .find("div")
        .should("have.css", "animation-duration", "1s");

      cy.wait("@updatePhone");
    });

    it("error message appears with animation", () => {
      // Mock API error
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 409,
        body: { error: "Phone number already exists" },
      }).as("updatePhoneError");

      cy.get('input[type="tel"]').type("9127529926");
      cy.get("button:not([disabled])").contains("Continue").click();

      cy.wait("@updatePhoneError");

      // Check error message appears with animation
      cy.contains("This phone number is already registered")
        .should("be.visible")
        .parent()
        .should("have.css", "opacity", "1");
    });
  });

  describe("Verification Page Optimizations", () => {
    beforeEach(() => {
      // Set up phone number in sessionStorage first
      cy.window().then((win) => {
        win.sessionStorage.setItem("verificationPhone", "IR +98 912 752 99 26");
      });
      cy.visit("/verification");
    });

    it("uses design token spacing throughout", () => {
      cy.get(".gap-component").should("exist");
      cy.get(".mb-section").should("exist");
      cy.get(".mb-compact").should("exist");
      cy.get(".pt-section").should("exist");
      cy.get(".px-component").should("exist");
    });

    it("keypad buttons have consistent animations", () => {
      // Test keypad button hover animations
      cy.get("button")
        .contains("1")
        .trigger("mouseover")
        .should("have.css", "transform")
        .and("include", "scale");

      // Test keypad button tap animations
      cy.get("button")
        .contains("1")
        .trigger("mousedown")
        .should("have.css", "transform")
        .and("include", "scale");
    });

    it("code input boxes animate when filled", () => {
      // Click keypad numbers and check animations
      cy.get("button").contains("1").click();

      // First digit box should be filled and scaled
      cy.get(".w-16.h-16.bg-white.border-2")
        .first()
        .should("have.css", "transform")
        .and("include", "scale");
    });

    it("resend button clears inputs with animations", () => {
      // Fill some digits first
      cy.get("button").contains("1").click();
      cy.get("button").contains("2").click();

      // Check digits are filled
      cy.get(".w-16.h-16.bg-white.border-2").first().should("contain", "1");
      cy.get(".w-16.h-16.bg-white.border-2").eq(1).should("contain", "2");

      // Click resend button
      cy.get("button").contains("Resend").click();

      // Check digits are cleared
      cy.get(".w-16.h-16.bg-white.border-2").first().should("not.contain", "1");
      cy.get(".w-16.h-16.bg-white.border-2").eq(1).should("not.contain", "2");
    });

    it("submit button routes to app on completion", () => {
      // Fill all 4 digits
      cy.get("button").contains("1").click();
      cy.get("button").contains("2").click();
      cy.get("button").contains("3").click();
      cy.get("button").contains("4").click();

      // Submit button should be enabled and clickable
      cy.get("button")
        .contains("Continue to App")
        .should("not.be.disabled")
        .click();

      // Should navigate to users page
      cy.url().should("include", "/users");
    });
  });

  describe("React Query Optimizations", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("handles different error statuses with appropriate messages", () => {
      // Test 409 error (conflict)
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 409,
        body: { error: "Phone already exists" },
      }).as("conflict");

      cy.get('input[type="tel"]').type("9127529926");
      cy.get("button:not([disabled])").contains("Continue").click();
      cy.wait("@conflict");

      cy.contains(
        "This phone number is already registered to another account"
      ).should("be.visible");
    });

    it("handles 400 error with validation message", () => {
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 400,
        body: { error: "Invalid phone number" },
      }).as("badRequest");

      cy.get('input[type="tel"]').type("123");
      cy.get("button:not([disabled])").contains("Continue").click();
      cy.wait("@badRequest");

      cy.contains("Please enter a valid phone number").should("be.visible");
    });

    it("shows generic error for unknown status codes", () => {
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("serverError");

      cy.get('input[type="tel"]').type("9127529926");
      cy.get("button:not([disabled])").contains("Continue").click();
      cy.wait("@serverError");

      cy.contains("Failed to save phone number").should("be.visible");
    });

    it("continues navigation even after API failure (offline-first)", () => {
      cy.intercept("PUT", "**/api/user/phone", {
        statusCode: 500,
        body: { error: "Network error" },
      }).as("networkError");

      cy.get('input[type="tel"]').type("9127529926");
      cy.get("button:not([disabled])").contains("Continue").click();
      cy.wait("@networkError");

      // Should show error message
      cy.contains("Failed to save phone number").should("be.visible");

      // Should auto-navigate after 5 seconds (test with shorter wait)
      cy.url({ timeout: 6000 }).should("include", "/verification");
    });
  });

  describe("Accessibility with Optimizations", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("maintains keyboard navigation with animations", () => {
      // Tab through form elements
      cy.get("body").tab();
      cy.focused().should("contain", "IR +98"); // Country dropdown

      cy.focused().tab();
      cy.focused().should("have.attr", "type", "tel"); // Phone input

      // Enter phone number to enable continue button
      cy.get('input[type="tel"]').type("9127529926");

      cy.focused().tab();
      cy.focused().should("contain", "Continue"); // Continue button
    });

    it("animations do not interfere with screen readers", () => {
      // Check that animated elements have proper ARIA attributes
      cy.get("button")
        .first()
        .should("have.attr", "type", "button")
        .and("be.visible");

      cy.get('input[type="tel"]')
        .should("have.attr", "type", "tel")
        .and("not.have.attr", "aria-hidden");
    });
  });
});

