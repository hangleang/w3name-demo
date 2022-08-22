import * as Web3Name from 'w3name';
import minimist from 'minimist';
import fs from 'fs';

async function saveSigningKey(name, outputFilename) {
  const bytes = name.key.bytes;
  await fs.promises.writeFile(outputFilename, bytes);
}

async function main() {
  const args = minimist(process.argv.slice(2))
  const value = args.value

  if (!value) {
    return console.error('A value is needed to create the initial revision for a name')
  }

  if (args._.length !== 1) {
    return console.error('An output file is required, in order to save signing key')
  }

  const name = await Web3Name.create();
  console.log('created new name: ', name.toString());
  console.log('saving signing key to output file: ', args._[0])
  await saveSigningKey(name, args._[0])

  const revision = await Web3Name.v0(name, value);
  await Web3Name.publish(revision, name.key);
  console.log(`initial revision of ${name.toString()} is ${revision.value}`)
}

main()