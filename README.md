grunt-depmod
============

Analyses .js files for various module systems and extracts the module names
and dependency information.

Tasks
-----

### depmod

Generate the depmod information in JSON format

{
   'depmod': {
       other: {
           src: [ '**/[^\.]*.{css,js}' ],
           dest: 'other-depmod.json',
           processName: function(name, filename) {
               if (filename.match(/\.css$/)) {
                   return 'CSS!'+name;
               return name;
           }
       }
   }
}


### depmod-tracker

Analyze the depmod information and watch for changes. This can be further
used to consume the depmod information from within other grunt tasks.

{
   'depmod-tracker': {
       app: {
           src: [ '**/[^\.]*.{css,js}' ],
           processName: function(name, filename) { return name; },
           modulesInfo: [ 'other-depmod.json' ]
       }
   }
}


### depmod-resolve

Provide a list of files necessary for the specified module to load
with all transitive dependencies.

{
   'depmod-resolve': {
       app: {
           modulesInfo: [ 'other-depmod.json' ],
           module: 'my-app-main-module'
       }
   }
}

