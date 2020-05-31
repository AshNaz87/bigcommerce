import * as checkout from "./checkout";
import * as account from "./account";
import * as register from "./register";

import { setup } from "./bigcommerce";

setup({ bindings: [checkout, register, account], window });
