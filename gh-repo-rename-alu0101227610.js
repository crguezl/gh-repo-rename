#! /usr/bin/env node
const ins = require("util").inspect;

const shell = require('shelljs');
const { Command } = require('commander');
const program = new Command();
const { version } = require("./package.json")

program
  .version(version)
  .option('-r, --repo <repo>', 'repository')
  .option('-o, --org <org>', 'org')
  .option('-n, --name <name>', 'name');

program.parse(process.argv);

let args = program.args;
debugger;

const getRepoId = (owner, name) => `
query {
  repository(owner: "${owner}", name: "${name}") {
    id
  }
}
`;

const renameRepo = (id, newName) => `
mutation {
  updateRepository(input: {name: "${newName}", repositoryId: "${id}"}) {
    repository {
      name
    }
  }
}
`;

let { org, repo, name } = program.opts();

if (!org || ! repo || !name) program.help();

if (!shell.which('git')) shell.echo("git not installed")
if (!shell.which('gh')) shell.echo("gh not installed");

// console.log(getRepoId(org, repo))

let r = shell.exec(`gh api  graphql -f query='${getRepoId(org, repo)}' --jq '.data.repository.id'`, 
                   {silent: true});
if (r.code !== 0) {
  console.error(r.stderr);
  process.exit(r.code);
}
// console.log("getRepoId return = ", r.stdout);

const Id = r.stdout;

//  stdout: '{"data":{"updateRepository":{"repository":{"name":"prueba"}}}}'
r  = shell.exec(
  `gh api graphql -f query='${renameRepo(Id, name)}'  --jq '.data.updateRepository.repository.name'`,
  {silent:true})

if (r.code !== 0) {
    console.error(r.stderr);
    process.exit(r.code);
}

console.log(r.stdout)
