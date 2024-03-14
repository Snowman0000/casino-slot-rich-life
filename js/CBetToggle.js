function CBetToggle(iXPos, iYPos, oSprite, btn) {
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oButton;
    
    this._init = function(iXPos,iYPos,oSprite, btn){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oSprite = s_oSpriteLibrary.getSprite(btn);
        
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/3, height: oSprite.height, regX: 0, regY: 0}, 
                        animations: { default: [0, 1], over: [1,2], down: [2,3] }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oButton = createSprite(oSpriteSheet, "default",0,0,oSprite.width/2,oSprite.height);
        _oButton.stop();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 

        _oButton.regX = oSprite.width/6;
        _oButton.regY = oSprite.height/2;
       
        s_oAttachSection.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease); 
       _oButton.off("mouseover", this.buttonOver);
       _oButton.off("mouseout", this.buttonOut);
       
       s_oAttachSection.removeChild(_oButton);
    };
    
    this.disable = function(bDisable){
        _bDisable = bDisable;
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setOn = function(){
        _oButton.gotoAndStop("default");
    };

    this.setOver = function(){
        _oButton.gotoAndStop("over");
    };
    
    this.setOff = function(){
        _oButton.gotoAndStop("down");
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
       _oButton.on("mouseover" , this.buttonOver);      
       _oButton.on("mouseout" , this.buttonOut);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.buttonRelease = function(){
        _oButton.gotoAndStop("default");
        if(_aCbCompleted[ON_MOUSE_UP] && _bDisable === false){
            playSound("press_but",1,false);
            
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        _oButton.gotoAndStop("down");
       if(_aCbCompleted[ON_MOUSE_DOWN] && _bDisable === false){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };

    this.buttonOver = function(){
        _oButton.gotoAndStop("over");
        if(_aCbCompleted[ON_MOUSE_OVER] && _bDisable === false){
            // playSound("press_but",1,false);
            
            _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],_aParams);
        }
    };

    this.buttonOut = function(){
        _oButton.gotoAndStop("default");
        if(_aCbCompleted[ON_MOUSE_OUT] && _bDisable === false){
            // playSound("press_but",1,false);
            
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT],_aParams);
        }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this.enable = function(){
        _bDisable = false;
    };
    
    // this.disable = function(){
    //     _bDisable = true;
    // };
    
    this._init(iXPos,iYPos,oSprite, btn);
}