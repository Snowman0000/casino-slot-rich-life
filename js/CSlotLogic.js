var s_aSession = new Array();

var NUM_ROWS = 3;
var NUM_REELS = 5;
var _aFinalSymbols = new Array();
var _aRandSymbols = new Array();
_aRandSymbols = _initSymbolsOccurence();
var _aPaylineCombo = new Array();
_aPaylineCombo = _initPaylines();
var _aSymbolWin = new Array();

var _iNumSymbolFreeSpin = 0;
var freeSpinDouble = 1;

function _initSettings(){
    s_aSession["iMoney"] = TOTAL_MONEY;                            //USER MONEY
    s_aSession["iSlotCash"] = SLOT_CASH;                       //SLOT CASH. IF USER BET IS HIGHER THAN CASH, USER MUST LOOSE.
    s_aSession["win_occurrence"] = WIN_OCCURRENCE;                    //WIN OCCURRENCE(FROM 0 TO 100)
    s_aSession["freespin_occurrence"] = FREESPIN_OCCURRENCE;               //IF USER MUST WIN, SET THIS VALUE FOR FREESPIN OCCURRENCE
    s_aSession["freespin_symbol_num_occur"] = FREESPIN_SYMBOL_NUM_OCCURR; //WHEN PLAYER GET FREESPIN, THIS ARRAY GET THE OCCURRENCE OF RECEIVING 3,4 OR 5 FREESPIN SYMBOLS IN THE WHEEL
    s_aSession["num_freespin"] = NUM_FREESPIN;                 //THIS IS THE NUMBER OF FREESPINS IF IN THE FINAL WHEEL THERE ARE 3,4 OR 5 FREESPIN SYMBOLS
    s_aSession["coin_bet"] = COIN_BET;
    
    _aSymbolWin = _initSymbolWin();
}

function checkLogin(){
    s_aSession["iTotFreeSpin"] = 0;
    s_aSession["bFreeSpin"] = 0;
    
    //STARTING MONEY
    _initSettings();
    _setMinWin();
    return _tryToCheckLogin();
}

function callSpin(iNumBettingLines,iCoin,iCurBet){
    return _onSpin(iNumBettingLines,iCoin,iCurBet);
}
    

function _tryToCheckLogin(){
    //THIS FUNCTION PASS USER MONEY FOR THE WHEEL
    var aTmp = new Array();
    for(var i=0; i<_aSymbolWin.length;i++){
        aTmp[i] = _aSymbolWin[i].join(",");
    }
    
    return "res=true&login=true&money="+s_aSession["iMoney"]+"&paytable="+
                                                            aTmp.join("#")+"&coin_bet="+s_aSession["coin_bet"].join("#");
}
    
function _setMinWin(){
    //FIND MIN WIN
    s_aSession["min_win"] = 9999999999999;
    for(var i=0;i<_aSymbolWin.length;i++){
        var aTmp = _aSymbolWin[i];
        for(var j=0;j<aTmp.length;j++){
            if(aTmp[j] !== 0 && aTmp[j] < s_aSession["min_win"]){
                s_aSession["min_win"] = aTmp[j];
            }
        }
    }
}

