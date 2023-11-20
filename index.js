import { buildSubgraph as foo } from './subgraph_foo.js';
import { buildSubgraph as bar } from './subgraph_bar.js';
import { buildGateway } from './gateway.js';

(async () => {
  await Promise.all([foo(4001), bar(4002)]);
  await new Promise((r) => setTimeout(r, 1000));
  await buildGateway(4000);
})();
