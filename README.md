# TCR

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](./CONTRIBUTORS.md)

TCR lets you instantly use the `test && commit || revert` method of software development on your project. TCR watches your files and when you save any file the tests are run, if they pass the change is committed, if it fails the code is reverted.

Poof, and the failing code is gone.

TCR helps you think of the smallest possible changes you can make, without ever having broken code handing around.

![Example Screenshot](tcr.gif)

## Usage

TCR runs on Windows, Linux and Mac. Just run `npx tcr 'my test command'` and you will be up and running.

## Features

* Every save runs your test command. If it passes it's commited, if it fails it's reverted
* Failure messages are kept in the console, rather than overridden by the next test run
* `.gitignore` is respected to prevent watching compiled files
* Cross platform for Windows, Linux and Mac.
* No installation neccessary

## Editor support

TCR is reliant on editors respecting changes on disk.

Editor|Supported?|Notes
-|-|-
VS Code|Yes|You may have to disable some plugins like Prettier which interfere with listening to changes
IntelliJ suite|No|There is already a plugin for you here by Dmitry Kandalov called [limited wip](https://github.com/dkandalov/limited-wip)
Vim|Yes|You need to install and `autoread` bundle to get reloading to work without a prompt

If you can try any other editors then please update this section! PRs are welcome.

## Feedback

Feel free to send feedback on [Twitter](https://twitter.com/joe_jag) or [file an issue](https://github.com/joejag/tcr/issues/new). Feature requests are always welcome. If you wish to contribute, please take a quick look at the [guidelines](./CONTRIBUTING.md)!

## Further Reading

Kent Beck created this method in September 2018. [He wrote the original article on Medium](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)