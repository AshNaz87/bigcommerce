import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.jersey;

describe("Account page", () => {
  describe("autocomplete", () => {
    before(() => {
      cy.visit("./fixtures/account.php/index.html", {
        onBeforeLoad: (window) => {
          // @ts-ignore
          window.idpcConfig = {
            apiKey: Cypress.env("API_KEY"),
            populateOrganisation: true,
            populateCounty: true,
            autocomplete: true,
            postcodeLookup: false,
            autocompleteOverride: {
              checkKey: false,
            },
          };
        },
        onLoad: (window) => {
          const document = window.document;
          const script = document.createElement("script");
          script.setAttribute("type", "text/javascript");
          script.setAttribute(
            "src",
            "http://localhost:60154/dist/bigcommerce.min.js"
          );
          document.head.appendChild(script);
        },
      });
    });

    it("applies address autocomplete to line 1", () => {
      cy.wait(5000);
      cy.get("#FormField_8_input").clear().type(address.line_1);
      cy.wait(3000);
      cy.get(".idpc_ul li").first().click({force:true});
      cy.get("#FormField_8_input").should("have.value", address.line_1);
      cy.get("#FormField_9_input").should(
        "have.value",
        `${address.line_2}, ${address.line_3}`
      );
      cy.get("#FormField_6_input").should(
        "have.value",
        address.organisation_name
      );
      cy.get("#FormField_10_input").should("have.value", address.post_town);
      cy.get("#FormField_11_select").should("have.value", "Jersey");
      cy.get("#FormField_13_input").should("have.value", address.postcode);
      cy.get("#FormField_12_input").should("have.value", address.county);
    });
  });
});
