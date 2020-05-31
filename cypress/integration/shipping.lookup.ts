import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.england;

describe("Shipping Page", () => {
  describe("Postcode Lookup", () => {
    before(() => {
      cy.visit("./fixtures/checkout/shipping.html", {
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
          document.body.appendChild(script);
        },
      });
    });

    it("applies postcode lookup to address form", () => {
      cy.get("#checkoutShippingAddress").within(() => {
        cy.wait(5000);
        cy.get(".postcode-lookup").within(() => {
          const force = true;
          cy.get("input[type=text]").type(address.postcode, { force });
          cy.get("input[type=submit]").click({ force });
          cy.get("select").select("0", { force });
        });

        cy.get("#addressLine1Input").should("have.value", address.line_1);
        cy.get("#addressLine2Input").should("have.value", address.line_2);
        cy.get("#companyInput").should("have.value", address.organisation_name);
        cy.get("#countryCodeInput").should("have.value", "GB");
        cy.get("#cityInput").should("have.value", address.post_town);
        cy.get("#postCodeInput").should("have.value", address.postcode);
      });
    });
  });
});
