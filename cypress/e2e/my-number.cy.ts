/// <reference types="cypress" />

// Import app constants for consistent testing
import { APP_NAME } from "../../src/lib/constants";

describe("My Number Page", () => {
  beforeEach(() => {
    // Handle any uncaught exceptions that might occur
    cy.on("uncaught:exception", (err, runnable) => {
      // Don't fail the test on non-critical errors
      if (err.message.includes("Invalid or unexpected token")) {
        return false;
      }
      return true;
    });
  });

  describe("Direct navigation", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("renders the my-number page with all required elements", () => {
      // Check page title and header
      cy.contains("My number is").should("be.visible");

      // Check status bar mockup
      cy.contains("4:20 A.M").should("be.visible");

      // Check back button exists
      cy.get("button").first().should("be.visible");

      // Check form fields exist
      cy.get('button[type="button"]').contains("IR +98").should("be.visible");
      cy.get('input[type="tel"]').should("be.visible");

      // Check description text
      cy.contains("Enter you number here to get verfication").should(
        "be.visible"
      );
      cy.contains(APP_NAME).should("be.visible");

      // Check continue button exists but is disabled initially
      cy.get("button[disabled]").contains("Continue").should("be.visible");
    });

    it("displays country dropdown correctly", () => {
      // Check that the dropdown shows the default selected country
      cy.get('button[type="button"]').contains("IR +98").should("be.visible");

      // Check that the flag emoji is displayed
      cy.get('button[type="button"]').contains("🇮🇷").should("be.visible");

      // Check dropdown arrow exists
      cy.get("svg").should("be.visible");
    });

    it("allows country dropdown interaction", () => {
      // Click on the dropdown to open it
      cy.get('button[type="button"]').contains("IR +98").click();

      // Check that dropdown menu appears with options
      cy.contains("US +1").should("be.visible");
      cy.contains("UK +44").should("be.visible");
      cy.contains("CA +1").should("be.visible");

      // Select a different country
      cy.contains("US +1").click();

      // Verify the selection changed
      cy.get('button[type="button"]').contains("US +1").should("be.visible");
      cy.get('button[type="button"]').contains("🇺🇸").should("be.visible");
    });

    it("formats phone numbers correctly based on country", () => {
      // Test Iranian format (default)
      cy.get('input[type="tel"]').should(
        "have.attr",
        "placeholder",
        "912 752 99 26"
      );
      cy.get('input[type="tel"]').type("9127529926");
      cy.get('input[type="tel"]').should("have.value", "912 752 99 26");

      // Switch to US format
      cy.get('button[type="button"]').contains("IR +98").click();
      cy.contains("US +1").click();

      // Check placeholder changed to US format
      cy.get('input[type="tel"]').should(
        "have.attr",
        "placeholder",
        "(555) 123-4567"
      );

      // Clear and test US format
      cy.get('input[type="tel"]').clear().type("5551234567");
      cy.get('input[type="tel"]').should("have.value", "(555) 123-4567");

      // Switch to UK format
      cy.get('button[type="button"]').contains("US +1").click();
      cy.contains("UK +44").click();

      // Check placeholder changed to UK format
      cy.get('input[type="tel"]').should(
        "have.attr",
        "placeholder",
        "1234 567 8901"
      );

      // Clear and test UK format
      cy.get('input[type="tel"]').clear().type("12345678901");
      cy.get('input[type="tel"]').should("have.value", "1234 567 8901");
    });

    it("enables continue button when phone number is entered", () => {
      // Initially button should be disabled
      cy.get("button[disabled]").contains("Continue").should("exist");

      // Enter a phone number
      cy.get('input[type="tel"]').type("9127529926");

      // Button should now be enabled
      cy.get("button:not([disabled])").contains("Continue").should("exist");

      // Clear the input
      cy.get('input[type="tel"]').clear();

      // Button should be disabled again
      cy.get("button[disabled]").contains("Continue").should("exist");
    });

    it("navigates on continue button click", () => {
      // Mock the phone number API call
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
      }).as("updatePhone");

      // Enter a phone number
      cy.get('input[type="tel"]').type("9127529926");

      // Click continue button
      cy.get("button").contains("Continue").click();

      // Wait for the API call
      cy.wait("@updatePhone");

      // Should navigate to verification page
      cy.url().should("include", "/verification");
    });

    it("back button navigation works", () => {
      // Mock the router.back() functionality by visiting register first
      cy.visit("/register");
      cy.visit("/my-number");

      // Click the back button
      cy.get("button").first().click();

      // Should go back to register page
      cy.url().should("include", "/register");
    });
  });

  describe("Navigation from register page", () => {
    it("navigates to my-number page after successful registration", () => {
      // Start on register page
      cy.visit("/register");

      // Mock successful registration API call that redirects to my-number
      cy.intercept("POST", "**/api/auth/signup", {
        statusCode: 200,
        body: {
          success: true,
          preview: "http://localhost:3000/api/preview/welcome-email",
        },
      }).as("signupRequest");

      // Fill out the registration form
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="username"]').type("testuser");
      cy.get('input[name="password"]').type("password123");
      cy.get('input[name="confirmPassword"]').type("password123");
      cy.get('input[type="radio"][value="male"]').check();

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Wait for the API call
      cy.wait("@signupRequest");

      // Should redirect to my-number page after 1 second
      cy.url({ timeout: 2000 }).should("include", "/my-number");

      // Verify we're on the correct page
      cy.contains("My number is").should("be.visible");
    });
  });

  describe("Form validation and edge cases", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("handles maximum phone number length", () => {
      const phoneInput = cy.get('input[type="tel"]');

      // Type more than the maximum allowed characters
      phoneInput.type("12345678901234567890");

      // Should be limited to maxLength (15 characters including spaces)
      phoneInput.invoke("val").then((val) => {
        expect(val?.toString().length).to.be.at.most(15);
      });
    });

    it("handles special characters in phone input", () => {
      const phoneInput = cy.get('input[type="tel"]');

      // Type numbers with special characters
      phoneInput.type("(912) 752-9926");

      // Should format correctly, removing special characters
      phoneInput.should("have.value", "912 752 99 26");
    });

    it("dropdown can be opened and closed", () => {
      // Open the dropdown
      cy.get('button[type="button"]').contains("IR +98").click();

      // Verify dropdown is open
      cy.contains("US +1").should("be.visible");

      // Click the backdrop to close the dropdown
      cy.get(".fixed.inset-0.z-40").click();

      // Wait for animation to complete
      cy.wait(500);

      // Verify dropdown closes
      cy.contains("US +1").should("not.exist");
    });

    it("can select different countries", () => {
      // Select a different country
      cy.get('button[type="button"]').contains("IR +98").click();
      cy.contains("UK +44").click();

      // Verify the selection changed
      cy.get('button[type="button"]').contains("UK +44").should("be.visible");
      cy.get('button[type="button"]').contains("🇬🇧").should("be.visible");
    });
  });

  describe("Accessibility and user experience", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("has proper form labels", () => {
      // Check that form fields have proper labels
      cy.contains("Country").should("be.visible");
      cy.contains("Phone").should("be.visible");
    });

    it("shows proper visual feedback for form interactions", () => {
      // Test phone input focus state
      cy.get('input[type="tel"]').focus();
      cy.get('input[type="tel"]').should(
        "have.class",
        "focus:border-primary-400"
      );

      // Test dropdown hover state (if possible to test)
      cy.get('button[type="button"]').contains("IR +98").trigger("mouseover");
    });

    it("has focusable form elements", () => {
      // Test that form elements can be focused
      cy.get('input[type="tel"]').focus();
      cy.focused().should("have.attr", "type", "tel");

      // Enable the continue button first by entering a phone number
      cy.get('input[type="tel"]').type("9127529926");

      // Now the continue button should be focusable
      cy.get("button:not([disabled])").contains("Continue").focus();
      cy.focused().should("contain", "Continue");
    });
  });

  describe("Animation and visual feedback", () => {
    beforeEach(() => {
      cy.visit("/my-number");
    });

    it("shows loading state during form submission", () => {
      // Mock a slow API response to test loading state
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
        delay: 1000, // 1 second delay to test loading state
      }).as("slowUpdatePhone");

      // Enter phone number
      cy.get('input[type="tel"]').type("9127529926");

      // Verify button is enabled
      cy.get("button").contains("Continue").should("not.be.disabled");

      // Click continue button
      cy.get("button").contains("Continue").click();

      // Should show loading state
      cy.get("button").contains("Saving...").should("be.visible");
      cy.get("button").should("be.disabled");

      // Wait for API call to complete
      cy.wait("@slowUpdatePhone");

      // Should navigate to verification page
      cy.url().should("include", "/verification");
    });

    it("dropdown opens and closes with animations", () => {
      // Open dropdown
      cy.get('button[type="button"]').contains("IR +98").click();

      // Verify dropdown appears (animation should complete)
      cy.contains("US +1").should("be.visible");

      // Close dropdown by clicking the button again
      cy.get('button[type="button"]').contains("IR +98").click({ force: true });

      // Verify dropdown disappears
      cy.contains("US +1").should("not.exist");
    });
  });
});
