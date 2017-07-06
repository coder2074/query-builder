var oDataForm = {
    _properties: {property: []},
    _expandOn: [],
    _FIELDDATAMAP: {
        'Edm.Int32': 'int',
        'Edm.Decimal': 'float',
        'Edm.String': 'string',
        'Edm.DateTimeOffset': 'date',
        'Edm.Boolean': 'bool'
    },

    doIt(meta, selectedType, url, authHash, data) {
        var _that = this;
        _that._ENTITYTYPE = selectedType;
        _that._properties = {property: []};
        _that._expandOn = [];
        
        var _that = this;

        var _ds = meta.dataServices.schema[0];
        var _r = odatajs.oData.utils.lookupEntityType('PlatformForScience.' + _that._ENTITYTYPE, _ds);

        //find all entity properties/nav properties from child > grand parents
        _that.findEntityProperties(_ds, _r);

        // Maps datatypes to columns
        for(var n=0;n<_that._properties.property.length;n++){
            _that._properties.property[n].type =  _that._FIELDDATAMAP[_that._properties.property[n].type] || 'Object' ;
        }

       _that.pulloDataRecords(url, authHash);
    },

    handleNavProperty: function(__scheme, __nav, __baseType){
        for(var n=0; n<__nav.length; n++){
            this._properties.property.push({'name': __nav[n].name, 'type': __nav[n].type, 'base': __baseType});
        }
    },

    handleEntityProperty: function(__schema, __entity, __order, __baseType){
        var _tmpArray = [];
        for(var n=0; n<__entity.property.length; n++){
            var _prop = __entity.property[n];
            _tmpArray.push({'name': _prop.name, 'type': _prop.type, 'base': __baseType});
        }

        if(__order){
            //Add parent columns to beginning of array
            var _newArray = _tmpArray.concat(this._properties.property);
            this._properties.property = _newArray.slice(0);
        } else {
            this._properties.property = _tmpArray.slice(0);
        }

    },

    //schema => XML object, propObj => property object for entity, order => flag for parent entity property
    findEntityProperties: function(__schema, __propObj, __order){

        if(!__propObj.baseType){
            __baseType = this._ENTITYTYPE;
        } else {
            //console.log(__propObj.baseType);
            __baseType = __propObj.baseType;
        }

        if(__propObj.property){
            this.handleEntityProperty(__schema, __propObj, __order, __baseType);
        }

        if(__propObj.navigationProperty ){
            this.handleNavProperty(__schema, __propObj.navigationProperty,  __baseType);
        }
        //console.log(this.properties);

        if(__propObj.baseType){
            this.findEntityProperties(__schema, odatajs.oData.utils.lookupEntityType('PlatformForScience.'+__propObj.baseType.substr(4), __schema), true);
        }

    },

    pulloDataRecords: function(__url, authHash){
        // $count=true
        //__url = 'http://rmacci.corelims.com:8080/pfs/NAPAGILD52/odata/ENTITY/pfs.CAR?$count=true&$filter=CI_CAR_COLOR eq \'RED\'';


        var newUrl = __url.replace("$top", "W3Schools");
        newUrl = newUrl + '&$count=true';
        __url = newUrl;

        var _that = this;
        var _pageSize = $('#limit').val() || 200; // used for pageSize and limit
        $('#submit-btn').addClass('hidden');
        $('#wait-submit-btn').removeClass('hidden');
        $('#oData-grid div').remove();  
        $('#displayJson').empty();

        // Create basic Ext Grid Panel
        
        // Empty Ext Model
        var oDataModel = Ext.create('Ext.data.Model',{
            fields: []
        });

        var oDataStore = Ext.create('Ext.data.BufferedStore', {
            storeId: 'simpsonsStore',
            autoLoad: false,
            model: oDataModel,
            trailingBufferZone: 200, 
            leadingBufferedZone: 200, 
            pageSize: _pageSize,
            
            proxy:{  
                type: 'rest',
                url: __url,

                // url: 'ext-app/resources/BeerSampleLotLocation.json',
                pageParam: false, //to remove param "page"
                //pageParam: "$skiptoken",
                startParam: false, //to remove param "start"
                startParam: "$skip",
                limitParam: false,
                limitParam: "$top",
                noCache: false, //to remove param "_dc"

                method: 'GET',
                withCredentials: true,
                //pageNum: 0,
                headers : {
                    "Content-Type": "text/json",
                    "Prefer": "odata.maxpagesize=99999999",
                    "authorization": authHash           
                },
                // buildUrl: function(__request) {
                //     var _that = this;
                //     url =  _that.getUrl(__request);
                //     //url += '&$skiptoken=' + _that.pageNum;  
                //     return url
                // },
                reader:{
                    type:'json',
                    rootProperty: 'value',
                    totalProperty: 'total',
                    transform: {
                      fn: function(data) { 
                        data.total = data['@odata.count'];
                        //oDataGrid.getStore().getProxy().pageNum++;
                        return data;
                      }
                    }
                },
                listeners: {
                    exception: function(proxy, response, operation, eOpts) {
                        console.log("EXCEPTION ",response);
                    }
                }
            }

        });
       

        // Create Basic Ext Grid
        var oDataGrid = Ext.create('Ext.grid.Panel', {
            title: 'ExtJS Results',
            store: oDataStore,
            height: 450,
            loadMask: true,
            selModel: {
              pruneRemoved: false
            },
            renderTo: 'oData-grid'
        });

        // TODO: Add the model back in 
        // oDataStore.model.addFields(_that._properties.property);

        // Add columns to the data grid
        _that.buildColumns(_that._properties.property, oDataGrid);

        // Check to see it limit is passed in
        // if(oDataGrid.getStore().getProxy().url.indexOf("$top") > -1){
        //     oDataGrid.getStore().pageSize = _pageSize;
        //     oDataGrid.getStore().leadingBufferedZone = _pageSize;
        // }
        

        oDataGrid.getStore().load({
          callback: function(records, operation, success) {
      
            var output = '';
            if(records.length > 0){
                records.forEach( function (arrayItem){
                    output += JSON.stringify(arrayItem.data);    
                }); 
            } else {
                output = "No records where found to match this query";
                $('#oData-grid div').remove();  
            }

            $('#submit-btn').removeClass('hidden');
            $('#wait-submit-btn').addClass('hidden');
     //       $('#displayJson').html(output).removeClass('hidden');
          }
        });
    },

    buildColumns: function(__cols,_bGrid){
        var _that = this;

        console.log('Running buildColumns');

        // Add the row number first
        _bGrid.headerCt.insert(_bGrid.columns.length - 1,{ xtype: 'rownumberer', width: 50 });
        var _column = '';

        for (var n=0; n<__cols.length; n++) {
            //console.log(__cols[n].name);
            _column = Ext.create('Ext.grid.column.Column', {
                text: __cols[n].name,
                width: 100,
                dataIndex: __cols[n].name,
                filter: true,
                renderer:  function(__value){
                    var _val = '';

                    if(__value instanceof Array){
                      for(var i = 0; i < __value.length; i++){
                          _val += __value[i].Barcode + "<br>";
                      }
                    } else if (__value instanceof Object){
                        if(!(__value instanceof Date)){
                            _val = __value.Barcode + "<br>";
                        }else{
                            _val = __value;
                        }
                    } else {
                        _val = __value;
                    }

                  return _val;
                }
            });
            //Creating the dynamic grid column...
            //THE MOST IMPORTANT PIECE
            _bGrid.headerCt.insert(_bGrid.columns.length - 1, _column); //inserting the dynamic column into grid

        }
        //console.log(_bGrid.getView());
        //_bGrid.getStore().load();
    }

};