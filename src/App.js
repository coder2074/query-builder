import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery'; 
import odatajs from './ODataQueryBuilder/Scripts/odatajs-4.0.0.js';
//import './ODataQueryBuilder/Scripts/odata-query-builder.js';
//import OData from './ODataQueryBuilder/Scripts/odata-query-builder.js';
//import DataExplorer from './ODataQueryBuilder/Scripts/odata-query-builder.js';

//import * as duh from './ODataQueryBuilder/Scripts/odatajs-4.0.0.js';
import * as actions from './ODataQueryBuilder/Scripts/odata-query-builder.js';

// needed this to do global jquery for odata-query-builder.js
// real way to do this is eject from create react app and use the true webpack configuration to set global jquery 
window.$ = window.jQuery = require("jquery");

//var dummy = require('./ODataQueryBuilder/Scripts/odatajs-4.0.0.js');
//window.odatajs = dummy.

//window.odatajs = {};
//init.call(this,window.odatajs,window.odatajs,require);


//declare var OData: any;

class App extends Component {
     componentDidMount() {
         console.log('exampleComponent mounted');         

       {  $(document).ready(function () {
                    var jsonObj = new Object();
                    var obj1 = new Object();
                    obj1.name = 'Public';
                    obj1.url = 'http://services.odata.org/V4/Northwind/Northwind.svc/$metadata';
                    jsonObj.endpoints = [obj1];

                    var asdf = actions;
                    var createdQueryBuilder = new asdf.OData.explorer.DataExplorer(jsonObj);
                    //                            OData.explorer.DataExplorer
          })
        }
     }
    componentDidUpdate() {
         console.log('exampleComponent updated');         
     }
  render() {
    return (
      <html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    <title>OData Query Builder</title>

    <link type="text/css" href="./ODataQueryBuilder/Content/odata-query-builder.css" rel="stylesheet" />
</head>
<body>
 <div class="container">
      <div class='grid row'>
        <div class='col-sm-12 col-md-6'>
           <h1>OData Query Builder</h1>
           <div id="queryBuilderContainer"></div>
        </div>
      </div>
      
      <div class='grid row'>
        <div class='col-sm-12 col-md-6'>
          <div id="oData-grid"></div>
        </div>
      </div>
      
 </div>
</body>

</html>
    );
  }
}

export default App;
