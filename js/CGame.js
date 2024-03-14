function CGame(oData){
    var _bUpdate = false;
    var _bReadyToStop = false;
    var _bAutoSpin;
    var _iCurState;
    var _iCurReelLoops;
    var _iNextColToStop;
    var _iNumReelsStopped;
    var _iLastLineActive;
    var _iTimeElaps;
    var _iCurWinShown;
    var _iCurBet;
    var _iTotBet;
    var _iMoney;
    var _iTotWin;
    var _iTotFreeSpin;
    var _iCurCoinIndex;
    var _iNumSpinCont;
    var _aMovingColumns;
    var _aStaticSymbols;
    var _aWinningLine;
    var _aReelSequence;
    var _aFinalSymbolCombo;
    var _aFinalScatterCombo;
    var _oBg;
    var _oBgFreeSpin;
    var _backgroundRing;
    var _oFrontSkin;
    var _oInterface;
    var _oHelpTable = null;
    var _freeSpinSetting = false;
    var _totFreeSpin;
    var _totFreeMul;
    var _oWMoney;
    var _endFreeSpin = false;
    var _countScatter = 0;
    var _oFreeSpinPanel;
    var _iBonus;
    var winBox;
    var freeSpinBox;
    var freeSpinWin=0;
    var lastWin=0;
    var lastFreeSpin;
    
    this._init = function(){
        _iCurState = GAME_STATE_IDLE;
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iCurCoinIndex = 0;
        _aReelSequence = new Array(0,1,2,3,4);
        _iNextColToStop = _aReelSequence[0];
        _iLastLineActive = NUM_PAYLINES;
        _iMoney = TOTAL_MONEY;
        _iCurBet = MIN_BET;
        _iTotBet = _iCurBet * _iLastLineActive;
        _bAutoSpin = false;
        _iTotFreeSpin = 0;
        _iNumSpinCont = 0;
        _iBonus = 0;
        lastFreeSpin = false;
        
        s_oTweenController = new CTweenController();

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        _oBg.x = 260;
        _oBg.y = 140;
        s_oAttachSection.addChild(_oBg);
        
        _oBgFreeSpin = createBitmap(s_oSpriteLibrary.getSprite('free_spin_bg'));
        _oBgFreeSpin.visible = false;
        s_oAttachSection.addChild(_oBgFreeSpin);
        
        this._initReels();
        _oFrontSkin = new createjs.Bitmap(s_oSpriteLibrary.getSprite('mask_slot'));
        s_oAttachSection.addChild(_oFrontSkin);

        _oInterface = new CInterface(_iCurBet,_iTotBet,_iMoney);
        this._initSymbolAnims();
        this._initStaticSymbols();

        winBox = createBitmap(s_oSpriteLibrary.getSprite('win_box'));
        winBox.visible = false;
        s_oAttachSection.addChild(winBox);
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('coin')], 
            frames: {width: 512, height: 512, regX: 0, regY: 0}, 
            animations: { static: [0, 0], anim: [1, 33] }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oCoin = new createjs.Sprite(oSpriteSheet, "static",0,0,512,512);
        _oCoin.stop();
        _oCoin.x = 750;
        _oCoin.y = 350;
        _oCoin.scaleX = 0.8;
        _oCoin.scaleY = 0.8;
        _oCoin.visible = false;
        s_oAttachSection.addChild(_oCoin);

        _oHelpTable = new CHelpPanel();
		
        if(_iMoney < _iTotBet){
            _oInterface.disableSpin(_bAutoSpin);
        }

        _oFreeSpinPanel = false;
        
        //FIND MIN WIN
        MIN_WIN = s_aSymbolWin[0][s_aSymbolWin[0].length-1];
        for(var i=0;i<s_aSymbolWin.length;i++){
            var aTmp = s_aSymbolWin[i];
            for(var j=0;j<aTmp.length;j++){
                if(aTmp[j] !== 0 && aTmp[j] < MIN_WIN){
                    MIN_WIN = aTmp[j];
                }
            }
        }
        
        _bUpdate = true;
    };
    
    this._initSymbolAnims = function(){
        s_aSymbolAnims = new Array();
        
        var oData = {
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_1')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 32] }
        };

        s_aSymbolAnims[0] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_2')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0},
            animations: { static: [0, 1], anim:[1, 22] }
        };

        s_aSymbolAnims[1] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_3')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 31] }
        };

        s_aSymbolAnims[2] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_4')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 24] }
        };

        s_aSymbolAnims[3] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_5')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 33] }
        };

        s_aSymbolAnims[4] = new createjs.SpriteSheet(oData);
        
        oData = {
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_6')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 24] }
        };

        s_aSymbolAnims[5] = new createjs.SpriteSheet(oData);
        
        oData = {
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_7')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 29] }
        };

        s_aSymbolAnims[6] = new createjs.SpriteSheet(oData);
        
        oData = {
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_8')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 31] }
        };

        s_aSymbolAnims[7] = new createjs.SpriteSheet(oData);
        
        oData = {
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_9')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 21] }
        };

        s_aSymbolAnims[8] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_10')], 
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 19] }
        };

        s_aSymbolAnims[9] = new createjs.SpriteSheet(oData);
        
        oData = {   
            framerate: 0,
            images: [s_oSpriteLibrary.getSprite('symbol_11')],
            frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
            animations: { static: [0, 1], anim:[1, 26] }
        };

        s_aSymbolAnims[10] = new createjs.SpriteSheet(oData);
    };
    
    this.unload = function(){
        // stopSound("reels");
        
        _oInterface.unload();
        _oHelpTable.unload();
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].unload();
        }
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].unload();
            }
        }
        
        s_oAttachSection.removeAllChildren();
    };
    
    this._initReels = function(){  
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        
        var iCurDelay = 0;
        _aMovingColumns = new Array();
        for(var i=0;i<NUM_REELS;i++){ 
            _aMovingColumns[i] = new CReelColumn(i,iXPos,iYPos,iCurDelay);
            _aMovingColumns[i+NUM_REELS] = new CReelColumn(i+NUM_REELS,iXPos,iYPos + (SYMBOL_SIZE*NUM_ROWS),iCurDelay );
            iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;
            iCurDelay += REEL_DELAY;
        }
    };
    
    this._initStaticSymbols = function(){
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        _aStaticSymbols = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aStaticSymbols[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                var oSymbol = new CStaticSymbolCell(i,j,iXPos,iYPos);
                _aStaticSymbols[i][j] = oSymbol;
                
                iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;
            }
            iXPos = REEL_OFFSET_X;
            iYPos += SYMBOL_SIZE;
        }
    };

    this.startFreeSpin = function() {
        freeSpinBox = false;
        _oBgFreeSpin.visible = true;
        winBox.visible = true;
        _oCoin.visible = true;
        _oCoin.gotoAndPlay('anim');
        _oInterface.showBox();
        _oInterface.enableSpin('freespin');
    }

    this.disableFreeSpinBox = function() {
        winBox.visible = false;
        _oCoin.visible = false;
        _oCoin.gotoAndStop('static');
    }
    
    this.generateLosingPattern = function(){
         var aFirstCol = new Array();
         for(var i=0;i<NUM_ROWS;i++){
            var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
            var iRandSymbol = s_aRandSymbols[iRandIndex];
            aFirstCol[i] = iRandSymbol;  
        }
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                
                if(j === 0){
                    _aFinalSymbolCombo[i][j] = aFirstCol[i];
                }else{
                    do{
                        var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
                        var iRandSymbol = s_aRandSymbols[iRandIndex];
                    }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol);

                    _aFinalSymbolCombo[i][j] = iRandSymbol;
                }  
            }
        }
        
        _aWinningLine = new Array();
        _bReadyToStop = true;
    };
    
    this._generateRandSymbols = function() {
        var aRandSymbols = new Array();
        for (var i = 0; i < NUM_ROWS; i++) {
                var iRandIndex = Math.floor(Math.random()* s_aRandSymbols.length);
                aRandSymbols[i] = s_aRandSymbols[iRandIndex];
        }

        return aRandSymbols;
    };
    
    this.reelArrived = function(iReelIndex,iCol) {
        if(_iCurReelLoops>MIN_REEL_LOOPS ){
            if (_iNextColToStop === iCol) {
                if (_aMovingColumns[iReelIndex].isReadyToStop() === false) {
                    var iNewReelInd = iReelIndex;
                    if (iReelIndex < NUM_REELS) {
                            iNewReelInd += NUM_REELS;
                            
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iReelIndex],
                                                                        _aFinalSymbolCombo[1][iReelIndex],
                                                                        _aFinalSymbolCombo[2][iReelIndex]), true);
                            
                    }else {
                            iNewReelInd -= NUM_REELS;
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iNewReelInd],
                                                                          _aFinalSymbolCombo[1][iNewReelInd],
                                                                          _aFinalSymbolCombo[2][iNewReelInd]), true);
                            
                            
                    }
                    
                }
            }else {
                    _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(),false);
            }
            
        }else {
            
            _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(), false);
            if(_bReadyToStop && iReelIndex === 0){
                _iCurReelLoops++;
            }
            
        }
    };
    
    this.stopNextReel = function() {
        _iNumReelsStopped++;

        if(_iNumReelsStopped%2 === 0){
            
            playSound("reel_stop",1,false);
            
            _iNextColToStop = _aReelSequence[_iNumReelsStopped/2];
            if (_iNumReelsStopped === (NUM_REELS*2) ) {
                    this._endReelAnimation();
            }
        }
    };
    
    this._endReelAnimation = function(){
        // stopSound("reels");
        _bReadyToStop = false;
        
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iNextColToStop = _aReelSequence[0];
        
        if(_iBonus > 0){
            _oInterface.disableSpin(_bAutoSpin);
            _oInterface.disableGuiButtons(_bAutoSpin);
        }

        //INCREASE MONEY IF THERE ARE COMBOS
        if(_aWinningLine.length > 0){
            //HIGHLIGHT WIN COMBOS IN PAYTABLE
            for(var i=0;i<_aWinningLine.length;i++){
                
                if(_aWinningLine[i].line > 0){
                    _oInterface.showLine(_aWinningLine[i].line);
                }
                var aList = _aWinningLine[i].list;
                for(var k=0;k<aList.length;k++){
                    _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value, aList.length);
                    _aMovingColumns[aList[k].col].setVisible(aList[k].row,false);
                    _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,false);
                }
            }

            if(_iTotFreeSpin > 0 || lastFreeSpin){
                _oFreeSpinPanel = true;
            }else{
                _oFreeSpinPanel = false;
                _oInterface.refreshFreeSpinNum("");
            }

            if(_iTotWin>0){
                if (_iTotFreeSpin > 0 || lastFreeSpin) {
                    lastWin = _iTotWin;
                    freeSpinWin += lastWin;
                    _oInterface.refreshWinText(freeSpinWin);
                } else {
                    _oInterface.refreshWinText(_iTotWin);
                }
            }
			
            _iTimeElaps = 0;
            _iCurState = GAME_STATE_SHOW_ALL_WIN;
            
            playSound("win",0.3,false);
        }else{
            if(_iTotFreeSpin > 0){
                _oFreeSpinPanel = true;
                _oInterface.disableSpin(_bAutoSpin);
                // this.onSpin();
            }else{
                _oFreeSpinPanel = false;
                _oInterface.refreshFreeSpinNum("");
                
                if(_bAutoSpin){
                    if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
                        this.resetCoinBet();
                        _bAutoSpin = false;
                        _oInterface.enableGuiButtons();
                    }else{
                        _oInterface.enableAutoSpin();
                        this.onSpin();
                    }
                }else{
                    _iCurState = GAME_STATE_IDLE;
                }
            }
            
        }

        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
            this.resetCoinBet();
            _bAutoSpin = false;
            _oInterface.enableGuiButtons();
        }else{
            if(!_bAutoSpin && !freeSpinBox){
                _oInterface.enableGuiButtons();
            }
        }
        
        _iNumSpinCont++;
        if(_iNumSpinCont === NUM_SPIN_FOR_ADS){
            _iNumSpinCont = 0;
            
            $(s_oMain).trigger("show_interlevel_ad");
        }
        lastFreeSpin = false;
        
        $(s_oMain).trigger("save_score",[_iMoney, _iTotWin]);
        _iTotWin = 0;
    };

    this.hidePayTable = function(){
        _oHelpTable.hide();
        s_oInterface.enableHBtns();
    };
    
    this._showWin = function(){
        var iLineIndex;
        if(_iCurWinShown>0){ 
            stopSound("win");
            
            iLineIndex = _aWinningLine[_iCurWinShown-1].line;
            if(iLineIndex > 0){
                _oInterface.hideLine(iLineIndex);
            }

            var aList = _aWinningLine[_iCurWinShown-1].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
                _aMovingColumns[aList[k].col].setVisible(aList[k].row,true);
                _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,true);
            }
        }
        
        if(_iCurWinShown === _aWinningLine.length){
            if (_freeSpinSetting && _freeSpinSetting == "true") {
                _freeSpinSetting = null;
                _bUpdate = false;
                return;
            }
            _iCurWinShown = 0;
            if (freeSpinBox) {
                this.startFreeSpin();
            } else if(_iTotFreeSpin > 0){
                _oInterface.enableSpin();
                if (_bAutoSpin) {
                    this.onSpin();
                }
                return;
            } else if (_bAutoSpin) {
                _oInterface.enableAutoSpin();
                this.onSpin();
                return;
            }
        }
        
        iLineIndex = _aWinningLine[_iCurWinShown].line;
        if(iLineIndex > 0){
            _oInterface.showLine(iLineIndex);
        }
        
        var aList = _aWinningLine[_iCurWinShown].list;
        for(var k=0;k<aList.length;k++){
            _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value, aList.length);
            _aMovingColumns[aList[k].col].setVisible(aList[k].row,false);
            _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,false);
        }

        _iCurWinShown++;
    };

    this._hideAllWins = function(){
        for(var i=0;i<_aWinningLine.length;i++){
            var aList = _aWinningLine[i].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
                _aMovingColumns[aList[k].col].setVisible(aList[k].row,true);
                _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,true);
            }
        }
        
        _oInterface.hideAllLines();

        _iTimeElaps = 0;
        _iCurWinShown = 0;
        _iTimeElaps = TIME_SHOW_WIN;
        _iCurState = GAME_STATE_SHOW_WIN;
    };
	
    this.activateLines = function(iLine){
        _iLastLineActive = iLine;
        this.removeWinShowing();
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);


        if(iNewTotalBet>_iMoney){
            _oInterface.disableSpin(_bAutoSpin);
        }else{
                _oInterface.enableSpin();
        }
    };
	
    this.addLine = function(){
        if(_iLastLineActive === NUM_PAYLINES){
            _iLastLineActive = 1;  
        }else{
            _iLastLineActive++;    
        }
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;
        iNewTotalBet = parseFloat(iNewTotalBet.toFixed(2));
        
        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);

        _oInterface.enableSpin();
    };
    
    this.resetCoinBet = function(){
        _iCurCoinIndex = 0;
        
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);       
        
        /*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
    };
    
    this.changeCoinBet = function(value) {
        if (value === 'add') {
            _iCurCoinIndex ++;
            if(_iCurCoinIndex === COIN_BET.length){
                _iCurCoinIndex = 0;
            }
        } else if (value === 'reduce') {
            _iCurCoinIndex --;
            if (_iCurCoinIndex < 0) {
                _iCurCoinIndex = COIN_BET.length - 1;
            }
        } else {
            return;
        }
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;
        iNewTotalBet = parseFloat(iNewTotalBet.toFixed(2));
        
        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);       
        
        _oInterface.enableSpin();
    };
	
    this.onMaxBet = function(){
        if(_iMoney < (MAX_BET*NUM_PAYLINES)){
            s_oMsgBox.show(TEXT_NO_MAX_BET);
            return;
        }
        
        var iNewBet = MAX_BET;
	    _iLastLineActive = NUM_PAYLINES;
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = MAX_BET;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);

        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{
            _oInterface.enableSpin();
            this.onSpin();
        }
    };
    
    this.removeWinShowing = function(){
        if (_iTotFreeSpin > 0) {

        } else {
            freeSpinWin = 0;
            lastWin = 0;
            _oInterface.resetWin();
        }
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].hide();
                _aMovingColumns[j].setVisible(i,true);
                _aMovingColumns[j+NUM_REELS].setVisible(i,true);
            }
        }
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].activate();
        }
        
        _iCurState = GAME_STATE_IDLE;
    };
    
    this.onSpin = function(){
        if (winBox.visible) {
            this.disableFreeSpinBox();
        }

        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
            _oInterface.enableGuiButtons();
            _bAutoSpin = false;
            s_oMsgBox.show(TEXT_NOT_ENOUGH_MONEY);
            return;
        }

        stopSound("win");
        
        this.removeWinShowing();

        if(s_bLogged === true){
            if(_iTotFreeSpin > 0){
                if (_iTotFreeSpin === 1) {
                    lastFreeSpin = true;
                }
                _iTotBet = 0;
                _oInterface.refreshFreeSpinNum(_iTotFreeSpin);
            }else{
                _iTotBet = _iCurBet * _iLastLineActive;
            }
            tryCallSpin(_iCurBet,_iTotBet,_iLastLineActive);
        }else{
            this.generateLosingPattern();
        }

        _oInterface.hideAllLines();
        _oInterface.disableGuiButtons(_bAutoSpin);
    };
    
    //AUTOSPIN BUTTON CLICKED
    this.onAutoSpin = function(){
        _bAutoSpin = true;
        this.onSpin();
    };
    
    this.onStopAutoSpin = function(){
        _bAutoSpin = false;
        
        if(_iCurState !== GAME_STATE_SPINNING){
            _oInterface.enableGuiButtons();
        }
    };
    
    this.generateLosingPattern = function(){
         var aFirstCol = new Array();
         for(var i=0;i<NUM_ROWS;i++){
            var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
            var iRandSymbol = s_aRandSymbols[iRandIndex];
            aFirstCol[i] = iRandSymbol;
        }
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                
                if(j === 0){
                    _aFinalSymbolCombo[i][j] = aFirstCol[i];
                }else{
                    do{
                        var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
                        var iRandSymbol = s_aRandSymbols[iRandIndex];
                    }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol);

                    _aFinalSymbolCombo[i][j] = iRandSymbol;
                }  
            }
        }
        
        _aWinningLine = new Array();
        _bReadyToStop = true;
    };
    
    this.onSpinReceived = function(oRetData) {
        _iMoney -= _iTotBet;
        if (!freeSpinWin) {
            _oInterface.refreshMoney(_iMoney);
        }
        
        _iCurState = GAME_STATE_SPINNING;
        _iTotWin = 0;
        
        if ( oRetData.res === "true" ){
            _iTotFreeSpin = parseInt(oRetData.freespin);
            
            if(oRetData.win === "true"){
                _aFinalSymbolCombo = JSON.parse(oRetData.pattern);
                _aWinningLine = JSON.parse(oRetData.win_lines);
                
                if(parseInt(oRetData.freespin) > 0 ){
                    _iBonus = BONUS_FREESPIN;   
                    if (oRetData.bFreeSpin === 'true') {
                        freeSpinBox = true;
                    }
                } else {
                    _iBonus = 0;
                }
                
                //GET TOTAL WIN FOR THIS SPIN
                _iTotWin = parseFloat(oRetData.tot_win);

                _bReadyToStop = true;
            }else{
                _iBonus = 0;
                
                _aFinalSymbolCombo = JSON.parse(oRetData.pattern);

                _aWinningLine = new Array();
                _bReadyToStop = true;
            }
            _iMoney = parseFloat(oRetData.money);
        }else{
                s_oGame.generateLosingPattern();
        }
    };
    
    this.onInfoClicked = function(){
        if(_iCurState === GAME_STATE_SPINNING){
            return;
        }
    };

    this.onHelpClicked = function(){
        if(_iCurState === GAME_STATE_SPINNING){
            return;
        }
        
        if(_oHelpTable.isVisible()){
            _oHelpTable.hide();
        }else{
            _oHelpTable.show();
        }
    };
    
    this.onConnectionLost = function(){
        s_oMsgBox.show(TEXT_CONNECTION_LOST);
        _oInterface.enableGuiButtons();
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event", {
                title: TEXT_CONGRATULATIONS,
                msg:  TEXT_MSG_SHARE1+ _iMoney + TEXT_MSG_SHARE2,
                msg_share: TEXT_MSG_SHARING1 + _iMoney + TEXT_MSG_SHARING2
            });
    };
    
    this.getState = function(){
        return _iCurState;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
       
        switch(_iCurState){
            case GAME_STATE_SPINNING:{
                for(var i=0;i<_aMovingColumns.length;i++){
                    _aMovingColumns[i].update();
                }
                break;
            }
            case GAME_STATE_SHOW_ALL_WIN:{
                    
                    _iTimeElaps += s_iTimeElaps;
                    if(_iTimeElaps> TIME_SHOW_ALL_WINS){  
                        this._hideAllWins();
                    }
                    break;
            }
            case GAME_STATE_SHOW_WIN:{
                _iTimeElaps += s_iTimeElaps;
                if(_iTimeElaps > TIME_SHOW_WIN){
                    _iTimeElaps = 0;

                    this._showWin();
                }
                break;
            }
        }
        
	
    };
    
    s_oGame = this;
    
    
    
    this._init();
}

var s_oGame;
var s_oTweenController;
var s_aSymbolAnims;
