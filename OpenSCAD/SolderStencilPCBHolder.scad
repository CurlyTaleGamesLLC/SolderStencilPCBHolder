// Parameters for the cuboid
height = 100; // default height in mm
width = 100; // default width in mm
thickness = 1.6; // default thickness in mm

// Calculate cylinder diameter based on length
diameter = width * 0.5 > 20 ? 20 : width * 0.5;

// Set the number of facets for a circle
$fn = 16; // Increase this value for smoother cylinders

// Perform the subtraction
difference() {
    // Rotate the STL file 90 degrees around the Y-axis and then import
    rotate([0, 90, 0]){
        translate([5, 0, 0])
            import("base_model.stl", convexity=10);
    }

    // Position the cuboid at the origin, shifted down by half its thickness
    translate([0, 0, -thickness/2])
        cube([height, width, thickness], center = true);

    // Subtract two cylinders
    // Left cylinder
    translate([-height/2, 0, 0])
        cylinder(h=4*thickness, d=diameter, center=true);
    
    // Right cylinder
    translate([height/2, 0, 0])
        cylinder(h=4*thickness, d=diameter, center=true);
}
