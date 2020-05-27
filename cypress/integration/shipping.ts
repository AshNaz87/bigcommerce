import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.england;

describe("Shipping", () => {
  before(() => {
    cy.visit("./checkout/shipping.html", {
      onBeforeLoad: (window) => {
        // @ts-ignore
        window.idpcConfig = {
          apiKey: Cypress.env("API_KEY"),
          populateOrganisation: true,
          autocompleteOverride: {
            checkKey: false,
          },
        };
      },
      onLoad: (window) => {
        const document = window.document;
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "../dist/bigcommerce.min.js");
        document.body.appendChild(script);
      },
    });
  });

  it("Autocomplete", () => {
    cy.get("#checkoutShippingAddress").within(() => {
      cy.wait(5000);
      cy.get("#addressLine1Input").clear().type(address.line_1);
      cy.wait(2000);
      cy.get(".idpc_ul li").first().click();
      cy.get("#addressLine1Input").should("have.value", address.line_1);
      cy.get("#addressLine2Input").should("have.value", address.line_2);
      cy.get("#companyInput").should("have.value", address.organisation_name);
      cy.get("#cityInput").should("have.value", address.post_town);
      cy.get("#countryCodeInput").should("have.value", "GB");
      cy.get("#postCodeInput").should("have.value", address.postcode);
    });
  });
});
