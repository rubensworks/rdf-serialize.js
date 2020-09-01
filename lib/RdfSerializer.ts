import { IActionRdfSerialize, IActorRdfSerializeOutput } from "@comunica/bus-rdf-serialize";
import {
  IActionAbstractMediaTypedHandle,
  IActionAbstractMediaTypedMediaTypes,
  IActorOutputAbstractMediaTypedHandle,
  IActorOutputAbstractMediaTypedMediaTypes,
  IActorTestAbstractMediaTypedHandle,
  IActorTestAbstractMediaTypedMediaTypes,
} from '@comunica/actor-abstract-mediatyped';
import { ActionContext, Actor, IActorTest, Mediator } from "@comunica/core";
import * as RDF from "rdf-js";
import { Readable } from "stream";

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

  public readonly mediatorRdfSerializeMediatypes: Mediator<Actor<
    IActionAbstractMediaTypedMediaTypes, IActorTestAbstractMediaTypedMediaTypes,
    IActorOutputAbstractMediaTypedMediaTypes>,
    IActionAbstractMediaTypedMediaTypes, IActorTestAbstractMediaTypedMediaTypes,
    IActorOutputAbstractMediaTypedMediaTypes>;
  public readonly mediatorRdfSerializeHandle: Mediator<Actor<
    IActionAbstractMediaTypedHandle<IActionRdfSerialize>, IActorTestAbstractMediaTypedHandle<IActorTest>,
    IActorOutputAbstractMediaTypedHandle<IActorRdfSerializeOutput>>,
    IActionAbstractMediaTypedHandle<IActionRdfSerialize>, IActorTestAbstractMediaTypedHandle<IActorTest>,
    IActorOutputAbstractMediaTypedHandle<IActorRdfSerializeOutput>>;

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
  public async getContentTypesPrioritized(): Promise<{[contenType: string]: number}> {
    return (await this.mediatorRdfSerializeMediatypes.mediate(
      { context: ActionContext({}), mediaTypes: true })).mediaTypes;
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
    const readable = new Readable();
    readable._read = () => {
      return;
    };

    // Delegate serializing to the mediator
    this.mediatorRdfSerializeHandle.mediate({
      context: ActionContext(options),
      handle: { quadStream: stream },
      handleMediaType: contentType,
    })
      .then((output) => {
        const data: NodeJS.ReadableStream = output.handle.data;
        data.on('error', (e) => readable.emit('error', e));
        data.on('data', (chunk) => readable.push(chunk));
        data.on('end', () => readable.push(null));
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
  mediatorRdfSerializeMediatypes: Mediator<Actor<
    IActionAbstractMediaTypedMediaTypes, IActorTestAbstractMediaTypedMediaTypes,
    IActorOutputAbstractMediaTypedMediaTypes>,
    IActionAbstractMediaTypedMediaTypes, IActorTestAbstractMediaTypedMediaTypes,
    IActorOutputAbstractMediaTypedMediaTypes>;
  mediatorRdfSerializeHandle: Mediator<Actor<
    IActionAbstractMediaTypedHandle<IActionRdfSerialize>, IActorTestAbstractMediaTypedHandle<IActorTest>,
    IActorOutputAbstractMediaTypedHandle<IActorRdfSerializeOutput>>,
    IActionAbstractMediaTypedHandle<IActionRdfSerialize>, IActorTestAbstractMediaTypedHandle<IActorTest>,
    IActorOutputAbstractMediaTypedHandle<IActorRdfSerializeOutput>>;
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
