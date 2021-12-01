const shell = require('shelljs');

// 1st part: get id of repo

function getRepoId(owner, name) {
    const queryRepoId = (owner, name) => `
    query {
      repository(owner: "${owner}", name: "${name}") {
        id
      }
    }
    `;
    let r = shell.exec(`gh api  graphql -f query='${queryRepoId(owner, name)}' --jq '.data.repository.id'`, 
                       {silent: true});
    if (r.code !== 0) {
      console.error(r.stderr);
      process.exit(r.code);
    }
    const Id = r.stdout.replace(/\s+$/g,'');
    return Id;    
}

// 2nd part: rename repo

function renameRepo(id, newName) {
    const queryRenameRepo = (id, newName) => `
    mutation {
      updateRepository(input: {name: "${newName}", repositoryId: "${id}"}) {
        repository {
          name
        }
      }
    }
    `;
    //  stdout: '{"data":{"updateRepository":{"repository":{"name":"prueba"}}}}'
    r  = shell.exec(
      `gh api graphql -f query='${queryRenameRepo(id, newName)}'  --jq '.data.updateRepository.repository.name'`,
      {silent:true})
    
    if (r.code !== 0) {
        console.error(r.stderr);
        process.exit(r.code);
    }
    return r.stdout.replace(/\s+$/,'');
}

module.exports = {
    getRepoId,
    renameRepo
}
