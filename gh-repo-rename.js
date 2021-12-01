#! /usr/bin/env node
const ins = require("util").inspect;
const shell = require('shelljs');
const { Command } = require('commander');
const { getRepoId, renameRepo } = require('./repo-rename');

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

let { org, repo, name } = program.opts();

if (!org || ! repo || !name) program.help();

if (!shell.which('git')) shell.echo("git not installed")
if (!shell.which('gh')) shell.echo("gh not installed");

const Id = getRepoId(org, name);

const newName = renameRepo(Id, name);

console.log(`The repo '${org}/${repo}' has been renamed to '${newName}'`)
