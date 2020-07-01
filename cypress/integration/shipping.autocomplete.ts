import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.england;

describe("Shipping", () => {
  describe("autocomplete", () => {
    before(() => {
      cy.visit("./fixtures/checkout/shipping.html", {
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
          document.body.appendChild(script);
        },
      });
    });

    it("applies autocomplete to the address form", () => {
      cy.get("#checkoutShippingAddress").within(() => {
        cy.wait(5000);
        cy.get("#addressLine1Input")
          .clear({ force: true })
          .type(address.line_1);
        cy.wait(3000);
        cy.get(".idpc_ul li").first().click({force:true});
        cy.get("#addressLine1Input").should("have.value", address.line_1);
        cy.get("#addressLine2Input").should("have.value", address.line_2);
        cy.get("#companyInput").should("have.value", address.organisation_name);
        cy.get("#cityInput").should("have.value", address.post_town);
        cy.get("#countryCodeInput").should("have.value", "GB");
        cy.get("#postCodeInput").should("have.value", address.postcode);
      });
    });
  });
});
