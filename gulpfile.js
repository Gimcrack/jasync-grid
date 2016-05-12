var elixir = require('laravel-elixir');

require('laravel-elixir-livereload');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    //scripts
    mix
      .browserify('index.js', './resources/assets/js/prebuild/terntables-core.js')
      .scriptsIn('./resources/assets/js/prebuild/', './build/terntables.js')
      //.copy('./build/terntables.js','../../dashboard-dev/public/js/terntables.js')
});
