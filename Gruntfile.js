module.exports = function(grunt) {



 grunt.initConfig({
  // babel: {
  //     options: {
  //         sourceMap: true
  //     },
  //     dist: {
  //         files: {
  //             '': '' // NewFilenamePath: FileToTranspile
  //         }
  //     }
  // },
  bower: {
      dev: {
          base: 'bower_components', /* the path to the bower_components directory */
          dest: 'web/bower_components',
          options: {
              checkExistence: true,
              debugging: true,
              paths: {
                  bowerDirectory: 'bower_components',
                  bowerrc: '.bowerrc',
                  bowerJson: 'bower.json'
              }
          }
      },
      flat: { /* flat folder/file structure */
          dest: 'public/vendor',
          options: {
              debugging: true
          }
      }
  },
  imagemin: {                          // Task 
    dynamic: {                         // Another target 
      files: [{
        expand: true,                  // Enable dynamic expansion 
        cwd: 'img/',                   // Src matches are relative to this path 
        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
        dest: 'dist/'                  // Destination path prefix 
      }]
    }
  },
  jshint: {
    files: ['app/**/*.js']
  },
  sass: {
   dist: {
     files: {
       'styles/main.css': 'styles/main.scss'
     }
   }
  },
  watch: {
     javascripts: {
       files: ['app/**/*.js'],
       tasks: ['jshint']
     },
   sassy: {
       files: ['styles/**/*.scss'],
       tasks: ['sass']
   }
  }
 });

 grunt.loadNpmTasks('grunt-contrib-imagemin');
 grunt.loadNpmTasks('grunt-newer');

 require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
 grunt.registerTask('default', [
    'newer:imagemin'
]);
 grunt.registerTask('default', ['jshint',  'watch', 'sass']); // Add 'babel' for babel

};