function _onSpin(iNumBettingLines,iCoin,iCurBet){
    //CHECK IF iCurBet IS < DI iMoney OR THERE IS AN INVALID BET
    if(iCurBet > s_aSession["iMoney"]){
        _dieError("INVALID BET: "+iCurBet+",money:"+s_aSession["iMoney"]);
        return;
    }
    
    $(s_oMain).trigger("bet_placed",{bet:iCoin,tot_bet:iCurBet});
    
    //DECREASING USER MONEY WITH THE CURRENT BET
    s_aSession["iMoney"] = s_aSession["iMoney"] - iCurBet;
    s_aSession["iSlotCash"] = s_aSession["iSlotCash"] + iCurBet;
    
    var bFreespin = 0;
    var freeSpinSetting = false;

    //IF SLOT CASH IS LOWER THAN MINIMUM WIN, PLAYER MUST LOSE
    if(s_aSession["iSlotCash"] < s_aSession["min_win"]*iCoin){
        //PLAYER MUST LOSE
        generLosingPattern();
        if(s_aSession["bFreeSpin"] === 1){
            s_aSession["iTotFreeSpin"] = s_aSession["iTotFreeSpin"] -1;

            if(s_aSession["iTotFreeSpin"] < 0){
                    s_aSession["iTotFreeSpin"] = 0;
                    s_aSession["bFreeSpin"] = 0;
            }
        }
        return "res=true&win=false&pattern="+JSON.stringify(_aFinalSymbols)+"&money="+s_aSession["iMoney"]+"&freespin="+s_aSession["iTotFreeSpin"]+
                                "&cash="+s_aSession["iSlotCash"];
    }

    var iRandOccur = Math.floor(Math.random()*100);
    var iRand;
    if(iRandOccur < s_aSession["win_occurrence"]){
            //WIN
            if(s_aSession["bFreeSpin"] === 0){
                    iRand = Math.floor(Math.random()*(101));

                    if(s_aSession["iTotFreeSpin"] === 0 && iRand < (s_aSession["freespin_occurrence"])){
                            //PLAYER GET FREESPIN
                            iRand = Math.floor(Math.random()*(s_aSession["freespin_occurrence"])+1);
                            
                            if(iRand <= s_aSession["freespin_occurrence"]){
                                    bFreespin = 1;
                                    freeSpinSetting = true;
                            }
                    }
            }

            var iPrizeReceived = -1;
            var iCont = 0;
            do{
                generateRandomSymbols(bFreespin);
                var aRet = checkWin(bFreespin,iNumBettingLines);
                var iTotWin = 0;
                for(var i=0;i<aRet.length;i++){
                    iTotWin += aRet[i]['amount'];
                }
                iTotWin *= iCoin;
                iPrizeReceived = -1;
                // if(bFreespin === 1 ){
                //     iTotWin += iCurBet * _aSymbolWin[9][_iNumSymbolFreeSpin - 1];
                // }
                iCont++;
            }while(aRet.length === 0);

            s_aSession["iMoney"] = s_aSession["iMoney"] + iTotWin; 
            s_aSession["iSlotCash"] = s_aSession["iSlotCash"] - iTotWin;

            //DECREASE FREESPIN NUMBER EVENTUALLY
            if(bFreespin === 1 && _iNumSymbolFreeSpin > 2){
                    s_aSession["bFreeSpin"] = 1;
                    s_aSession["iTotFreeSpin"] = s_aSession["num_freespin"][_iNumSymbolFreeSpin-3];
                    freeSpinDouble = 2;
            }else if(s_aSession["bFreeSpin"] === 1){
                    s_aSession["iTotFreeSpin"] = s_aSession["iTotFreeSpin"] -1;
                    for (var i=0; i<3; i++) {
                        for (var j=0; j<5; j++) {
                            if (_aFinalSymbols[i][j] === 11) {
                                freeSpinDouble ++;
                            }
                        }
                    }

                    if(s_aSession["iTotFreeSpin"] < 0){
                        s_aSession["iTotFreeSpin"] = 0;
                        s_aSession["bFreeSpin"] = 0;
                        freeSpinDouble = 1;
                    }
            }

            return "res=true&win=true&pattern="+JSON.stringify(_aFinalSymbols)+"&win_lines="+JSON.stringify(aRet)+"&money="+s_aSession["iMoney"]+
                    "&tot_win="+iTotWin+"&bFreeSpin="+freeSpinSetting+"&freespin="+s_aSession["iTotFreeSpin"]+"&cash="+s_aSession["iSlotCash"] ;
    } else {
            //LOSE
            generLosingPattern();
            if(s_aSession["bFreeSpin"] === 1){
                s_aSession["iTotFreeSpin"] = s_aSession["iTotFreeSpin"] -1;

                if(s_aSession["iTotFreeSpin"] < 0){
                        s_aSession["iTotFreeSpin"] = 0;
                        s_aSession["bFreeSpin"] = 0;
                }
            }
            return "res=true&win=false&pattern="+JSON.stringify(_aFinalSymbols)+"&money="+s_aSession["iMoney"]+"&freespin="+s_aSession["iTotFreeSpin"];
    }
}
	
