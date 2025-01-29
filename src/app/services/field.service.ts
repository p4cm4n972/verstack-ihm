import { Injectable } from '@angular/core';
import { Field } from '../models/field.model';
import { map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor() { }
  getField(): Observable<Field[]> {
    // TODO  Retournez la liste réelle des langages depuis une API ou une source de données
    return of([
      {
        domaine: 'web',
        languages: [
          {
            name: 'Node  JS',
            logoUrl: '../../../../assets/images/node.svg',
            websiteUrl:
              'https://nodejs.org',
            lts: "22.12.00",
            current: "23.04.00"
          },
          {
            name: 'JavaScript',
            logoUrl: '../../../../assets/images/javascript.png',
            websiteUrl:
              'https://ecma-international.org/publications-and-standards/standards/ecma-262/',
            edition: '15'
          },
          {
            name: 'HTML',
            logoUrl: '../../../../assets/images/html.png',
            websiteUrl:
              'https://html.spec.whatwg.org/multipage/',
            living_standard: "23/10/2024"
          },
          {
            name: 'CSS',
            logoUrl: '../../../../assets/images/css.png',
            websiteUrl:
              'https://www.w3.org/Style/CSS/',
            living_standard: "24/10/2024"
          },
          {
            name: 'TypeScript',
            logoUrl: '../../../../assets/images/ts.png',
            websiteUrl:
              'https://www.typescriptlang.org/',
            edition: '5.7'
          },
          {
            name: 'Vue.js',
            logoUrl: '../../../../assets/images/vuejs.png',
            websiteUrl:
              'https://vuejs.org/',
            edition: '3.5.13',
          },
          {
            name: 'Angular',
            logoUrl: '../../../../assets/images/angular.png',
            websiteUrl:
              'https://angular.dev/',
            current: '19.0.0',
            lts: '18.0.0'
          },
          {
            name: 'React',
            logoUrl: '../../../../assets/images/react.png',
            websiteUrl:
              'https://react.dev/',
            edition: '19.0.0'
          },
          {
            name: 'Python',
            logoUrl: '../../../../assets/images/python.png',
            websiteUrl:
              'https://www.python.org/',
            lts: "03.12",
            current: "03.13.0"
          },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
          {
            name: 'PHP',
            logoUrl: '../../../../assets/images/php.png',
            websiteUrl:
              'https://www.php.net/',
            edition: '8.4.1'
          },
          {
            name: 'Ruby',
            logoUrl: '../../../../assets/images/ruby.png',
            websiteUrl:
              'https://www.ruby-lang.org/fr/',
            edition: '3.1.1'
          },
          {
            name: 'C#',
            logoUrl: '../../../../assets/images/cs.png',
            websiteUrl:
              'https://dotnet.microsoft.com/fr-fr/languages/csharp',
              edition: '9'
          },
          {
            name: 'SwiftUI',
            logoUrl: '../../../../assets/images/swiftui.png',
            websiteUrl:
              'https://developer.apple.com/swift/',
              edition: '16.2'
          },
          {
            name: 'Go',
            logoUrl: '../../../../assets/images/go.png',
            websiteUrl:
              'https://go.dev',
              edition: '1.23.4'
          },
          {
            name: 'Dart',
            logoUrl: '../../../../assets/images/dart.png',
            websiteUrl:
              'https://dart.dev/',
              edition: '3.6'
          },
          {
            name: 'Scala',
            logoUrl: '../../../../assets/images/scala.png',
            websiteUrl:
              'https://www.scala-lang.org/',
              lts: '3.3.4',
              current: '3.6.2'
          },
          {
            name: 'Rust',
            logoUrl: '../../../../assets/images/rust.png',
            websiteUrl:
              'https://www.rust-lang.org/',
              edition: '1.83.0'
          },
          {
            name: 'Kotlin',
            logoUrl: '../../../../assets/images/kotlin.png',
            websiteUrl:
              'https://kotlinlang.org/',
              edition: '2.1.0'
          },
          {
            name: 'Objective-C',
            logoUrl: '../../../../assets/images/objectivec.png',
            websiteUrl: 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html',
            living_standard: "17/09/2014"
          },
          {
            name: 'Perl',
            logoUrl: '../../../../assets/images/perl.png',
            websiteUrl:
              'https://www.perl.org/',
              edition: '5.40.0'
          },

        ],
      },
      /* { name: "Shell", logoUrl: '../../../../assets/images/angular.png', websiteUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: "SQL", logoUrl: '../../../../assets/images/angular.png', websiteUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },*/
      {
        domaine: 'mobile',
        languages: [
          {
            name: 'Swift',
            logoUrl: '../../../../assets/images/swift.png',
            websiteUrl: 'https://www.swift.org/',
            edition: '6.0.3'
          },
          {
            name: 'Kotlin',
            logoUrl: '../../../../assets/images/kotlin.png',
            websiteUrl: 'https://kotlinlang.org/',
            edition: '2.1.0'
          },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
          {
            name: 'Flutter',
            logoUrl: '../../../../assets/images/flutter.png',
            websiteUrl: 'https://flutter.dev/',
            edition: '3.27.1'
          },
          {
            name: 'Objective-C',
            logoUrl: '../../../../assets/images/objectivec.png',
            websiteUrl: 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html',
            living_standard: "17/09/2014"
          },
          {
            name: 'C#',
            logoUrl: '../../../../assets/images/cs.png',
            websiteUrl:
              'https://dotnet.microsoft.com/fr-fr/languages/csharp',
              edition: '9'
          },
          {
            name: 'React Native',
            logoUrl: '../../../../assets/images/react.png',
            websiteUrl: 'https://reactnative.dev/',
            edition: '0.76'
          },
         // { name: 'Cordova', logoUrl: '../../../../assets/images/cordova.png', websiteUrl: 'https://cordova.apache.org/' },
          { name: 'Kivy', logoUrl: '../../../../assets/images/kivy.png', websiteUrl: 'https://kivy.org/', edition: '2.3.1' },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
         // { name: 'Qt', logoUrl: '../../../../assets/images/qt.png', websiteUrl: 'https://www.qt.io/' },
          { name: 'NativeScript', logoUrl: '../../../../assets/images/nativescript.png', websiteUrl: 'https://nativescript.org/', edition: '8.8.6'},
          {
            name: 'Rust',
            logoUrl: '../../../../assets/images/rust.png',
            websiteUrl:
              'https://www.rust-lang.org/',
              edition: '1.83.0'
          },
          {
            name: 'Go',
            logoUrl: '../../../../assets/images/go.png',
            websiteUrl:
              'https://go.dev',
              edition: '1.23.4'
          },
          {
            name: 'Scala',
            logoUrl: '../../../../assets/images/scala.png',
            websiteUrl:
              'https://www.scala-lang.org/',
              lts: '3.3.4',
              current: '3.6.2'
          },
          {
            name: 'SwiftUI',
            logoUrl: '../../../../assets/images/swiftui.png',
            websiteUrl:
              'https://developer.apple.com/swift/',
              edition: '16.2'
          },
         // { name: 'JavaFX', logoUrl: '../../../../assets/images/javafx.png', websiteUrl: '' },
          {
            name: 'Xamarin',
            logoUrl: '../../../../assets/images/xamarin.png',
            websiteUrl: 'https://dotnet.microsoft.com/en-us/apps/xamarin',
            edition: '5.0.0.2662',
            end: true
          },
        ],
      },
      {
        domaine: 'embarque',
        languages: [
          { name: 'C', logoUrl: '../../../../assets/images/c.png', websiteUrl: 'https://www.open-std.org/jtc1/sc22/wg14/', standard_revision: 'C23' },
          { name: 'C++', logoUrl: '../../../../assets/images/cpp.png', websiteUrl: 'https://isocpp.org/', standard_revision: 'C++23' },
          {
            name: 'Python',
            logoUrl: '../../../../assets/images/python.png',
            websiteUrl:
              'https://www.python.org/',
            lts: "03.12",
            current: "03.13.0"
          },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
          {
            name: 'Rust',
            logoUrl: '../../../../assets/images/rust.png',
            websiteUrl:
              'https://www.rust-lang.org/',
              edition: '1.83.0'
          },
          {
            name: 'Go',
            logoUrl: '../../../../assets/images/go.png',
            websiteUrl:
              'https://go.dev',
              edition: '1.23.4'
          },
          { name: 'Matlab/Simulink', logoUrl: '../../../../assets/images/matlab.png', websiteUrl: 'https://fr.mathworks.com/products/matlab.html', edition: 'R2024b' },
          { name: 'Julia', logoUrl: '../../../../assets/images/julia.png', websiteUrl: 'https://julialang.org/', lts: '1.10', current: '1.11' },
         // { name: 'Assembly', logoUrl: '', websiteUrl: '' },
          // { name: 'Ada', logoUrl: '', websiteUrl: '' },
          {
            name: 'C#',
            logoUrl: '../../../../assets/images/cs.png',
            websiteUrl:
              'https://dotnet.microsoft.com/fr-fr/languages/csharp',
              edition: '9'
          },
          {
            name: 'Swift',
            logoUrl: '../../../../assets/images/swift.png',
            websiteUrl: 'https://www.swift.org/',
            edition: '6.0.3'
          },
          { name: 'FreeRTOS', logoUrl: '../../../../assets/images/freertos.png', websiteUrl: 'https://www.freertos.org/' , edition: '11.1.0'},
          { name: 'Arduino Language', logoUrl: '../../../../assets/images/arduino.png', websiteUrl: 'https://docs.arduino.cc/programming/' , edition: '2.3.4'},
          { name: 'Micropython', logoUrl: '../../../../assets/images/micropython.png', websiteUrl: 'https://micropython.org/', edition: '1.24.0' },
          { name: 'Particle', logoUrl: '../../../../assets/images/particle.png', websiteUrl: 'https://www.particle.io/',edition: '6.1.1' },
         // { name: 'Mbed (C++)', logoUrl: '', websiteUrl: '' },
          { name: 'Elixir (Nerves)', logoUrl: '../../../../assets/images/nerves.svg', websiteUrl: 'https://nerves-project.org/', edition: '1.11.3' },
          { name: 'ChibiOS', logoUrl: '../../../../assets/images/chibios.png', websiteUrl: 'https://chibios.org/dokuwiki/doku.php', edition: '21.11.03' },
          { name: 'Zephyr', logoUrl: '../../../../assets/images/zephyr.svg', websiteUrl: 'https://docs.zephyrproject.org/latest/index.html', edition: '4.0.99' },
        ],
      },
      {
        domaine: 'data',
        languages: [
          {
            name: 'Python',
            logoUrl: '../../../../assets/images/python.png',
            websiteUrl:
              'https://www.python.org/',
            lts: "03.12",
            current: "03.13.0"
          },
          { name: ' R', logoUrl: '../../../../assets/images/r.png', websiteUrl: 'https://www.r-project.org/', edition: '4.4.2' },
          { name: 'Julia', logoUrl: '../../../../assets/images/julia.png', websiteUrl: 'https://julialang.org/', lts: '1.10', current: '1.11' },
          { name: 'SQL', logoUrl: '../../../../assets/images/sql.png', websiteUrl: 'https://www.iso.org/standard/76583.html', standard_revision: '60.60' },
          {
            name: 'Scala',
            logoUrl: '../../../../assets/images/scala.png',
            websiteUrl:
              'https://www.scala-lang.org/',
              lts: '3.3.4',
              current: '3.6.2'
          },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
          { name: 'Matlab', logoUrl: '../../../../assets/images/matlab.png', websiteUrl: 'https://fr.mathworks.com/products/matlab.html', edition: 'R2024b' },
          {
            name: 'JavaScript',
            logoUrl: '../../../../assets/images/javascript.png',
            websiteUrl:
              'https://ecma-international.org/publications-and-standards/standards/ecma-262/',
            edition: '15'
          },
          // { name: ' SAS', logoUrl: '../../../../assets/images/sas.jpg', websiteUrl: 'https://www.sas.com/en_us/home.html' },
          {
            name: 'Go',
            logoUrl: '../../../../assets/images/go.png',
            websiteUrl:
              'https://go.dev',
              edition: '1.23.4'
          },
          {
            name: 'Perl',
            logoUrl: '../../../../assets/images/perl.png',
            websiteUrl:
              'https://www.perl.org/',
              edition: '5.40.0'
          },
        //  { name: 'Shell', logoUrl: '', websiteUrl: '' },
          { name: ' Haskell', logoUrl: '../../../../assets/images/haskell-logo.svg', websiteUrl: 'https://www.haskell.org/', edition: '8.10.7' },
          {
            name: 'Scala',
            logoUrl: '../../../../assets/images/scala.png',
            websiteUrl:
              'https://www.scala-lang.org/',
              lts: '3.3.4',
              current: '3.6.2'
          },
          {
            name: 'TensorFlow',
            logoUrl: '../../../../assets/images/tensorflow.svg',

            websiteUrl: 'https://www.tensorflow.org/',
            edition: 'r2.17'
          },
          {
            name: 'PyTorch',
            logoUrl: '../../../../assets/images/pytorch.svg',
            websiteUrl: 'https://pytorch.org/',
            edition: '2.5'
          },
          {
            name: 'Scikit-Learn',
            logoUrl: '../../../../assets/images/scikit-learn-logo-small.png',
            websiteUrl: 'https://scikit-learn.org/stable/',
            edition: '1.6.1'
          },
          {
            name: 'Pandas',
            logoUrl: '../../../../assets/images/pandas_white.svg',
            websiteUrl: 'https://pandas.pydata.org/',
            edition: '2.2.3'
          },
          {
            name: 'Numpy',
            logoUrl: '../../../../assets/images/numpy.svg',
            websiteUrl: 'https://numpy.org/',
            edition: '2.2'
          },
        ],
      },
      {
        domaine: 'ia',
        languages: [
          {
            name: 'Python',
            logoUrl: '../../../../assets/images/python.png',
            websiteUrl:
              'https://www.python.org/',
            lts: "03.12",
            current: "03.13.0"
          },
          { name: ' R', logoUrl: '../../../../assets/images/r.png', websiteUrl: 'https://www.r-project.org/', edition: '4.4.2' },
          {
            name: 'Java',
            logoUrl: '../../../../assets/images/java.png',
            websiteUrl:
              'https://dev.java/',
              lts: '21',
              current: '23'
          },
          {
            name: 'Scala',
            logoUrl: '../../../../assets/images/scala.png',
            websiteUrl:
              'https://www.scala-lang.org/',
              lts: '3.3.4',
              current: '3.6.2'
          },
          {
            name: 'JavaScript',
            logoUrl: '../../../../assets/images/javascript.png',
            websiteUrl:
              'https://ecma-international.org/publications-and-standards/standards/ecma-262/',
            edition: '15'
          },
          { name: 'C++', logoUrl: '../../../../assets/images/cpp.png', websiteUrl: 'https://isocpp.org/', standard_revision: 'C++23' },
          { name: 'Julia', logoUrl: '../../../../assets/images/julia.png', websiteUrl: 'https://julialang.org/', lts: '1.10', current: '1.11' },
          {
            name: 'Go',
            logoUrl: '../../../../assets/images/go.png',
            websiteUrl:
              'https://go.dev',
              edition: '1.23.4'
          },
          {
            name: 'Swift',
            logoUrl: '../../../../assets/images/swift.png',
            websiteUrl: 'https://www.swift.org/',
            edition: '6.0.3'
          },
          {
            name: 'C#',
            logoUrl: '../../../../assets/images/cs.png',
            websiteUrl:
              'https://dotnet.microsoft.com/fr-fr/languages/csharp',
              edition: '9'
          },
          {
            name: 'TensorFlow',
            logoUrl: '../../../../assets/images/tensorflow.svg',

            websiteUrl: 'https://www.tensorflow.org/',
            edition: 'r2.17'
          },
          {
            name: 'PyTorch',
            logoUrl: '../../../../assets/images/pytorch.svg',
            websiteUrl: 'https://pytorch.org/',
            edition: '2.5'
          },
          {
            name: 'Scikit-Learn',
            logoUrl: '../../../../assets/images/scikit-learn-logo-small.png',
            websiteUrl: 'https://scikit-learn.org/stable/',
            edition: '1.6.1'
          },
          {
            name: 'Keras',
            logoUrl: '../../../../assets/images/keras.png',
            websiteUrl: 'https://keras.io/',
            edition: '3.0'
          },
          {
            name: 'Theano',
            logoUrl: '../../../../assets/images/theano.svg',
            websiteUrl: 'https://pypi.org/project/Theano/',
            edition: '1.0.5'
          },
          {
            name: 'MXNet',
            logoUrl: '../../../../assets/images/mxnet_logo.png',
            websiteUrl: 'https://mxnet.apache.org/versions/1.9.1/',
            edition: '1.9.1'
          },
          {
            name: 'H2O.ai',
            logoUrl: '../../../../assets/images/h2o-logo.svg',
            websiteUrl: 'https://h2o.ai/',
          },
          {
            name: 'IBM Watson',
            logoUrl: '../../../../assets/images/watson.png',
            websiteUrl: 'https://www.ibm.com/watson',
          },
          {
            name: 'Microsoft Azure ML',
            logoUrl: '../../../../assets/images/msaml.jpg',
            websiteUrl: 'https://azure.microsoft.com/en-us/products/machine-learning/',
          },
        ],
      },
    ]);
  }

  getDataByField(domaine: string): Observable<Field[]> {
    return this.getField().pipe(
      map((data) => {
        return data.filter((item) => { return item.domaine === domaine })
      })
    )
  }

  getImages(): Observable<string[]> {
    return this.getField().pipe(
      map((data) => {
        return data.flatMap(item => item.languages
          .filter(lang => lang.logoUrl)
          .map(lang => lang.logoUrl))
      })
    )
  }
}

