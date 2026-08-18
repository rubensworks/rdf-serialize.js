import { streamifyArray } from 'streamify-array';
import { rdfSerializer } from '..';
import { RdfSerializer } from '../lib/RdfSerializer';

const quad = require('rdf-quad');
const stringifyStream = require('stream-to-string');

describe('serializer', () => {
  it('should be an RdfSerializer instance', () => {
    expect(rdfSerializer).toBeInstanceOf(RdfSerializer);
  });

  it('should get all content types', async() => {
    expect((await rdfSerializer.getContentTypes()).sort()).toEqual([
      'application/ld+json',
      'application/trig',
      'application/n-quads',
      'text/turtle',
      'application/n-triples',
      'text/n3',
      'text/shaclc',
      'text/shaclc-ext',
    ].sort());
  });

  it('should get all prioritized content types', async() => {
    await expect(rdfSerializer.getContentTypesPrioritized()).resolves.toEqual({
      'application/n-quads': 1,
      'application/trig': 0.95,
      'application/ld+json': 0.9,
      'application/n-triples': 0.8,
      'text/turtle': 0.6,
      'text/n3': 0.35,
      'text/shaclc': 0.1,
      'text/shaclc-ext': 0.05,
    });
  });

  it('should fail to serialize without content type and path', async() => {
    const stream = streamifyArray([]);
    expect(() => rdfSerializer.serialize(stream, <any>{}))
      .toThrow(new Error('Missing \'contentType\' or \'path\' option while serializing.'));
  });

  it('should fail to serialize with path without extension', async() => {
    const stream = streamifyArray([]);
    expect(() => rdfSerializer.serialize(stream, { path: 'abc' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc\''));
  });

  it('should fail to serialize with path with unknown extension', async() => {
    const stream = streamifyArray([]);
    expect(() => rdfSerializer.serialize(stream, { path: 'abc.unknown' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc.unknown\''));
  });

  it('should serialize text/turtle', async() => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
      quad('http://ex.org/s', 'http://ex.org/p', '<<http://ex.org/a http://ex.org/b http://ex.org/c>>'),
    ]);
    await expect(stringifyStream(rdfSerializer.serialize(stream, { contentType: 'text/turtle' })))
      .resolves.toBe(`<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>, <<(<http://ex.org/a> <http://ex.org/b> <http://ex.org/c>)>>.
`);
  });

  it('should serialize text/turtle with prefixes', async() => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
      quad('http://ex.org/s', 'http://ex.org/p', '<<http://ex.org/a http://ex.org/b http://ex.org/c>>'),
    ]);
    await expect(stringifyStream(rdfSerializer.serialize(stream, { contentType: 'text/turtle', prefixes: { ex: 'http://ex.org/' }})))
      .resolves.toBe(`@prefix ex: <http://ex.org/>.

ex:s ex:p ex:o1, ex:o2, <<(ex:a ex:b ex:c)>>.
`);
  });

  it('should serialize application/ld+json', async() => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
    await expect(stringifyStream(rdfSerializer.serialize(stream, { contentType: 'application/ld+json' })))
      .resolves.toBe(`[
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

  it('should serialize application/ld+json by path', async() => {
    const stream = streamifyArray([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
    await expect(stringifyStream(rdfSerializer
      .serialize(stream, { path: 'myfile.json' })))
      .resolves.toBe(`[
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

  it('should serialize text/shaclc by path', async() => {
    const stream = streamifyArray([
      quad('http://localhost:3002/ContactsShape#ContactsShape', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/shacl#NodeShape'),
      quad('http://localhost:3002/ContactsShape', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Ontology'),
    ]);
    await expect(stringifyStream(rdfSerializer
      .serialize(stream, { path: 'myfile.shaclc' })))
      .resolves.toBe('BASE <http://localhost:3002/ContactsShape>\n\nshape <http://localhost:3002/ContactsShape#ContactsShape> {\n}\n');
  });
});
