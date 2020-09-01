const quad = require('rdf-quad');
const streamifyArray = require('streamify-array');
const stringifyStream = require('stream-to-string');
import {RdfSerializer} from "../lib/RdfSerializer";

import serializer from "..";

describe('serializer', () => {
  it('should be an RdfSerializer instance', () => {
    expect(serializer).toBeInstanceOf(RdfSerializer);
  });

  it('should get all content types', async () => {
    expect(await serializer.getContentTypes()).toEqual([
      "application/ld+json",
      "application/trig",
      "application/n-quads",
      "text/turtle",
      "application/n-triples",
      "text/n3"
    ]);
  });

  it('should get all prioritized content types', async () => {
    expect(await serializer.getContentTypesPrioritized()).toEqual({
      "application/ld+json": 0.9,
      "application/n-quads": 0.7,
      "application/n-triples": 0.3,
      "application/trig": 1,
      "text/n3": 0.2,
      "text/turtle": 0.6
    });
  });

  it('should fail to serialize without content type and path', () => {
    const stream = streamifyArray([]);
    return expect(() => serializer.serialize(stream, <any> {}))
      .toThrow(new Error('Missing \'contentType\' or \'path\' option while serializing.'));
  });

  it('should fail to serialize with path without extension', () => {
    const stream = streamifyArray([]);
    return expect(() => serializer.serialize(stream, { path: 'abc' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc\''));
  });

  it('should fail to serialize with path with unknown extension', () => {
    const stream = streamifyArray([]);
    return expect(() => serializer.serialize(stream, { path: 'abc.unknown' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc.unknown\''));
  });

  it('should serialize text/turtle', () => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
    return expect(stringifyStream(serializer.serialize(stream, { contentType: 'text/turtle' })))
      .resolves.toEqual(`<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
  });

  it('should serialize application/ld+json', () => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
    return expect(stringifyStream(serializer.serialize(stream, { contentType: 'application/ld+json' })))
      .resolves.toEqual(`[
  {
    "@id": "http://ex.org/s",
    "http://ex.org/p": [
      {
        "@id": "http://ex.org/o1"
      }
      ,
      {
        "@id": "http://ex.org/o2"
      }
    ]
  }
]
`);
  });

  it('should serialize application/ld+json by path', () => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
    return expect(stringifyStream(serializer
      .serialize(stream, { path: 'myfile.json' })))
      .resolves.toEqual(`[
  {
    "@id": "http://ex.org/s",
    "http://ex.org/p": [
      {
        "@id": "http://ex.org/o1"
      }
      ,
      {
        "@id": "http://ex.org/o2"
      }
    ]
  }
]
`);
  });
});
