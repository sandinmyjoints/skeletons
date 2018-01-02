#!/usr/bin/env node
/*eslint no-console: 0*/

/*
# Usage

$ stream.js --infile <infile.json> --outfile <outfile.json>
OR
$ < infile.json stream.js > outfile.json
*/

const fs = require('fs');
const ndjson = require('ndjson');
const through = require('through2');
const request = require('request');
const argv = require('minimist')(process.argv.slice(2));
const ensureGunzip = require('ensure-gunzip');

const infile = argv.infile;
const outfile = argv.outfile;

let instream = process.stdin;

if (infile) {
  const possiblyZippedStream = fs.createReadStream(infile);
  const definitelyUnzippedStream = ensureGunzip(possiblyZippedStream);
  instream = definitelyUnzippedStream;
}

const outstream = outfile ? fs.createWriteStream(outfile) : process.stdout;

function doSomething(obj, enc, cb) {
  // Do something async with obj, for example:
  let url = 'https://www.googleapis.com/customsearch/v1' +
      `?key=${API_KEY}&cx=017576662512468239146:omuauf_lfve` +
      `&q=${encodeURIComponent(obj)}`
  request(
    url,
    {
      json: true,
    },
    function(err, res, body) {
      if (res.statusCode === 200) {
        obj.result = body.data.source;
      }
      cb(err, obj);
    }
  );
}

function finish(err) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
}

if (require.main === module) {
  instream
    .pipe(ndjson.parse())
    .pipe(through.obj(doSomething))
    .on('error', finish)
    .pipe(ndjson.serialize())
    .on('end', finish)
    .resume()
    .pipe(outstream);
}

module.exports = exports;
