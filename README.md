# Angular Library


## Code Reusablilty
* An Angular library is a collection of pre-built, reusable code that can be imported and used in an Angular application. 
* It can include components, services, directives, pipes, and other code that can help in building an application faster and with less code duplication.


## Code Packaging
* Angular libraries allow to encapsulate specific functionalities and share them across different projects. 
* Libraries can be published to package managers such as npm, and can be easily installed and managed in different projects. 
* In our case it will be privetly maintained npm registry either on Verdaccio or Artifactory


## Monorepo Library
* A monorepo Angular library is an Angular library that is developed and managed within a monorepo. 
* In a monorepo, multiple projects and packages are stored in a single repository, which can include applications, libraries, and other related code.

* Developing an Angular library within a monorepo has several benefits. Firstly, it allows for easy code sharing and reusability across different projects, as libraries can be easily referenced and imported within other projects in the monorepo. 
* Secondly, it simplifies the management of dependencies and versions, as all the projects within the monorepo can share the same dependencies and be versioned together. Finally, it streamlines the development and testing processes, as changes made to the library can be automatically reflected in all the projects that depend on it.


## Polyrepo Library
* A polyrepo Angular library is an Angular library that is developed and managed within its own repository, separate from the application it is intended to be used in. 
* In a polyrepo approach, each library or module is stored in its own repository, which can be versioned and managed independently from other repositories.
* Developing an Angular library within a polyrepo has several benefits. Firstly, it allows for more flexibility and autonomy in managing the library, as it can be versioned and released separately from the main application. 
* Secondly, it enables better collaboration and sharing of code across different projects and teams, as the library can be easily referenced and imported from different repositories. Finally, it simplifies the management of dependencies, as the library can define and manage its own dependencies separately from the main application.

## Prerequisite and Setup
* Installed Node.js
* Installed Angular CLI
* Create new basic angular app using cli command along with basic dependency

## Project structure
~~~bash
MY-APP
│   
├───dist
├───node_module
├───angular.json
├───package.json
├───tsconfig.json
└───src
     |
     │   favicon.ico
     │   index.html
     │   main.ts
     │   styles.css
     │   
     ├───app
     │       app.component.css
     │       app.component.html
     │       app.component.spec.ts
     │       app.component.ts
     │       app.module.ts
     │       
     └───assets
~~~

---
## Monorepo
---

## Create Library Structure 
* Library will be created using following command in the project directory
~~~poweshell
ng generate library [name of library]
~~~
* On successful execution of generate library command folloowing folder will be added in the ```project``` directory

~~~bash
MY_APP
│   
├───dist
├───node_module
├───angular.json
├───package.json
├───tsconfig.json
├───src
└───project
        └───sample-lib[name of the library]
                ├───ng-package.json
                ├───package.json
                ├───README.md
                ├───tsconfig.lib.json
                ├───tsconfig.lib.prod.json
                ├───tsconfig.spec.json
                └───src
                    ├───public-api.ts
                    └───lib
                         ├───sample-lib.component.spec.ts
                         ├───sample-lib.component.ts
                         ├───sample-lib.module.ts
                         ├───sample-lib.service.spec.ts
                         └───sample-lib.service.ts
~~~

* ```public-api.ts``` is the entry point for the library. Different components and services which user can access in the library must be declared here. In following code, service, component and module are provided to use.
~~~typescript
/*
 * Public API Surface of sample-lib
 */

export * from './lib/sample-lib.service';
export * from './lib/sample-lib.component';
export * from './lib/sample-lib.module';
~~~

## Build the library
* ```tsconfig.json``` file got modified because of library generation command. Path of library executable added. And because of this we can access the library.
~~~typescript
    "paths": {
      "sample-lib": [
        "dist/sample-lib"
      ]
    },
~~~

* To building the library ```cd``` to the ```projects/sample-lib``` and execute following command

~~~bash
my-app\projects\sample-lib> ng build
~~~

* Alternately, to build the library from main project directory use following command
~~~bash
my-app> ng build sample-lib
~~~
* If library build was successful, then the ```dist``` folder will have one folder with same name as library for which build happened. In our case it will be ```sample-lib```

