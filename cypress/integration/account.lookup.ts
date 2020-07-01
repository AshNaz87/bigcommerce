import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.jersey;

describe("Account page", () => {
  describe("Postcode Lookup", () => {
    before(() => {
      cy.visit("./fixtures/account.php/index.html", {
        onBeforeLoad: (window) => {
          // @ts-ignore
          window.idpcConfig = {
            apiKey: Cypress.env("API_KEY"),
            populateOrganisation: true,
            populateCounty: true,
            autocomplete: false,
            postcodeLookup: true,
            postcodeLookupOverride: {
              check_key: false,
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

    it("applies postcode lookup to address form", () => {
      cy.wait(5000);
      cy.get(".postcode-lookup").within(() => {
        cy.get("input[type=text]").type(address.postcode);
        cy.get("input[type=submit]").click({force:true});
        cy.get("select").select("0");
      });
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
