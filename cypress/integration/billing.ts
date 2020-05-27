import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.england;

describe("Billing", () => {
  before(() => {
    cy.visit("./checkout/billing.html", {
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
    cy.get("#checkoutBillingAddress").within(() => {
      cy.wait(2002);
      cy.get("#addressLine1Input").clear({ force: true }).type(address.line_1);
      cy.get(".idpc_ul li").first().click();
      cy.get("#addressLine1Input").should("have.value", address.line_1);
      cy.get("#addressLine2Input").should("have.value", address.line_2);
      cy.get("#companyInput").should("have.value", address.organisation_name);
      cy.get("#countryCodeInput").should("have.value", "GB");
      cy.get("#cityInput").should("have.value", address.post_town);
      cy.get("#postCodeInput").should("have.value", address.postcode);
    });
  });
});
