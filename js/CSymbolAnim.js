function CSymbolAnim(iXPos, iYPos, oSprite, oSpriteO, oSpriteD, oParentContainer){
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerOver;
    var _oListenerOut;
    
    var _button;
    var _oButton;
    var _oButtonO;
    var _oButtonD;
    var _oParentContainer;
    var _bVisible;
    
    this._init =function(iXPos, iYPos, oSprite, oSpriteO, oSpriteD){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _bVisible = true;
        
        _button = new createjs.Container();
        _button.x = iXPos;
        _button.y = iYPos;
        _button.regX = oSprite.width/2;
        _button.regY = oSprite.height/2;
        _oButton = createBitmap(oSprite);
        _oButtonO = createBitmap(oSpriteO);
        _oButtonO.visible = false;
        _oButtonD = createBitmap(oSpriteD);
        _oButtonD.visible = false;

        if (!s_bMobile) {
            _button.cursor = "pointer";
        }
        
        _button.addChild(_oButton, _oButtonO, _oButtonD);
        _oParentContainer.addChild(_button);

        this._initListener();
    };
    
    this.unload = function(){
       _button.off("mousedown", _oListenerDown);
       _button.off("pressup" , _oListenerUp);
       _button.off("mouseover", _oListenerOver);
       _button.off("mouseout", _oListenerOut);
       
       _oParentContainer.removeChild(_button);
    };
    
    this.setVisible = function(bVisible) {
        _button.visible = bVisible;
    };
    
    this._initListener = function() {
        _oListenerUp = _button.on("pressup" , this.buttonRelease); 
        _oListenerOver = _button.on("mouseover" , this.buttonHover);
        _oListenerDown = _button.on("mousedown", this.buttonDown);
        _oListenerOut = _button.on("mouseout" , this.buttonOut);
    };
    
    this.addEventListener = function( iEvent, cbCompleted, cbOwner ) {
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable) {
            return;
        }
        playSound("press_but",1,false);
        _oButton.visible = true;
        _oButtonO.visible = false;
        _oButtonD.visible = false;

        if(_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };

    this.buttonOut = function() {
        if (!_bVisible) return;
        // playSound("press_but",1,false);
        _oButton.visible = true;
        _oButtonO.visible = false;
        _oButtonD.visible = false;
        
        if(_aCbCompleted[ON_MOUSE_OUT]) {
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT], _aParams);
        }
    }

    this.buttonHover = function() {
        if (!_bVisible) return;
        // playSound("press_but",1,false);
        _oButton.visible = false;
        _oButtonO.visible = true;
        _oButtonD.visible = false;

        if(_aCbCompleted[ON_MOUSE_OVER]) {
            _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER], _aParams);
        }
    };
    
    this.buttonDown = function() {
        if (!_bVisible) return;
        if(_bDisable) {
            return;
        }
        _oButton.visible = false;
        _oButtonO.visible = false;
        _oButtonD.visible = true;

        if(_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);
        }
    };
    
    this.setPosition = function(iXPos,iYPos){
        _button.x = iXPos;
        _button.y = iYPos;
    };
    
    this.setX = function(iXPos){
        _button.x = iXPos;
    };
    
    this.setY = function(iYPos) {
        _button.y = iYPos;
    };

    this.enable = function() {
        _bDisable = false;
    };
    
    this.disable = function() {
        _bDisable = true;
    };

    this.setScale = function(scale) {
        _button.scaleX = scale;
        _button.scaleY = scale;
    }
    
    this.getButtonImage = function() {
        return _button;
    };
    
    
    this.getX = function(){
        return _button.x;
    };
    
    this.getY = function(){
        return _button.y;
    };

    _oParentContainer = oParentContainer;

    this._init(iXPos, iYPos, oSprite, oSpriteO, oSpriteD);
    
    return this;
}