# TCR
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard) 

TCR lets you instantly use the `test && commit || revert` method of software development on your project. TCR watches your files, and when you save any file, the tests are run, if they pass the change is committed if it fails the code is reverted.

Poof! The failing code is gone.

TCR helps you think of the smallest possible changes you can make, without ever having broken code hanging around.

![Example Screenshot](tcr.gif)

## Usage

TCR runs on Windows, Linux and Mac. Just run `npx tcr 'my test command'` and you will be up and running.

## Features

* No installation necessary
* Each save runs your test command. If it passes it's committed, if it fails it's reverted
* Failure messages are kept in the console, rather than overridden by the next test run
* `.gitignore` is respected to prevent watching compiled files
* Stats on commits and reverts are shown along with the most recent file change detected
* Cross-platform for Windows, Linux and Mac

## Editor support

TCR is reliant on editors respecting changes on disk.

Editor|Supported?|Notes
-|-|-
VS Code|Yes|You may have to disable some plugins like Prettier which interfere with listening to changes
IntelliJ suite|No|There is already a plugin for you here by Dmitry Kandalov called [limited wip](https://github.com/dkandalov/limited-wip)
Vim|Yes|You need to install an `autoread` bundle to get reloading to work without a prompt

If you can try any other editors, then please update this section! [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Feedback

Feel free to send feedback on [Twitter](https://twitter.com/joe_jag) or [file an issue](https://github.com/joejag/tcr/issues/new). Feature requests are always welcome. If you wish to contribute, please take a quick look at the [guidelines](./CONTRIBUTING.md)!

## Further Reading

Kent Beck created this method in September 2018. [He wrote the original article on Medium](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://code.joejag.com"><img src="https://avatars1.githubusercontent.com/u/57625?v=4" width="100px;" alt="Joe Wright"/><br /><sub><b>Joe Wright</b></sub></a><br /><a href="https://github.com/joejag/tcr/commits?author=joejag" title="Code">💻</a></td><td align="center"><a href="http://www.kentbeck.com"><img src="https://avatars2.githubusercontent.com/u/46154?v=4" width="100px;" alt="Kent Beck"/><br /><sub><b>Kent Beck</b></sub></a><br /><a href="#ideas-kentbeck" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://www.skytala-gmbh.com"><img src="https://avatars2.githubusercontent.com/u/4200484?v=4" width="100px;" alt="Thomas Deniffel"/><br /><sub><b>Thomas Deniffel</b></sub></a><br /><a href="#blog-tom-010" title="Blogposts">📝</a> <a href="#example-tom-010" title="Examples">💡</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
