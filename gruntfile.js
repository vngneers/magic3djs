module.exports = function(grunt) {    
	var source_js_files = new Array("src/**/*.js");
	var bannerText = '/*\nMagic3D Version 1.0\nAuthor: vngneers\nDescription: This library helps to enable 3D rotation (Using 3D transform) on any flat 2d image or html element without any need of 3d images.\nLicense: GNU GPLv3\nUsage:\nvar rotator = new Magic3D({\n	elementId: "content1",\n	clipping: 50,\n	maxDeg : 10,\n	width: 400,\n	height: 400\n});\n\nOR\n\nvar rotator = new Magic3D({\n	elements: document.getElementsByClassName("class-name");\n	clipping: 50,\n	maxDeg : 10,\n	width: 150,\n	height: 150\n});\n*/\n';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: source_js_files,
                dest: 'dist/magic3d.concat.js'
            }
        },
        uglify: {
			npmdist: {
				options: {
					banner: (bannerText + 'exports.Magic3D = Magic3D; \n')
				},
				files: {
                    'npmdist/magic3d.min.js': ['dist/magic3d.concat.js']
                }
			},
            dist: {
				options: {
					banner: bannerText
				},
                files: {
                    'dist/magic3d.min.js': ['dist/magic3d.concat.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	
    grunt.registerTask('default', 'Default Build Task', function() {
        grunt.task.run(['concat', 'uglify']);
    });
};