~~~bash
MY_APP
    │   
    └───dist
          ├───my-app
          └───sample-lib
              ├───esm2020
              │   └───lib
              ├───fesm2015
              ├───fesm2020
              └───lib
~~~
* Previously mentioned ````tsconfig.json``` path is nothing but an alias for the above explained library executables.

## Use the Library

* Import the library module in ```app.module.ts```
~~~typescript
import { SampleLibModule } from 'sample-lib'; // alias declared in tsconfig.json file

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SampleLibModule     // lib module import here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
~~~

* Note: Library module name can be found under following path
~~~bash
MY-APP >> projects >> sample-lib >> src >> lib >> sample-lib.module.ts
~~~

* Now to use this library component in your component, simply use the library component tag in your component. 
~~~html
<lib-sample-lib></lib-sample-lib>
~~~
* note : please make sure the library component is declared in the ```public-api.ts``` file of library folder. If not then declare it and rebuild the library again. Also if you change the library, then dont forget to rebuild the library. 
---
## Polyrepo [using Verdaccio]
---

## Verdaccio
* Library have it's own repository. Which gets build separately and publiashed to npm registory. From npm registry this library can be imported/installed to any of the other apps. [publish the library to npm registry]

* Verdaccio is a lightweight, open-source, private npm proxy registry that allows you to have your own private npm registry that can be used to store and share.

* Install Verdaccio globally using following command
~~~bash
npm install verdaccio -g
~~~

* Start Verdaccio using following command
~~~bash
verdaccio
~~~

* Verdaccio dashboard can be access at ```http://localhost:4873/```

* Create user in Verdaccio - use following command anywhere in terminal
~~~bash
npm adduser --registry http://localhost:4873/
~~~
* add username, password and email. This can be used to login in future.
* To check whether login is successful execute following command [must repsonse with your username]
~~~bash
npm whoami --registry http://localhost:4873/
~~~

## Prepare library for publish in Verdaccio
* Optionally change the name of library in following path
~~~bash
my-app >> projects >> sample-lib >> package.json
~~~
* In the same file also note the version number, this version number must be updated with every new version of library
~~~json
{
  "name": "sample-lib",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^15.2.0",
    "@angular/core": "^15.2.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  },
  "sideEffects": false
}
~~~
* Build the library - ```cd``` into the library folder, in our case ```sample-lib``` and build the library using following command
~~~bash
ng build
~~~

* On successful compilation of library, you will receive following response. Note that compiled library code resides in dist folder [my-app >> dist >> sample-lib]
~~~bash
------------------------------------------------------------------------------
Built Angular Package
 - from: C:\Users\jay.siddhapura\projects\my-app\projects\sample-lib
 - to:   C:\Users\jay.siddhapura\projects\my-app\dist\sample-lib
------------------------------------------------------------------------------
~~~

## Publishing the library
* First of all you must me in the directory where compiled library resides [dist]
* In our case ```my-app >> dist >> sample-lib```
* Once you are in this directory execute following command
~~~bash
my-app\dist\sample-lib  >  npm publish --registry http://localhost:4873/
~~~
* Refresh the Verdaccio dashboard and if publishing is successful, you will see your library there.

## Consuming the library
* Published library can be consumed/installed simillar to any other npm library using ```npm install``` command
* Note: while performing the ```npm install```, please make sure you have Verdaccio registry defined in your ```.npmrc```
* Verdaccio install all the libraries defined in package.json, even if it is not available in your proxy library

## Verify installation of Library
* When ```npm install``` performed the ```package.json``` will be updated by your library declaration
~~~json
  "dependencies": {
    "@angular/animations": "^15.2.0",
    "@angular/common": "^15.2.0",
    "@angular/compiler": "^15.2.0",
    "@angular/core": "^15.2.0",
    "@angular/forms": "^15.2.0",
    "@angular/platform-browser": "^15.2.0",
    "@angular/platform-browser-dynamic": "^15.2.0",
    "@angular/router": "^15.2.0",
    "rxjs": "~7.8.0",
    "sample-lib": "^0.0.1", [our library]
    "tslib": "^2.3.0",
    "zone.js": "~0.12.0"
  },
~~~






