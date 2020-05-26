Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Billing", () => {
  let address: any;
  before(() => {
    cy.visit('./checkout/billing.html', {
      onBeforeLoad: (window) => {
        // @ts-ignore
        window.idpcConfig = {
          apiKey: Cypress.env("API_KEY"),
          populateOrganisation: true,
          autocompleteOverride: {}
        };
      },
      onLoad: (window) => {
        const document = window.document
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "../dist/bigcommerce.min.js");
        document.body.appendChild(script);
      }
    });
  });

  beforeEach(function() {
    cy.fixture("address.json").then(data => (address = data));
  });

  it("Autocomplete", function() {
    cy.get("#checkoutBillingAddress").within(() => {
      cy.get("#countryCodeInput").select("GB", { force: true });
      cy.get("#addressLine1Input").clear({force: true}).type(address.street);
      cy.wait(5000);
      cy.get("#addressLine1Input").clear({force: true}).type(address.street);
      cy.get(".idpc_ul li")
        .first()
        .click();
      cy.get("#cityInput").should("have.value", address.city);
      cy.get("#postCodeInput").should("have.value", address.postcode);
    });
  });
});
