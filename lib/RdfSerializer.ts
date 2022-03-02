import { ActionContext, Actor } from "@comunica/core";
import * as RDF from "@rdfjs/types";
import { PassThrough } from "stream";
import {
  MediatorRdfSerializeHandle,
  MediatorRdfSerializeMediaTypes
} from '@comunica/bus-rdf-serialize';

/**
 * An RdfSerializer can serialize to any RDF serialization, based on a given content type.
 */
export class RdfSerializer<Q extends RDF.BaseQuad = RDF.Quad>  {

  // tslint:disable:object-literal-sort-keys
  private static readonly CONTENT_MAPPINGS: { [id: string]: string } = {
    ttl      : "text/turtle",
    turtle   : "text/turtle",
    nt       : "application/n-triples",
    ntriples : "application/n-triples",
    nq       : "application/n-quads",
    nquads   : "application/n-quads",
    n3       : "text/n3",
    trig     : "application/trig",
    jsonld   : "application/ld+json",
    json     : "application/ld+json",
  };

  public readonly mediatorRdfSerializeMediatypes: MediatorRdfSerializeMediaTypes;
  public readonly mediatorRdfSerializeHandle: MediatorRdfSerializeHandle;

  constructor(args: IRdfSerializerArgs) {
    this.mediatorRdfSerializeMediatypes = args.mediatorRdfSerializeMediatypes;
    this.mediatorRdfSerializeHandle = args.mediatorRdfSerializeHandle;
  }

  /**
   * Get an array of all available content types for this serializer.
   * @return {Promise<string[]>} A promise resolving to a string array of all content types.
   */
  public async getContentTypes(): Promise<string[]> {
    return Object.keys(await this.getContentTypesPrioritized());
  }

  /**
   * Get a hash of all available content types for this serializer, mapped to a numerical priority.
   * @return {Promise<{[p: string]: number}>} A promise resolving to a hash mapping content type to a priority number.
   */
  public async getContentTypesPrioritized(): Promise<{[contentType: string]: number}> {
    return (await this.mediatorRdfSerializeMediatypes.mediate(
      { context: new ActionContext(), mediaTypes: true })).mediaTypes;
  }

  /**
   * Serialize the given stream.
   * @param {NodeJS.ReadableStream} stream A string stream.
   * @param {ISerializeOptions} options Serialization options.
   * @return {Stream} An RDFJS quad stream.
   */
  public serialize(stream: RDF.Stream, options: SerializeOptions): NodeJS.ReadableStream {
    let contentType: string;
    if ('contentType' in options && options.contentType) {
      contentType = options.contentType;
    } else if ('path' in options && options.path) {
      contentType = this.getContentTypeFromExtension(options.path);
      if (!contentType) {
        throw new Error(`No valid extension could be detected from the given 'path' option: '${options.path}'`);
      }
    } else {
      throw new Error(`Missing 'contentType' or 'path' option while serializing.`);
    }

    // Create a new readable
    const readable = new PassThrough({ objectMode: true });

    // Delegate serializing to the mediator
    const context = new ActionContext(options);
    this.mediatorRdfSerializeHandle.mediate({
      context,
      handle: { quadStream: stream, context },
      handleMediaType: contentType,
    })
      .then((output) => {
        const data: NodeJS.ReadableStream = output.handle.data;
        data.on('error', (e) => readable.emit('error', e));
        data.pipe(readable);
      })
      .catch((e) => readable.emit('error', e));

    return readable;
  }

  /**
   * Get the content type based on the extension of the given path,
   * which can be an URL or file path.
   * @param {string} path A path.
   * @return {string} A content type or the empty string.
   */
  protected getContentTypeFromExtension(path: string): string {
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex >= 0) {
      const ext = path.substr(dotIndex);
      // ignore dot
      return RdfSerializer.CONTENT_MAPPINGS[ext.substring(1)] || '';
    }
    return '';
  }

}

export interface IRdfSerializerArgs {
  mediatorRdfSerializeMediatypes: MediatorRdfSerializeMediaTypes;
  mediatorRdfSerializeHandle: MediatorRdfSerializeHandle;
  actors: Actor<any, any, any>[];
}

export type SerializeOptions = {
  /**
   * The content type of the needed serialization.
   */
  contentType: string;
} | {
  /**
   * The file name or URL that will be serialized to.
   */
  path: string;
};
