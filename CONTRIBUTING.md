[Originally sourced from the 🏎 `downshift` contributing guide](https://github.com/downshift-js/downshift/edit/master/CONTRIBUTING.md)

# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1.  Fork and clone the repo
2.  Create a branch for your PR

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/godaddy/eslint-plugin-i18n-json.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes. You can run
`npm run test -u` which will update any snapshots that need updating. Make
sure to include those changes (if they exist) in your commit.

## Help needed

Please feel free to create an issue to discuss.

Thanks!!! :smile:

---

## For Maintainers

### Making PR(s)

1. properly set your public git email locally for this repo: `git config user.email my-public-email@provider.com`

### Publishing A New Version

**(ensure to lint and test beforehand)**

1. `npm login --registry=https://registry.npmjs.org/`
2. verify who you are: `npm whoami`
3. bump `package.json` and merge
4. `git tag vX.X.X`
5. `git push origin --tags`
6. `npm publish`
