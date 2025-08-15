/// <reference types="cypress" />

describe("Photo Upload Feature Tests", () => {
  beforeEach(() => {
    // Clear state and login
    cy.clearCookies();
    cy.clearLocalStorage();

    // Mock authentication session
    cy.intercept("GET", "**/api/auth/session", {
      statusCode: 200,
      body: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@test.com",
          isFirstLogin: false,
          isOnboarded: true,
        },
      },
    }).as("getSession");

    // Mock profile API - starts with no photos
    cy.intercept("GET", "**/api/user/profile", {
      statusCode: 200,
      body: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@test.com",
          username: "testuser",
          bio: "Test bio",
          jobTitle: "Developer",
          gender: "MAN",
          lookingFor: "WOMEN",
          locationLabel: "Test City",
          photos: [],
        },
      },
    }).as("getProfile");

    // Visit home page (will redirect if not authenticated)
    cy.visit("/");
    cy.wait("@getSession");
    cy.wait("@getProfile");
  });

  describe("Upload Flow", () => {
    it("completes full photo upload workflow", () => {
      // Mock successful upload
      cy.intercept("POST", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "new-photo-id",
            url: "/uploads/photos/test_1234567890.jpg",
            caption: null,
            order: 0,
            isMain: true,
          },
        },
      }).as("uploadPhoto");

      // Mock updated profile with new photo
      cy.intercept("GET", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@test.com",
            photos: [
              {
                id: "new-photo-id",
                url: "/uploads/photos/test_1234567890.jpg",
                caption: null,
                order: 0,
                isMain: true,
              },
            ],
          },
        },
      }).as("getUpdatedProfile");

      // Open profile modal
      cy.get('button[aria-label="Open profile"]').click();

      // Verify initial state
      cy.contains("h3", "Photos").should("be.visible");
      cy.get("button").contains("Add Photo").should("be.visible");

      // Click Add Photo
      cy.get("button").contains("Add Photo").click();

      // Verify upload area appears
      cy.contains("Click to Upload Photo").should("be.visible");
      cy.contains("JPEG, PNG up to 5MB").should("be.visible");

      // Upload a file
      const fileName = "test-photo.jpg";
      const fileContent = "fake-image-data";

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: fileName,
          mimeType: "image/jpeg",
        },
        { force: true }
      );

      // Verify upload API was called
      cy.wait("@uploadPhoto").then((interception) => {
        // Verify the request contains the file
        expect(interception.request.body).to.be.instanceOf(FormData);
      });

      // Upload area should close
      cy.contains("Click to Upload Photo").should("not.exist");

      // Should show success toast
      cy.contains("Photo uploaded successfully").should("be.visible");
    });

    it("handles upload errors gracefully", () => {
      // Mock upload failure
      cy.intercept("POST", "**/api/user/photos", {
        statusCode: 400,
        body: { error: "File too large" },
      }).as("uploadPhotoError");

      cy.get('button[aria-label="Open profile"]').click();
      cy.get("button").contains("Add Photo").click();

      const fileName = "large-photo.jpg";
      const fileContent = "fake-large-image-data";

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: fileName,
          mimeType: "image/jpeg",
        },
        { force: true }
      );

      cy.wait("@uploadPhotoError");

      // Should show error toast
      cy.contains("File too large").should("be.visible");

      // Upload area should remain open for retry
      cy.contains("Click to Upload Photo").should("be.visible");
    });

    it("shows loading state during upload", () => {
      // Mock slow upload
      cy.intercept("POST", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "new-photo-id",
            url: "/uploads/photos/test_1234567890.jpg",
            caption: null,
            order: 0,
            isMain: true,
          },
        },
        delay: 2000, // 2 second delay
      }).as("slowUpload");

      cy.get('button[aria-label="Open profile"]').click();
      cy.get("button").contains("Add Photo").click();

      const fileName = "test-photo.jpg";
      const fileContent = "fake-image-data";

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: fileName,
          mimeType: "image/jpeg",
        },
        { force: true }
      );

      // Should immediately show loading state
      cy.contains("Uploading...").should("be.visible");
      cy.get(".animate-spin").should("be.visible");

      // Wait for upload to complete
      cy.wait("@slowUpload");

      // Loading should disappear
      cy.contains("Uploading...").should("not.exist");
      cy.get(".animate-spin").should("not.exist");
    });
  });

  describe("Photo Management", () => {
    beforeEach(() => {
      // Mock profile with existing photos
      cy.intercept("GET", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@test.com",
            photos: [
              {
                id: "photo-1",
                url: "/uploads/photos/photo1.jpg",
                caption: "First photo",
                order: 0,
                isMain: true,
              },
              {
                id: "photo-2",
                url: "/uploads/photos/photo2.jpg",
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
    });

    it("displays existing photos correctly", () => {
      cy.get('button[aria-label="Open profile"]').click();

      // Should show photos
      cy.get('img[alt*="photo"]').should("have.length", 2);

      // Should show main photo badge
      cy.contains("Main").should("be.visible");

      // Should show photo count
      cy.contains("You have 2 of 6 photos").should("be.visible");
      cy.contains("Your main photo is highlighted").should("be.visible");
    });

    it("can set a different photo as main", () => {
      cy.intercept("PUT", "**/api/user/photos", {
        statusCode: 200,
        body: {
          photo: {
            id: "photo-2",
            url: "/uploads/photos/photo2.jpg",
            caption: "Second photo",
            order: 1,
            isMain: true,
          },
        },
      }).as("updateMainPhoto");

      cy.get('button[aria-label="Open profile"]').click();

      // Hover over non-main photo
      cy.get('img[alt*="photo"]').eq(1).parent().trigger("mouseenter");

      // Click "Set as Main"
      cy.contains("Set as Main").click();

      cy.wait("@updateMainPhoto");

      // Should show success message
      cy.contains("Main photo updated").should("be.visible");
    });

    it("can delete photos", () => {
      cy.intercept("DELETE", "**/api/user/photos*", {
        statusCode: 200,
        body: { success: true },
      }).as("deletePhoto");

      cy.get('button[aria-label="Open profile"]').click();

      // Hover over photo and click delete
      cy.get('img[alt*="photo"]').eq(1).parent().trigger("mouseenter");
      cy.contains("Delete").click();

      // Should show confirmation modal
      cy.contains("Delete Photo").should("be.visible");
      cy.contains("This action cannot be undone").should("be.visible");

      // Confirm deletion
      cy.get("button").contains("Delete").click();

      cy.wait("@deletePhoto");

      // Should show success message
      cy.contains("Photo deleted successfully").should("be.visible");
    });
  });

  describe("Avatar Integration", () => {
    it("updates header avatar when user has main photo", () => {
      // Mock profile with main photo
      cy.intercept("GET", "**/api/user/profile", {
        statusCode: 200,
        body: {
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@test.com",
            photos: [
              {
                id: "photo-1",
                url: "/uploads/photos/avatar.jpg",
                caption: "My avatar",
                order: 0,
                isMain: true,
              },
            ],
          },
        },
      }).as("getProfileWithAvatar");

      cy.reload();
      cy.wait("@getProfileWithAvatar");

      // Header should show photo instead of initials
      cy.get('button[aria-label="Open profile"]').within(() => {
        cy.get("img").should("exist");
        cy.get("img").should("have.attr", "src").and("include", "avatar.jpg");
        // Should not show initials
        cy.contains("T").should("not.exist");
      });
    });

    it("shows initials when user has no photos", () => {
      // Profile already mocked with no photos in beforeEach

      // Header should show initials
      cy.get('button[aria-label="Open profile"]').within(() => {
        cy.get("img").should("not.exist");
        cy.contains("T").should("be.visible"); // First letter of "Test User"
      });
    });
  });
});
