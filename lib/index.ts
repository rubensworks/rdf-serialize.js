import {RdfSerializer} from './RdfSerializer';

export * from "./RdfSerializer";
// tslint:disable:no-var-requires
const rdfSerializerFactory = require('../engine-default');
const rdfSerializer = <RdfSerializer>(typeof rdfSerializerFactory === 'function' ? rdfSerializerFactory() : undefined);
export {rdfSerializer};
