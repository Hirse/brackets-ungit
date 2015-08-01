# Brackets Ungit
[Brackets][Brackets] Extension that adds [Ungit][Ungit] directly into Brackets.  
Runs Ungit as a child process of the Brackets node so you can access it from Brackets or any Browser.

This is necessarily an alternative to [Brackets-Git][Brackets Git], you can use both in parallel without conflicts.
In fact, I have both installed and use either, depending on the task and context.

## Dependencies
Brackets Ungit uses [Ungit][Ungit] which in turn requires [Git][Git].
* __Git__ has to be installed on your system before you use the extension.
* __Node.js__ and __npm__ have to be installed and globally available on your system to install and run Ungit.
* __Ungit__ will be installed as `node_module` on the first run of this extension.

## Screenshots
![Brackets Ungit Viewer][Brackets Ungit Viewer Screenshot]  
*Ungit in Brackets*

![Brackets Ungit Dependency Installation][Brackets Ungit Install Screenshot]  
*Dependency Installation*

## Installation
### Latest Release
To install the latest _release_ of this extension use the built-in Brackets [Extension Manager][Brackets Extension Manager] which downloads the extension from the [Brackets Extension Registry][Brackets Extension Registry].

### Latest Commit
To install the latest _commit_ of this extension use the built-in Brackets [Extension Manager][Brackets Extension Manager] which has a function to `Install from URL...` using this link:
```
https://github.com/Hirse/brackets-ungit/archive/master.zip
```

### Brackets npm Registry
The latest _release_ of this extension is also available on the [Brackets npm Registry][Brackets npm Registry].

## Usage
Click the Ungit Toolbar Button to start Ungit and open the viewer for the current project. Ungit will keep running until Brackets is closed. Go to `http://localhost:8448` to view the same Ungit instance in your Browser of choice.

## License
Brackets Ungit is licensed under the [MIT license][MIT]. [Ungit][Ungit] itself is also licensed under the MIT license.


[Brackets]: http://brackets.io
[Brackets Extension Manager]: https://github.com/adobe/brackets/wiki/Brackets-Extensions
[Brackets Extension Registry]: https://brackets-registry.aboutweb.com
[Brackets Git]: https://github.com/zaggino/brackets-git
[Brackets npm Registry]: https://github.com/zaggino/brackets-npm-registry
[Brackets Ungit Viewer Screenshot]: https://raw.githubusercontent.com/Hirse/brackets-ungit/master/screenshots/viewer.png
[Brackets Ungit Install Screenshot]: https://raw.githubusercontent.com/Hirse/brackets-ungit/master/screenshots/install.png
[Git]: https://git-scm.com
[MIT]: http://opensource.org/licenses/MIT
[Ungit]: https://github.com/FredrikNoren/ungit
