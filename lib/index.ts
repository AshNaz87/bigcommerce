import * as checkout from "./checkout";
import * as account from "./account";
import * as register from "./register";

import { setup } from "@ideal-postcodes/jsutil";

setup({ bindings: [checkout, register, account], window });
