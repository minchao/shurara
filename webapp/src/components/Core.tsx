import * as React from "react";

import Link from "./Link";

/**
 * <Core />
 * Wraps all our child components to provide global navigation.
 * This makes it simple to have a component at the index "/" route
 * of our application.
 */

const Core = ({children}) =>
  <div>
    <nav>
      <Link href="/">Home</Link>
      <Link href="/help">Help</Link>
    </nav>
    <main>
      {children}
    </main>
  </div>;

export default Core;