function _initPaylines(){
    //STORE ALL INFO ABOUT PAYLINE COMBOS

    _aPaylineCombo[0] = [{row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[1] = [{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[2] = [{row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[3] = [{row:0,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[4] = [{row:2,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[5] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[6] = [{row:1,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[7] = [{row:0,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[8] = [{row:2,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[9] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[10] = [{row:2,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[11] = [{row:1,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[12] = [{row:1,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[13] = [{row:0,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[14] = [{row:2,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[15] = [{row:1,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[16] = [{row:1,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[17] = [{row:0,col:0},{row:2,col:1},{row:0,col:2},{row:2,col:3},{row:0,col:4}];
    _aPaylineCombo[18] = [{row:2,col:0},{row:0,col:1},{row:2,col:2},{row:0,col:3},{row:2,col:4}];
    _aPaylineCombo[19] = [{row:2,col:0},{row:0,col:1},{row:1,col:2},{row:0,col:3},{row:2,col:4}];

    return _aPaylineCombo;
};
	
function _initSymbolsOccurence(){
    var i;

    //OCCURENCE FOR SYMBOL 1
    for(i=0;i<1;i++){
        _aRandSymbols.push(1);
    }

    //OCCURENCE FOR SYMBOL 2
    for(i=0;i<1;i++){
        _aRandSymbols.push(2);
    }

    //OCCURENCE FOR SYMBOL 3
    for(i=0;i<1;i++){
        _aRandSymbols.push(3);
    }

    //OCCURENCE FOR SYMBOL 4
    for(i=0;i<1;i++){
        _aRandSymbols.push(4);
    }

    //OCCURENCE FOR SYMBOL 5
    for(i=0;i<1;i++){
        _aRandSymbols.push(5);
    }

    //OCCURENCE FOR SYMBOL 6
    for(i=0;i<1;i++){
        _aRandSymbols.push(6);
    }

    //OCCURENCE FOR SYMBOL 7
    for(i=0;i<1;i++){
        _aRandSymbols.push(7);
    }

    //OCCURENCE FOR SYMBOL 8 (WILD)
    for(i=0;i<1;i++){
        _aRandSymbols.push(8);
    }

    //OCCURENCE FOR SYMBOL 9
    for(i=0;i<2;i++){
        _aRandSymbols.push(9);
    }

     //OCCURENCE FOR SYMBOL 10 (FREESPIN)
    for(i=0;i<2;i++){
        _aRandSymbols.push(10);
    }

    for (i=0; i<1; i++) {
        _aRandSymbols.push(11);
    }

    return _aRandSymbols;
};

function _initSymbolWin(){
    _aSymbolWin[0] = PAYTABLE_VALUES[0];
    _aSymbolWin[1] = PAYTABLE_VALUES[1];
    _aSymbolWin[2] = PAYTABLE_VALUES[2];
    _aSymbolWin[3] = PAYTABLE_VALUES[3];
    _aSymbolWin[4] = PAYTABLE_VALUES[4];
    _aSymbolWin[5] = PAYTABLE_VALUES[5];
    _aSymbolWin[6] = PAYTABLE_VALUES[6];
    _aSymbolWin[7] = PAYTABLE_VALUES[7];
    _aSymbolWin[8] = PAYTABLE_VALUES[8];
    _aSymbolWin[9] = PAYTABLE_VALUES[9];
    _aSymbolWin[10] = [0, 0, 0, 0, 0];
    
    return _aSymbolWin;
};
    
	
function generLosingPattern(){
    var aFirstCol = new Array();
    for(var i=0;i<NUM_ROWS;i++){
        do{
            var iRandIndex = Math.floor(Math.random()*(_aRandSymbols.length));
            aFirstCol[i] = _aRandSymbols[iRandIndex];  
            if (i > 0 && aFirstCol[i] === aFirstCol[i-1]) {
                aFirstCol[i] = 0;
            }
            if (i > 1 && aFirstCol[i] === aFirstCol[i-2]) {
                aFirstCol[i] = 0;
            }
        }while(aFirstCol[i] === 0 || _aRandSymbols[iRandIndex] === 10 || _aRandSymbols[iRandIndex] === 11);
    }

    for(var i=0; i<NUM_ROWS; i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            if(j == 0){
                _aFinalSymbols[i][j] = aFirstCol[i];
            }else{
                do {
                    var iRandIndex =  Math.floor(Math.random()*_aRandSymbols.length);
                    iRandSymbol = _aRandSymbols[iRandIndex];
                    _aFinalSymbols[i][j] = iRandSymbol;			
                    if (i > 0 && _aFinalSymbols[i][j] === _aFinalSymbols[i-1][j]) {
                        iRandSymbol = 10;
                    }
                    if (i > 1 && _aFinalSymbols[i][j] === _aFinalSymbols[i-2][j]) {
                        iRandSymbol = 10;
                    }
                } while (aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol ||
                        iRandSymbol === 10 || iRandSymbol === 11);
            }  
        }
    }
};
	
function generateRandomSymbols(bFreespin){
    for(var i=0;i<NUM_ROWS;i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            var eCol = new Array();
            do{
                var iRandIndex = Math.floor(Math.random()*_aRandSymbols.length);
                iRandSymbol = _aRandSymbols[iRandIndex];
                _aFinalSymbols[i][j] = iRandSymbol;
                if (i > 0 && _aFinalSymbols[i][j] === _aFinalSymbols[i-1][j]) {
                    iRandSymbol = 10;
                }
                if (i > 1 && _aFinalSymbols[i][j] === _aFinalSymbols[i-2][j]) {
                    iRandSymbol = 10;
                }
            }while(iRandSymbol === 10);
        }
    }

    if(bFreespin === 1){
        //DECIDE HOW NAMY FREESPIN SYMBOL MUST APPEAR( MINIMUM 3, MAX 5)
        var aTmp = new Array();
        for(i=0;i<s_aSession["freespin_symbol_num_occur"].length;i++){
            for(j=0;j<s_aSession["freespin_symbol_num_occur"][i];j++){
                aTmp.push(i);
            }
        }

        var iRand =  Math.floor(Math.random()*aTmp.length);
        _iNumSymbolFreeSpin = 2 + aTmp[iRand];

        var aCurReel = [0,1,2,3,4];
        aCurReel = shuffle ( aCurReel );
        for(var k=0;k<_iNumSymbolFreeSpin;k++){
            var wild = false;
            for (var i=0; i<3; i++) {
                if (_aFinalSymbols[i][aCurReel[k]] === 11) {
                    wild = true;
                }
            }
            if (!wild) {
                var iRandRow = Math.floor(Math.random()*3);
                _aFinalSymbols[iRandRow][aCurReel[k]] = 10;
            }
        }
    }
}
	
    function checkWin(bFreespin,iNumBettingLines){
        //CHECK IF THERE IS ANY COMBO
        var _aWinningLine = new Array();

        for(var k=0;k<iNumBettingLines;k++){
            var aCombos = _aPaylineCombo[k];

            var aCellList = new Array();
            var iValue = _aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']];

            var iNumEqualSymbol = 1;
            var iStartIndex = 1;
            var doublePay = 1;
            
            aCellList.push({row:aCombos[0]['row'],col:aCombos[0]['col'],value:_aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']]} );

            while(iValue === 11 && iStartIndex<NUM_REELS){
                iNumEqualSymbol++;
                iValue = _aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']];
                doublePay = 2;

                aCellList.push( {row: aCombos[iStartIndex]['row'] ,col:aCombos[iStartIndex]['col'] ,value:_aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']]} );
                iStartIndex++;
            }
            
            for(var t=iStartIndex;t<aCombos.length;t++){
                if(_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === iValue || 
                                            _aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === 11){
                    iNumEqualSymbol++;

                    if (_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === 11) {
                        doublePay = 2;
                    }
                    
                    aCellList.push({row:aCombos[t]['row'],col:aCombos[t]['col'],value:_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']]} );
                }else{
                    break;
                }
            }
            
            if(_aSymbolWin[iValue-1][iNumEqualSymbol-1] > 0){
                _aWinningLine.push({line:k+1,amount:_aSymbolWin[iValue-1][iNumEqualSymbol-1]*doublePay*freeSpinDouble,num_win:iNumEqualSymbol,value:iValue,list:aCellList});
            }
        }
        
        if(bFreespin === 1){
            aCellList = new Array();
            _iNumSymbolFreeSpin = 0;
            for(var i=0;i<NUM_ROWS;i++){
                for(var j=0;j<NUM_REELS;j++){
                    if(_aFinalSymbols[i][j] === 10 || _aFinalSymbols[i][j] === 11){
                        aCellList.push({row:i,col:j,value:_aFinalSymbols[i][j]});
                        _iNumSymbolFreeSpin ++;
                    }
                }
            }

            if(_aSymbolWin[9][_iNumSymbolFreeSpin-1] > 0 && aCellList.find(cell => cell.value === 10)){
                _aWinningLine.push({line:0,amount:_aSymbolWin[9][_iNumSymbolFreeSpin-1],num_win:aCellList.length,value:10,list:aCellList});
            } else {
                _iNumSymbolFreeSpin = 0;
            }
        }
        
        let l = 0;
        for (l = 0; l < _aWinningLine.length; l++) {
            if (_aWinningLine[l].value === 10 && _aWinningLine[l].line > 0) {
                _aWinningLine.splice(l, 1);
                l --;
            }
        }

        return _aWinningLine;
    }

    function shuffle(aArray){
        for(var j, x, i = aArray.length; i; j = Math.floor(Math.random() * i), x = aArray[--i], aArray[i] = aArray[j], aArray[j] = x);
        return aArray;
    }

    function _dieError( szReason){
        return "res=false&desc="+szReason;
    }	