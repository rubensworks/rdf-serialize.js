import {RdfSerializer} from './RdfSerializer';

export * from "./RdfSerializer";
// tslint:disable:no-var-requires
const rdfSerializer = <RdfSerializer>require('../engine-default');
export {rdfSerializer};
