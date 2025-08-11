/// <reference types="cypress" />

describe("Register flow", () => {
  beforeEach(() => {
    // Start each test on the register page
    cy.visit("/register");

    // Handle any uncaught exceptions that might occur
    cy.on("uncaught:exception", (err, runnable) => {
      // Don't fail the test on syntax errors from console.log or other non-critical errors
      if (err.message.includes("Invalid or unexpected token")) {
        return false;
      }
      // Don't fail the test on API errors that we're testing (like "Email already exists")
      if (
        err.message.includes("Email already exists") ||
        err.message.includes("Registration failed")
      ) {
        return false;
      }
      return true;
    });
  });

  it("renders the registration form with all required fields", () => {
    // Check page title and header
    cy.get("h1").contains("Sign Up");

    // Check all form fields exist
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="confirmPassword"]').should("exist");

    // Check gender selection exists
    cy.get('input[type="radio"][value="male"]').should("exist");
    cy.get('input[type="radio"][value="female"]').should("exist");
    cy.get('input[type="radio"][value="none"]').should("exist");

    // Check submit button exists
    cy.get('button[type="submit"]').should("exist").contains("Next");
  });

  it("shows validation errors for empty required fields", () => {
    // Disable HTML5 validation to test our custom validation
    cy.get("form").invoke("attr", "novalidate", "novalidate");

    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Check all required field validation errors appear
    cy.contains("Username is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("Please confirm your password").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Please select a gender").should("be.visible");
  });

  it("validates password minimum length", () => {
    // Disable HTML5 validation to test our custom validation
    cy.get("form").invoke("attr", "novalidate", "novalidate");

    // Fill other required fields first
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[type="radio"][value="male"]').check();

    cy.get('input[name="password"]').type("123");
    cy.get('button[type="submit"]').click();

    cy.get("p.text-error")
      .contains("Password must be at least 6 characters")
      .should("be.visible");
  });

  it("validates password confirmation matches", () => {
    // Disable HTML5 validation to test our custom validation
    cy.get("form").invoke("attr", "novalidate", "novalidate");

    // Fill required fields first
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[type="radio"][value="male"]').check();

    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("differentpassword");
    cy.get('button[type="submit"]').click();

    cy.get("p.text-error")
      .contains("Passwords do not match")
      .should("be.visible");
  });

  it("validates email format", () => {
    // Disable HTML5 validation to test our custom validation
    cy.get("form").invoke("attr", "novalidate", "novalidate");

    // Fill in other required fields to ensure only email validation triggers
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[type="radio"][value="male"]').check();

    cy.get('button[type="submit"]').click();

    // Wait for validation and check for the error message
    cy.get("p.text-error")
      .contains("Invalid email address")
      .should("be.visible");
  });

  it("allows gender selection", () => {
    // Test selecting male
    cy.get('input[type="radio"][value="male"]').check();
    cy.get('input[type="radio"][value="male"]').should("be.checked");

    // Test selecting female
    cy.get('input[type="radio"][value="female"]').check();
    cy.get('input[type="radio"][value="female"]').should("be.checked");
    cy.get('input[type="radio"][value="male"]').should("not.be.checked");

    // Test selecting none
    cy.get('input[type="radio"][value="none"]').check();
    cy.get('input[type="radio"][value="none"]').should("be.checked");
    cy.get('input[type="radio"][value="female"]').should("not.be.checked");
  });

  it("successfully registers a new user and redirects to my-number", () => {
    // Mock successful registration API call
    cy.intercept("POST", "**/api/auth/signup", {
      statusCode: 200,
      body: {
        success: true,
        preview: "http://localhost:3000/api/preview/welcome-email",
      },
    }).as("signupRequest");

    // Fill out the form with valid data
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");
    cy.get('input[type="radio"][value="male"]').check();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API call
    cy.wait("@signupRequest");

    // Check that the preview URL is displayed
    cy.contains("Preview your welcome email:").should("be.visible");
    cy.get('a[href="http://localhost:3000/api/preview/welcome-email"]').should(
      "be.visible"
    );

    // Should redirect to my-number page after 1 second
    cy.url({ timeout: 2000 }).should("include", "/my-number");
  });

  it("handles server errors during registration", () => {
    // Mock failed registration API call
    cy.intercept("POST", "**/api/auth/signup", {
      statusCode: 400,
      body: {
        error: "Email already exists",
      },
    }).as("signupError");

    // Fill out the form with valid data
    cy.get('input[name="email"]').type("existing@example.com");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");
    cy.get('input[type="radio"][value="female"]').check();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API call
    cy.wait("@signupError");

    // Check that error message is displayed
    cy.get(".bg-red-50").should("be.visible");
    cy.contains("Email already exists").should("be.visible");
  });

  it("disables submit button while form is submitting", () => {
    // Mock slow API response
    cy.intercept("POST", "**/api/auth/signup", {
      statusCode: 200,
      body: { success: true },
      delay: 1000,
    }).as("slowSignup");

    // Fill out the form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");
    cy.get('input[type="radio"][value="none"]').check();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Button should be disabled and show loading text
    cy.get('button[type="submit"]').should("be.disabled");
    cy.contains("Creating account…").should("be.visible");

    cy.wait("@slowSignup");
  });

  it("has proper navigation from header back button", () => {
    // First navigate to register from login to establish navigation history
    cy.visit("/login");
    cy.get('a[href="/register"]').click();
    cy.url().should("include", "/register");

    // Now test the back button
    cy.get('button[type="button"]').first().click();

    // Should navigate back to login page
    cy.url().should("include", "/login");
  });

  it("validates complete form submission with all fields filled correctly", () => {
    // Mock successful registration
    cy.intercept("POST", "**/api/auth/signup", {
      statusCode: 200,
      body: { success: true },
    }).as("completeSignup");

    // Fill all fields correctly
    cy.get('input[name="email"]').type("valid.email@example.com");
    cy.get('input[name="username"]').type("validuser123");
    cy.get('input[name="password"]').type("securepassword123");
    cy.get('input[name="confirmPassword"]').type("securepassword123");
    cy.get('input[type="radio"][value="female"]').check();

    // All validation errors should be cleared
    cy.get(".text-error").should("not.exist");

    // Submit should work
    cy.get('button[type="submit"]').click();
    cy.wait("@completeSignup");
  });
});
