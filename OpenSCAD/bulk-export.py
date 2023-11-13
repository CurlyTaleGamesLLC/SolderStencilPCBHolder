import os
import subprocess
from stl import mesh
from multiprocessing import Pool

# Function to clear STL files in a directory
def clear_stl_files(directory):
    for file in os.listdir(directory):
        if file.endswith(".stl"):
            os.remove(os.path.join(directory, file))

# Function to convert ASCII STL to Binary STL
def convert_ascii_to_binary_stl(ascii_stl_file, binary_stl_file):
    # Load the ASCII STL file
    your_mesh = mesh.Mesh.from_file(ascii_stl_file)

    # Save as binary STL
    your_mesh.save(binary_stl_file)

    # Remove the ASCII STL file and rename the binary STL file
    os.remove(ascii_stl_file)
    os.rename(binary_stl_file, ascii_stl_file)

# Function to generate STL using OpenSCAD and convert it
def generate_and_convert_stl(args):
    height, width, thickness, scad_file, export_dir = args
    ascii_filename = f"stencil_{height}_{width}_{thickness}.stl"
    binary_filename = f"stencil_{height}_{width}_{thickness}_binary.stl"
    
    ascii_filepath = os.path.join(export_dir, ascii_filename)
    binary_filepath = os.path.join(export_dir, binary_filename)

    # Generate STL using OpenSCAD
    subprocess.run(["openscad", "-o", ascii_filepath, "-D", f"height={height}", "-D", f"width={width}", "-D", f"thickness={thickness}", scad_file])

    # Convert ASCII STL to Binary STL and cleanup
    convert_ascii_to_binary_stl(ascii_filepath, binary_filepath)

def main():
    heights = range(1, 10, 1)
    widths = range(1, 10, 1)
    thicknesses = [0.8, 1.6, 2.0, 2.4, 3.2]
    scad_file = "SolderStencilPCBHolder.scad"
    export_dir = "export"

    # Create export directory if it doesn't exist, or clear it if it does
    if not os.path.exists(export_dir):
        os.makedirs(export_dir)
    else:
        clear_stl_files(export_dir)

    # Prepare arguments for multiprocessing
    args_list = [(h, w, t, scad_file, export_dir) for h in heights for w in widths for t in thicknesses if h > 0 and w > 0]

    # Use multiprocessing to generate and convert files
    with Pool() as pool:
        pool.map(generate_and_convert_stl, args_list)

if __name__ == "__main__":
    main()
