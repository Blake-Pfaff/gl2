/// <reference types="cypress" />

describe("Profile Management Tests", () => {
  beforeEach(() => {
    // Clear state and login
    cy.clearCookies();
    cy.clearLocalStorage();

    // Set up API intercepts
    cy.intercept("GET", "**/api/user/profile", {
      statusCode: 200,
      body: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
          bio: "",
          jobTitle: "",
          gender: "",
          lookingFor: "",
          locationLabel: "",
          photos: [],
        },
      },
    }).as("getProfile");

    // Login with test user
    cy.visit("/login");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Wait for login and navigation
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });

  describe("Profile Modal Access", () => {
    it("opens profile modal when clicking user avatar", () => {
      // Click on the user avatar/info in header
      cy.get('button[aria-label="Open profile"]').click();

      // Modal should be visible
      cy.contains("Edit Profile").should("be.visible");
      // Check for modal using test ID and backdrop styling
      cy.get('[data-testid="profile-modal"]').should("be.visible");
      cy.get(".backdrop-blur-sm").should("be.visible");
    });

    it("displays profile modal with correct sections", () => {
      cy.get('button[aria-label="Open profile"]').click();

      // Wait for modal to be fully visible
      cy.contains("Edit Profile").should("be.visible");

      // Check main sections are present - scroll to make sure they're visible
      cy.contains("Basic Information").scrollIntoView().should("be.visible");
      cy.contains("Preferences").scrollIntoView().should("be.visible");
      cy.contains("Photos").scrollIntoView().should("be.visible");

      // Check form fields exist
      cy.get('textarea[name="bio"]').should("be.visible");
      cy.get('input[name="jobTitle"]').should("be.visible");
      cy.get('input[name="locationLabel"]').should("be.visible");
      cy.get('select[name="gender"]').should("be.visible");
      cy.get('select[name="lookingFor"]').should("be.visible");
    });

    it("closes modal when clicking cancel or close button", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Close with X button
      cy.get('button[aria-label="Close modal"]').click();
      cy.contains("Edit Profile").should("not.exist");

      // Open again and close with Cancel
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Cancel").click();
      cy.contains("Edit Profile").should("not.exist");
    });

    it("closes modal when clicking backdrop overlay", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Click outside the modal content (on the backdrop)
      cy.get("body").click(0, 0); // Click at top-left corner which should be backdrop
      cy.contains("Edit Profile").should("not.exist");
    });
  });

  describe("Profile Form Functionality", () => {
    beforeEach(() => {
      // Mock the PUT API call for updates
      cy.intercept("PUT", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
            bio: "Updated bio text",
            jobTitle: "Software Engineer",
            gender: "MAN",
            lookingFor: "WOMEN",
            locationLabel: "San Francisco, CA",
            photos: [],
          },
        },
      }).as("updateProfile");

      cy.get('button[aria-label="Open profile"]').click();
      // Wait a moment for the modal to open
      cy.contains("Edit Profile").should("be.visible");
    });

    it("allows updating bio with character limit", () => {
      const testBio = "This is my updated bio for testing purposes.";

      cy.get('textarea[name="bio"]').clear().type(testBio);
      cy.get('textarea[name="bio"]').should("have.value", testBio);

      // Test character limit (255 chars) - HTML maxLength should enforce this
      const longBio = "a".repeat(300);
      cy.get('textarea[name="bio"]').clear().type(longBio);
      // The input should respect the maxLength attribute and only accept 255 chars
      cy.get('textarea[name="bio"]')
        .invoke("val")
        .then((value) => {
          expect(value.length).to.be.at.most(255);
        });
    });

    it("allows updating job title and location", () => {
      cy.get('input[name="jobTitle"]').clear().type("Software Engineer");
      cy.get('input[name="locationLabel"]').clear().type("San Francisco, CA");

      cy.get('input[name="jobTitle"]').should(
        "have.value",
        "Software Engineer"
      );
      cy.get('input[name="locationLabel"]').should(
        "have.value",
        "San Francisco, CA"
      );
    });

    it("allows selecting gender and preferences", () => {
      // Select gender
      cy.get('select[name="gender"]').select("MAN");
      cy.get('select[name="gender"]').should("have.value", "MAN");

      // Select looking for preference
      cy.get('select[name="lookingFor"]').select("WOMEN");
      cy.get('select[name="lookingFor"]').should("have.value", "WOMEN");
    });

    it("successfully saves profile changes", () => {
      // Fill out form
      cy.get('textarea[name="bio"]').clear().type("Updated bio text");
      cy.get('input[name="jobTitle"]').clear().type("Software Engineer");
      cy.get('input[name="locationLabel"]').clear().type("San Francisco, CA");
      cy.get('select[name="gender"]').select("MAN");
      cy.get('select[name="lookingFor"]').select("WOMEN");

      // Save changes
      cy.contains("Save Changes").click();

      // Wait for API call
      cy.wait("@updateProfile");

      // Should show success message (toast)
      cy.contains("Profile updated successfully").should("be.visible");

      // Modal should close
      cy.contains("Edit Profile").should("not.exist");
    });

    it("shows validation error for bio over 255 characters", () => {
      const longBio = "a".repeat(256);
      cy.get('textarea[name="bio"]').clear().type(longBio, { delay: 0 });

      cy.contains("Save Changes").click();

      // Should show validation error
      cy.contains("Bio must be 255 characters or less").should("be.visible");
    });
  });

  describe("Photos Section", () => {
    beforeEach(() => {
      cy.get('button[aria-label="Open profile"]').click();
    });

    it("displays photo placeholder grid", () => {
      // Should show photos section
      cy.contains("Photos").should("be.visible");

      // Should show placeholder message
      cy.contains("Photo upload functionality coming soon!").should(
        "be.visible"
      );

      // Should show photo placeholders (6 total when no existing photos)
      cy.get('[class*="aspect-square"]').should("have.length.at.least", 1);
    });
  });

  describe("Error Handling", () => {
    it("handles API errors gracefully", () => {
      // Mock API failure
      cy.intercept("PUT", "**/api/user/profile", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("profileError");

      cy.get('button[aria-label="Open profile"]').click();
      cy.get('textarea[name="bio"]').type("Test bio");
      cy.contains("Save Changes").click();

      cy.wait("@profileError");

      // Should show error message
      cy.contains("Server error").should("be.visible");
    });
  });

  describe("Design System Compliance", () => {
    beforeEach(() => {
      cy.get('button[aria-label="Open profile"]').click();
    });

    it("uses proper design tokens and styling", () => {
      // Check for design token classes
      cy.get(".text-primary").should("exist");
      cy.get(".text-secondary").should("exist");
      cy.get(".rounded-input").should("exist");
      cy.get(".rounded-button").should("exist");

      // Check modal structure
      cy.get(".bg-white").should("exist");
      cy.get(".shadow-lg").should("exist");
    });

    it("displays proper form field styling", () => {
      // Check FormField components have correct styling
      cy.get('textarea[name="bio"]').should("have.class", "border-2");
      cy.get('input[name="jobTitle"]').should("have.class", "border-2");

      // Check for icon in job title field
      cy.get('input[name="jobTitle"]').parent().find("svg").should("exist");
    });
  });
});
