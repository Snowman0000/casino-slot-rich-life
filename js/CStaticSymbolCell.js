function CStaticSymbolCell(iRow,iCol,iXPos,iYPos){
    
    var _iRow;
    var _iCol;
    var _iCurSpriteAnimating = -1;
    var _iLastAnimFrame;
    var _aSprites;
    var _oWinningFrame;
    var _dScatterFrame;
    var _oContainer;
    var s_cockWin = false;
    var lastAnimFrames = [32, 22, 31, 24, 33, 24, 29, 31, 21, 19, 26];
    
    this._init = function(iRow,iCol,iXPos,iYPos){
        _iRow = iRow;
        _iCol = iCol;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.alpha = 100;
        
        var oParent= this;
        
        var oData = {   // image to use
            framerate: 10,
            images: [s_oSpriteLibrary.getSprite('win_frame_anim')], 
            // width, height & registration point of each sprite
            frames: {width: 291, height: 287, regX: 0, regY: 0}, 
            animations: { static: [0, 0], anim: [1,2] }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oWinningFrame = new createjs.Sprite(oSpriteSheet, "static",0,0,291,287);
        _oWinningFrame.stop();
        _oWinningFrame.x = iXPos-8;
        _oWinningFrame.y = iYPos;
        _oWinningFrame.visible = false;
        _oContainer.addChild(_oWinningFrame);
        
        _aSprites = new Array();
        for(var i=0;i<NUM_SYMBOLS;i++) {
            var oSprite = createSprite(s_aSymbolAnims[i], "static",0,0,SYMBOL_SIZE,SYMBOL_SIZE);
            oSprite.stop();
            oSprite.x = iXPos;
            oSprite.y = iYPos;
            oSprite.on("animationend", oParent._onAnimEnded, null, false, {index:i});
            _oContainer.addChild(oSprite);
            
            _aSprites[i] = oSprite;
            _aSprites[i].visible = false;
        }

        var oData = {   // image to use
            framerate: 10,
            images: [s_oSpriteLibrary.getSprite('symbol_10')],
            // width, height & registration point of each sprite
            frames: {width: 138, height: 138, regX: 0, regY: 0}, 
            animations: {  static: [0, 0],anim:[0,1] }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _dScatterFrame = new createjs.Sprite(oSpriteSheet, "static",0,0,SYMBOL_SIZE,SYMBOL_SIZE);
        _dScatterFrame.stop();
        _dScatterFrame.x = iXPos;
        _dScatterFrame.y = iYPos;
        _dScatterFrame.visible = false;
        _oContainer.addChild(_dScatterFrame);
        
        s_oAttachSection.addChild(_oContainer);
    };
    
    this.unload = function(){
        s_oAttachSection.removeChild(_oContainer);
    };
    
    this.hide = function(){
         if(_iCurSpriteAnimating > -1){
            _oWinningFrame.gotoAndStop("static"); 
            _oWinningFrame.visible = false;
            _dScatterFrame.gotoAndStop("static"); 
            _dScatterFrame.visible = false;
            _aSprites[_iCurSpriteAnimating].gotoAndPlay("static");
            _oContainer.visible = false;
        }
    };
    
    this.show = function(iValue, cLength){
        _oWinningFrame.visible = true;
        
        for(var i=0;i<NUM_SYMBOLS;i++){
            if( (i+1) === iValue){
                _aSprites[i].visible = true;
            }else{
                _aSprites[i].visible = false;
            }
        }

        _aSprites[iValue-1].gotoAndPlay("anim");
        _iCurSpriteAnimating = iValue-1;
        _iLastAnimFrame = lastAnimFrames[iValue-1];
        
        _oContainer.visible = true;
    };
    
    this._onAnimEnded = function(evt,oData){
        if(_aSprites[oData.index].currentFrame === _iLastAnimFrame){
            return;
        }
        _aSprites[oData.index].stop();
        setTimeout(function(){_aSprites[oData.index].gotoAndPlay(1);}, 100);
    };
    
    this.stopAnim = function(){
       _aSprites[_iCurSpriteAnimating].gotoAndStop("static");
       _aSprites[_iCurSpriteAnimating].visible = false;
       
       _oWinningFrame.gotoAndStop("static");
       _oWinningFrame.visible = false;
       _dScatterFrame.gotoAndStop("static");
       _dScatterFrame.visible = false;
    };
    
    this._init(iRow,iCol,iXPos,iYPos);
}