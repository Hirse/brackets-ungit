# Brackets Ungit
[Brackets][Brackets] Extension that adds [Ungit][Ungit] directly into Brackets.  
Runs Ungit as a child process of the Brackets node so you can access it from Brackets or any Browser.

## Installation
### Dependencies
Brackets Ungit uses [Ungit][Ungit] which in turn requires [Git][Git] to be installed on your system.

### Latest Release
To install the latest _release_ of this extension use the built-in Brackets [Extension Manager][Brackets Extension Manager] which downloads the extension from the [Brackets Extension Registry][Brackets Extension Registry].

### Latest Commit
To install the latest _commit_ of this extension use the built-in Brackets [Extension Manager][Brackets Extension Manager] which has a function to `Install from URL...` using this link:
```
https://github.com/Hirse/brackets-ungit/archive/master.zip
```
Brackets Ungit uses a local installation of the [ungit npm package][Ungit npm]. The version obtained from the Brackets Extension Manager includes this already, however if you install from GitHub directly you have to run `npm install` in the root directory of this extension.

### Brackets npm Registry
The latest _release_ of this extension is also available on the [Brackets npm Registry][Brackets npm Registry] without the bundled Ungit module.

## Usage
Click the Ungit Toolbar Button to start Ungit and open the viewer for the current project. Ungit will keep running until Brackets is closed. Go to `http://localhost:8448` to view the same Ungit instance in your Browser of choice.

## License
Brackets Ungit is licensed under the [MIT license][MIT]. [Ungit][Ungit] itself is also licensed under the MIT license.


[Brackets]: http://brackets.io
[Brackets Extension Manager]: https://github.com/adobe/brackets/wiki/Brackets-Extensions
[Brackets Extension Registry]: https://brackets-registry.aboutweb.com
[Brackets npm Registry]: https://github.com/zaggino/brackets-npm-registry
[Brackets Ungit Screenshot]: https://raw.githubusercontent.com/Hirse/brackets-ungit/master/screenshots/viewer.png
[Git]: https://git-scm.com
[MIT]: http://opensource.org/licenses/MIT
[Ungit]: https://github.com/FredrikNoren/ungit
[Ungit npm]: https://www.npmjs.com/package/ungit
