# Solder Stencil PCB Holder

Solder Stencil PCB Holder is a web application designed for generating downloadable STL files based on your PCB dimensions. Enter the height, width, and thickness of your PCB to get a custom STL file for your solder stencil holder.

![Screenshot](screenshot.png)

<p align="center">
  <a href="https://curlytalegamesllc.github.io/SolderStencilPCBHolder/"><img height="70px" src="./docs/try.png"></a>
</p>

## Getting Started


Solder Stencil PCB Holder is hosted on GitHub Pages, you don't have to run it locally. But if you'd like to make some changes below are the instructions to get started.

Before making changes to Solder Stencil PCB Holder, ensure you have [OpenSCAD](https://openscad.org/downloads.html) installed.


Make sure to add the path to OpenSCAD.exe to your environement variables:

    C:\Program Files\OpenSCAD

### Editing and Exporting STLs

You can open the `SolderStencilPCBHolder.scad` file in the OpenSCAD directory of this project to edit the parameters or source code of this project.

#### Bulk Export

The web app has a form that generates a link to a STL file that was created using this bulk export process.

To do a bulk export you need to install [Python](https://www.python.org/downloads/) to export and compress the STL files

Make sure add the Python path to your environement variables during installation

After installing Python install the `numpy-stl` library using this command:

    pip install numpy-stl


Lastly run the `bulk-export.py` file

    python bulk-export.py

It will use the OpenSCAD command line interface to export out every possible combination of widths, heights, and thicknesses of rectangular PCBs. The STL files will be saved and compressed in the export directory and named in this format `stencil_[height]_[width]_[thickness].stl`


## Contributing
If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name for your feature or bug fix.
3. Make your changes and commit them with clear and concise messages.
4. Push your branch to your fork.
5. Submit a pull request to the main branch of the original repository.


## Credits

- Web app and OpenSCAD model by [Curly Tale Games](https://curlytalegames.com/).
- Original STL design by [Michael Graham on Thingiverse](https://www.thingiverse.com/mechengineermike/designs).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
