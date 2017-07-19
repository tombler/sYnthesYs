module.exports = function(grunt) {

 grunt.initConfig({
  uglify: {
    min: {
      files: {
        'synthesys.min.js': [
          'app/app.js',
          "app/instruments/audioSampleLoader.js",
          "app/instruments/watercanvas.js",
          "app/instruments/preProgrammed.js",
          "app/controllers/HomeCtrl.js",
          "app/controllers/KeyboardCtrl.js",
          "app/controllers/CustomSoundCtrl.js",
          "app/controllers/DjCtrl.js",
          "app/controllers/UploadCtrl.js"
        ]
      }
    }
  },
  build: {
    src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/raphael/raphael.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap.min.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/qwerty-hancock/dist/qwerty-hancock.js'],
    dest: 'dependencies.min.js'
  },
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
 grunt.loadNpmTasks('grunt-contrib-uglify');

 require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
 grunt.registerTask('default', [
    'newer:imagemin'
]);
 grunt.registerTask('default', ['jshint',  'watch', 'sass', 'uglify']); // Add 'babel' for babel

};


