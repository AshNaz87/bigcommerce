<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/BigCommerce%20Integration%20Logo%403x.png" alt="Ideal Postcodes BigCommerce Integration">
</h1>

> Add UK address search and validation to BigCommerce address forms

[![Dependency Status](https://david-dm.org/ideal-postcodes/bigcommerce.svg)](https://david-dm.org/ideal-postcodes/bigcommerce)
[![Release](https://github.com/ideal-postcodes/bigcommerce/workflows/Release/badge.svg)](https://github.com/ideal-postcodes/bigcommerce/actions)
![CI](https://github.com/ideal-postcodes/bigcommerce/workflows/CI/badge.svg?branch=master)
[![npm version](https://badge.fury.io/js/%40ideal-postcodes%2Fbigcommerce.svg)](https://badge.fury.io/js/%40ideal-postcodes%2Fbigcommerce)

`@ideal-postcodes/bigcommerce` builds the integration code to enable UK address search and validation on BigCommerce address forms.

For installation, feature list and configuration see our [guide](https://ideal-postcodes.co.uk/guides/bigcommerce).

BigCommerce introduced a breaking change? Contact [support](https://ideal-postcodes.co.uk/support).

## Links

- [Guide](https://ideal-postcodes.co.uk/guides/bigcommerce)
- [Changelog](https://github.com/ideal-postcodes/bigcommerce/blob/master/CHANGELOG.md)
- [Support](https://ideal-postcodes.co.uk)
- [npm Module](https://www.npmjs.com/package/@ideal-postcodes/bigcommerce)
- [GitHub Repository](https://github.com/ideal-postcodes/bigcommerce)
- [CDN](https://www.jsdelivr.com/package/npm/@ideal-postcodes/bigcommerce)

## Configuration Options

Upon loading, the script will exit unless a [global configuration object](https://ideal-postcodes.co.uk/guides/integration-configuration) (`idpcConfig`) is detected.

```html
<script>
  window.idpcConfig = {
    apiKey: "iddqd",
  };
</script>
```

A list of configuration options can be found in our [guide](https://ideal-postcodes/guides/bigcommerce#configuration-defaults).

## Screenshots

### Address Autocomplete

Activate address autocompletion on your address collection forms.

![Address Autocomplete](https://img.ideal-postcodes.co.uk/bigcommerce-autocomplete.png)

### Postcode Lookup

Enable Postcode Lookup on your address collection forms.

![Postcode Lookup](https://img.ideal-postcodes.co.uk/bigcommerce-postcode-lookup-desktop.png)

## Test

```bash
# Build JavaScript bundle
npm run build

# Run Cypress test suite with API Key
CYPRESS_API_KEY='key' npm test
```
