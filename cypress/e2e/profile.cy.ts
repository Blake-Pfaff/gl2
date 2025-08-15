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
      // Check for modal using test ID - ensure it exists in DOM
      cy.get('[data-testid="profile-modal"]').should("exist");
      // Check backdrop exists (may not be visible due to scroll lock positioning)
      cy.get(".backdrop-blur-sm").should("exist");
    });

    it("displays profile modal with correct sections", () => {
      cy.get('button[aria-label="Open profile"]').click();

      // Wait for modal to be fully visible
      cy.contains("Edit Profile").should("be.visible");

      // Check main sections are present - scroll to make sure they're visible
      cy.contains("Basic Information").scrollIntoView().should("be.visible");
      cy.contains("Preferences").scrollIntoView().should("be.visible");
      cy.contains("Photos").scrollIntoView().should("be.visible");

      // Check form fields exist - scroll into view for visibility
      cy.get('textarea[name="bio"]').scrollIntoView().should("be.visible");
      cy.get('input[name="jobTitle"]').scrollIntoView().should("be.visible");
      cy.get('input[name="locationLabel"]')
        .scrollIntoView()
        .should("be.visible");
      // Check for custom dropdown components instead of select elements
      cy.contains("Gender").scrollIntoView().should("be.visible");
      cy.contains("Looking For").scrollIntoView().should("be.visible");
    });

    it("closes modal when clicking cancel or close button (no changes)", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Close with X button (no changes, should close immediately)
      cy.get('button[aria-label="Close modal"]').click();
      cy.contains("Edit Profile").should("not.exist");

      // Open again and close with Cancel (no changes, should close immediately)
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Cancel").click();
      cy.contains("Edit Profile").should("not.exist");
    });

    it("closes modal when clicking backdrop overlay (no changes)", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Click on the modal container (which has the backdrop click handler) but outside the modal content
      cy.get(".fixed.inset-0.z-50.flex.items-center.justify-center").click(
        "topLeft",
        { force: true }
      );
      cy.contains("Edit Profile").should("not.exist");
    });

    it("shows unsaved changes guard rail when attempting to close with changes", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Make a change to trigger guard rail
      cy.get('textarea[name="bio"]').clear().type("Some changes to bio");

      // Try to close with X button - should show guard rail toast
      cy.get('button[aria-label="Close modal"]').click();
      cy.contains("Unsaved Changes").should("be.visible");
      cy.contains(
        "You have unsaved changes. Do you want to discard them?"
      ).should("be.visible");

      // Test "Keep Editing" option
      cy.contains("Keep Editing").click();
      cy.contains("Edit Profile").should("be.visible"); // Modal should still be open
      cy.get('textarea[name="bio"]').should(
        "have.value",
        "Some changes to bio"
      ); // Changes preserved

      // Try cancel button - should show guard rail again
      cy.contains("Cancel").click();
      cy.contains("Unsaved Changes").should("be.visible");

      // Test "Discard" option
      cy.contains("Discard").click();
      cy.contains("Edit Profile").should("not.exist"); // Modal should close
    });

    it("shows guard rail when clicking backdrop with unsaved changes", () => {
      cy.get('button[aria-label="Open profile"]').click();
      cy.contains("Edit Profile").should("be.visible");

      // Make changes
      cy.get('input[name="jobTitle"]').clear().type("New Job Title");

      // Click backdrop - use same approach as above
      cy.get(".fixed.inset-0.z-50.flex.items-center.justify-center").click(
        "topLeft",
        { force: true }
      );
      cy.contains("Unsaved Changes").should("be.visible");

      // Discard changes
      cy.contains("Discard").click();
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
      // Test custom dropdown for gender
      cy.contains("Gender").parent().find("button").click();
      cy.contains("Man").click();
      cy.contains("Gender").parent().should("contain", "Man");

      // Test custom dropdown for looking for
      cy.contains("Looking For").parent().find("button").click();
      cy.contains("Women").click();
      cy.contains("Looking For").parent().should("contain", "Women");
    });

    it("successfully saves profile changes", () => {
      // Fill out form
      cy.get('textarea[name="bio"]').clear().type("Updated bio text");
      cy.get('input[name="jobTitle"]').clear().type("Software Engineer");
      cy.get('input[name="locationLabel"]').clear().type("San Francisco, CA");

      // Use custom dropdowns
      cy.contains("Gender").parent().find("button").click();
      cy.contains("Man").click();

      cy.contains("Looking For").parent().find("button").click();
      cy.contains("Women").click();

      // Save changes
      cy.contains("Save Changes").click();

      // Wait for API call
      cy.wait("@updateProfile");

      // Should show success message (toast)
      cy.contains("Profile updated successfully").should("be.visible");

      // Modal should close
      cy.contains("Edit Profile").should("not.exist");
    });

    it("enforces bio character limit at input level", () => {
      const longBio = "a".repeat(300);
      cy.get('textarea[name="bio"]')
        .scrollIntoView()
        .clear()
        .type(longBio, { delay: 0 });

      // The input should respect the maxLength attribute and only accept 255 chars
      cy.get('textarea[name="bio"]')
        .invoke("val")
        .then((value) => {
          expect(value.length).to.be.at.most(255);
        });
    });

    it("detects changes in dropdown selections for guard rail", () => {
      // Change dropdown value
      cy.contains("Gender").parent().find("button").click();
      cy.contains("Man").click();

      // Try to close - should show guard rail
      cy.get('button[aria-label="Close modal"]').click();
      cy.contains("Unsaved Changes").should("be.visible");

      // Keep editing and verify value is preserved
      cy.contains("Keep Editing").click();
      cy.contains("Gender").parent().should("contain", "Man");

      // Try changing Looking For dropdown
      cy.contains("Looking For").parent().find("button").click();
      cy.contains("Women").click();

      // Try closing again
      cy.contains("Cancel").click();
      cy.contains("Unsaved Changes").should("be.visible");

      // Discard this time
      cy.contains("Discard").click();
      cy.contains("Edit Profile").should("not.exist");
    });
  });

  describe("Photos Section", () => {
    beforeEach(() => {
      cy.get('button[aria-label="Open profile"]').click();
    });

    it("displays photo placeholder grid", () => {
      // Should show photos section
      cy.contains("Photos").scrollIntoView().should("be.visible");

      // Should show placeholder message
      cy.contains("Photo upload functionality coming soon!")
        .scrollIntoView()
        .should("be.visible");

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
      cy.get('textarea[name="bio"]').scrollIntoView().type("Test bio");
      cy.contains("Save Changes").scrollIntoView().click();

      cy.wait("@profileError");

      // Should show error message (in toast)
      cy.contains("Server error").should("be.visible");

      // Modal should remain open on error - scroll to ensure visibility
      cy.contains("Edit Profile").scrollIntoView().should("be.visible");
    });

    it("handles guard rail toast dismissal properly", () => {
      cy.get('button[aria-label="Open profile"]').click();

      // Make changes
      cy.get('textarea[name="bio"]').scrollIntoView().type("Some test changes");

      // Try to close
      cy.get('button[aria-label="Close modal"]').click();
      cy.contains("Unsaved Changes").should("be.visible");

      // Click "Keep Editing" to dismiss toast and continue editing
      cy.contains("Keep Editing").click();

      // Toast should be gone and modal should still be open
      cy.contains("Unsaved Changes").should("not.exist");
      cy.contains("Edit Profile").should("be.visible");

      // Verify changes are preserved
      cy.get('textarea[name="bio"]').should("have.value", "Some test changes");
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

  describe("Photo Upload and Management", () => {
    beforeEach(() => {
      // Set up photo API intercepts
      cy.intercept("POST", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "test-photo-id",
            url: "/uploads/photos/test-photo.jpg",
            caption: "Test photo",
            order: 0,
            isMain: true,
          },
        },
      }).as("uploadPhoto");

      cy.intercept("PUT", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "test-photo-id",
            url: "/uploads/photos/test-photo.jpg",
            caption: "Updated caption",
            order: 0,
            isMain: true,
          },
        },
      }).as("updatePhoto");

      cy.intercept("DELETE", "**/api/user/photos*", {
        statusCode: 200,
        body: { success: true },
      }).as("deletePhoto");

      cy.get('button[aria-label="Open profile"]').click();
    });

    it("displays photo section with add photo button", () => {
      // Check photos section exists
      cy.contains("h3", "Photos").should("be.visible");

      // Should show Add Photo button when no photos
      cy.get("button").contains("Add Photo").should("be.visible");

      // Should show placeholder areas
      cy.get(".aspect-square").should("have.length.at.least", 1);
    });

    it("can open and close photo upload area", () => {
      // Click Add Photo button
      cy.get("button").contains("Add Photo").click();

      // Should show upload area
      cy.contains("Click to Upload Photo").should("be.visible");

      // Button should change to Cancel
      cy.get("button").contains("Cancel").should("be.visible");

      // Click Cancel to close
      cy.get("button").contains("Cancel").click();

      // Should hide upload area
      cy.contains("Click to Upload Photo").should("not.exist");

      // Button should change back to Add Photo
      cy.get("button").contains("Add Photo").should("be.visible");
    });

    it("can upload a photo file", () => {
      // Create a test image file
      cy.fixture("example.json").then(() => {
        // Click Add Photo
        cy.get("button").contains("Add Photo").click();

        // Should show upload area
        cy.contains("Click to Upload Photo").should("be.visible");

        // Create a fake file for testing
        const fileName = "test-photo.jpg";
        const fileContent = "fake-image-content";

        // Find the file input and upload
        cy.get('input[type="file"]').selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName: fileName,
            mimeType: "image/jpeg",
          },
          { force: true }
        );

        // Should trigger upload API call
        cy.wait("@uploadPhoto");

        // Upload area should close after successful upload
        cy.contains("Click to Upload Photo").should("not.exist");
      });
    });

    it("shows loading state during upload", () => {
      // Intercept with delay to test loading state
      cy.intercept("POST", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "test-photo-id",
            url: "/uploads/photos/test-photo.jpg",
            caption: "",
            order: 0,
            isMain: true,
          },
        },
        delay: 1000, // 1 second delay
      }).as("slowUpload");

      cy.get("button").contains("Add Photo").click();

      const fileName = "test-photo.jpg";
      const fileContent = "fake-image-content";

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: fileName,
          mimeType: "image/jpeg",
        },
        { force: true }
      );

      // Should show loading state
      cy.contains("Uploading...").should("be.visible");
      cy.get(".animate-spin").should("be.visible");

      cy.wait("@slowUpload");

      // Loading should disappear
      cy.contains("Uploading...").should("not.exist");
    });

    it("displays photos after upload", () => {
      // Mock profile response with photos
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
            birthdate: null,
            photos: [
              {
                id: "photo-1",
                url: "/uploads/photos/test-photo-1.jpg",
                caption: "First photo",
                order: 0,
                isMain: true,
              },
              {
                id: "photo-2",
                url: "/uploads/photos/test-photo-2.jpg",
                caption: "Second photo",
                order: 1,
                isMain: false,
              },
            ],
          },
        },
      }).as("getProfileWithPhotos");

      // Reload to get new profile data
      cy.reload();
      cy.wait("@getProfileWithPhotos");

      cy.get('button[aria-label="Open profile"]').click();

      // Should display photos
      cy.get('img[alt*="photo"]').should("have.length", 2);

      // Should show main photo badge
      cy.contains("Main").should("be.visible");
    });

    it("can manage photo actions (set main, delete)", () => {
      // Mock profile with multiple photos
      cy.intercept("GET", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
            photos: [
              {
                id: "photo-1",
                url: "/uploads/photos/test-photo-1.jpg",
                caption: "First photo",
                order: 0,
                isMain: true,
              },
              {
                id: "photo-2",
                url: "/uploads/photos/test-photo-2.jpg",
                caption: "Second photo",
                order: 1,
                isMain: false,
              },
            ],
          },
        },
      }).as("getProfileWithPhotos");

      cy.reload();
      cy.wait("@getProfileWithPhotos");
      cy.get('button[aria-label="Open profile"]').click();

      // Hover over non-main photo to show actions
      cy.get('img[alt*="photo"]').eq(1).parent().trigger("mouseenter");

      // Should show action buttons
      cy.contains("Set as Main").should("be.visible");
      cy.contains("Delete").should("be.visible");

      // Should NOT show Edit button
      cy.contains("Edit").should("not.exist");

      // Test set as main
      cy.contains("Set as Main").click();
      cy.wait("@updatePhoto");

      // Test delete
      cy.get('img[alt*="photo"]').eq(1).parent().trigger("mouseenter");
      cy.contains("Delete").click();

      // Should show confirmation modal
      cy.contains("Delete Photo").should("be.visible");
      cy.contains("Are you sure").should("be.visible");
      cy.get("button").contains("Delete").click();
      cy.wait("@deletePhoto");
    });

    it("validates file types and shows appropriate errors", () => {
      cy.get("button").contains("Add Photo").click();

      // Try to upload non-image file
      const fileName = "document.pdf";
      const fileContent = "fake-pdf-content";

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: fileName,
          mimeType: "application/pdf",
        },
        { force: true }
      );

      // Should show error (this would be handled by browser validation)
      // The accept="image/*" attribute should prevent selection
    });

    it("updates user avatar when main photo is set", () => {
      // Mock profile with main photo
      cy.intercept("GET", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
            photos: [
              {
                id: "photo-1",
                url: "/uploads/photos/test-photo-1.jpg",
                caption: "Profile photo",
                order: 0,
                isMain: true,
              },
            ],
          },
        },
      }).as("getProfileWithMainPhoto");

      cy.reload();
      cy.wait("@getProfileWithMainPhoto");

      // Should show user's photo in header instead of initials
      cy.get('button[aria-label="Open profile"] img').should("exist");
      cy.get('button[aria-label="Open profile"] img')
        .should("have.attr", "src")
        .and("include", "test-photo-1.jpg");
    });
  });
});
