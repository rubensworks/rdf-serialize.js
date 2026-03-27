import type { RdfSerializer } from './RdfSerializer';

export * from './RdfSerializer';
// eslint-disable-next-line ts/no-require-imports, ts/no-unsafe-assignment, ts/no-var-requires
const rdfSerializerFactory = require('../engine-default');

const rdfSerializer = <RdfSerializer>(typeof rdfSerializerFactory === 'function' ? rdfSerializerFactory() : undefined);
export { rdfSerializer };
