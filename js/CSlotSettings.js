function CSlotSettings(){
    
    this._init = function(){
        this._initSymbolSpriteSheets();
        this._initPaylines();
        this._initSymbolsOccurence();
    };
    
    this._initSymbolSpriteSheets = function(){
        s_aSymbolData = new Array();
        for(var i=1;i<NUM_SYMBOLS+1;i++){
            var oData = {   // image to use
                images: [s_oSpriteLibrary.getSprite('symbol_'+i)], 
                frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
                animations: { static: [0, 1], moving:[1, 2] }
            };

            s_aSymbolData[i] = new createjs.SpriteSheet(oData);
        }
        var tData = {
            images: [ s_oSpriteLibrary.getSprite('ticker') ],
            frames: { width: 1154, height: 31, regX: 0, regY: 0},
            animations: { static: [0, 1], moving: [0, 1]}
        }
        t_aSymbolAnim = new createjs.SpriteSheet(tData);
    };
    
    this._initPaylines = function() {
        //STORE ALL INFO ABOUT PAYLINE COMBOS
        s_aPaylineCombo = new Array();
        
        s_aPaylineCombo[0] = [{row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:0,col:4}];
        s_aPaylineCombo[1] = [{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:1,col:4}];
        s_aPaylineCombo[2] = [{row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:2,col:4}];
        s_aPaylineCombo[3] = [{row:0,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:0,col:4}];
        s_aPaylineCombo[4] = [{row:2,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:2,col:4}];
        s_aPaylineCombo[5] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:1,col:4}];
        s_aPaylineCombo[6] = [{row:1,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
        s_aPaylineCombo[7] = [{row:0,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:2,col:4}];
        s_aPaylineCombo[8] = [{row:2,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:0,col:4}];
        s_aPaylineCombo[9] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
        s_aPaylineCombo[10] = [{row:2,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:2,col:4}];
        s_aPaylineCombo[11] = [{row:1,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:1,col:4}];
        s_aPaylineCombo[12] = [{row:1,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:1,col:4}];
        s_aPaylineCombo[13] = [{row:0,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:0,col:4}];
        s_aPaylineCombo[14] = [{row:2,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:2,col:4}];
        s_aPaylineCombo[15] = [{row:1,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:1,col:4}];
        s_aPaylineCombo[16] = [{row:1,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:1,col:4}];
        s_aPaylineCombo[17] = [{row:0,col:0},{row:2,col:1},{row:0,col:2},{row:2,col:3},{row:0,col:4}];
        s_aPaylineCombo[18] = [{row:2,col:0},{row:0,col:1},{row:2,col:2},{row:0,col:3},{row:2,col:4}];
        s_aPaylineCombo[19] = [{row:2,col:0},{row:0,col:1},{row:1,col:2},{row:0,col:3},{row:2,col:4}];
    };
    
    this.initSymbolWin = function(szSymbolWin){
        var aSplit = szSymbolWin.split("#");
        
        s_aSymbolWin = new Array();
        
        for(var i=0;i<aSplit.length;i++){
            var aWins = aSplit[i].split(",");
            s_aSymbolWin[i] = new Array();
            for(var j=0;j<aWins.length;j++){
                s_aSymbolWin[i][j] = parseFloat(aWins[j]);
            }
        }
    };
    
    this._initSymbolsOccurence = function(){
        s_aRandSymbols = new Array();
        
        var i;
        //OCCURENCE FOR SYMBOL 1
        for(i=0;i<1;i++){
            s_aRandSymbols.push(1);
        }
        
        //OCCURENCE FOR SYMBOL 2
        for(i=0;i<1;i++){
            s_aRandSymbols.push(2);
        }
        
        //OCCURENCE FOR SYMBOL 3
        for(i=0;i<1;i++){
            s_aRandSymbols.push(3);
        }
        
        //OCCURENCE FOR SYMBOL 4
        for(i=0;i<1;i++){
            s_aRandSymbols.push(4);
        }
        
        //OCCURENCE FOR SYMBOL 5
        for(i=0;i<1;i++){
            s_aRandSymbols.push(5);
        }
        
        //OCCURENCE FOR SYMBOL 6
        for(i=0;i<1;i++){
            s_aRandSymbols.push(6);
        }
        
        //OCCURENCE FOR SYMBOL 7
        for(i=0;i<1;i++){
            s_aRandSymbols.push(7);
        }
        
        //OCCURENCE FOR SYMBOL WILD
        for(i=0;i<1;i++){
            s_aRandSymbols.push(8);
        }
        
        //OCCURENCE FOR SYMBOL
        for(i=0;i<1;i++){
            s_aRandSymbols.push(9);
        }
        
        //OCCURENCE FOR SYMBOL FREESPIN
        for(i=0;i<1;i++){
            s_aRandSymbols.push(10);
        }

        //OCCURENCE FOR SYMBOL 11
        for(i=0;i<1;i++){
            s_aRandSymbols.push(11);
        }
    };
    
    this._init();
}

var s_aSymbolData;
var s_aPaylineCombo;
var s_aSymbolWin;
var s_aRandSymbols;
var t_aSymbolAnim;