import * as Web3Name from 'w3name';
import minimist from 'minimist';
import fs from 'fs';

async function loadSigningKey(filename) {
  const bytes = await fs.promises.readFile(filename);
  const name = await Web3Name.from(bytes);
  return name;
}

async function main() {
  const args = minimist(process.argv.slice(2))
  const newValue = args.newValue

  if (!newValue) {
    return console.error('A value is needed to update the revision')
  }

if (args._.length !== 1) {
    return console.error('A filename is required, in order to load signing key')
  }

  const name = await loadSigningKey(args._[0])
  const revision = await Web3Name.resolve(name);
  const updatedRevision = await Web3Name.increment(revision, newValue);
  await Web3Name.publish(updatedRevision, name.key);
  const currentRevision = await Web3Name.resolve(name);
  console.log(`the updated revision of ${name.toString()} is ${updatedRevision.value}`)
  console.log(`current revision must be equal to updatedRevision: ${currentRevision.value === updatedRevision.value}`)
}

main()