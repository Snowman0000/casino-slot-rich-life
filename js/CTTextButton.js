function CTTextButton(iXPos, iYPos, oSprite, oSpriteO, oSpriteD, szText, szFont, szColor, iFontSize, oParentContainer){
    var _bDisable;
    var _iCurScale;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerOver;
    var _oListenerOut;
    var _oParams;
    
    var _oButton;
    
    var _oTextBack;
    var _oText;
    var _oButtonBg;
    var _oButtonBgO;
    var _oButtonBgD;
    var _oParentContainer = oParentContainer;
    
    this._init =function(iXPos, iYPos, oSprite, oSpriteO, oSpriteD, szText, szFont, szColor, iFontSize){
        _bDisable = false;
        _iCurScale = 1;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _oButtonBg = createBitmap(oSprite);
        _oButtonBgO = createBitmap(oSpriteO);
        _oButtonBgO.visible = false;
        _oButtonBgD = createBitmap(oSpriteD);
        _oButtonBgD.visible = false;

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        if (!s_bMobile){
                _oButton.cursor = "pointer";
        }
        _oButton.addChild(_oButtonBg, _oButtonBgO, _oButtonBgD, _oText);

        _oParentContainer.addChild(_oButton);
        
        
        _oText = new CTLText(_oButton, 
                    10, 10, oSprite.width-20, oSprite.height-20, 
                    iFontSize, "center", szColor, szFont, 1,
                    5, 10,
                    szText,
                    true, true, true,
                    false );
        _oText.setShadow("#000",2,2,2);
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerUp); 
       _oButton.off("mouseover", _oListenerOver);
       _oButton.off("mouseout", _oListenerOut);
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setAlign = function(szAlign){
        _oText.textAlign = szAlign;
    };
    
    this.setTextX = function(iX){
        _oText.x = iX;
    };
    
    this.setScale = function(iScale){
        _oButton.scaleX = _oButton.scaleY = iScale;
        _iCurScale = iScale;
    };
    
    this.enable = function(){
        _bDisable = false;

    };
    
    this.disable = function(){
        _bDisable = true;

    };
    
    this._initListener = function(){
       _oListenerDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerUp = _oButton.on("pressup" , this.buttonRelease);
       _oListenerOver = _oButton.on("mouseover", this.buttonHover);
       _oListenerOut = _oButton.on("mouseout" , this.buttonOut);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,oParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        
        _oParams = oParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        _oButtonBg.visible = true;
        _oButtonBgO.visible = false;
        _oButtonBgD.visible = false;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_oParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButtonBg.visible = false;
        _oButtonBgO.visible = false;
        _oButtonBgD.visible = true;

        if(_aCbCompleted[ON_MOUSE_DOWN]){
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };
    
    this.buttonOut = function() {
        // playSound("press_but",1,false);
        _oButtonBg.visible = true;
        _oButtonBgO.visible = false;
        _oButtonBgD.visible = false;
        
        if(_aCbCompleted[ON_MOUSE_OUT]) {
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT], _aParams);
        }
    }

    this.buttonHover = function() {
        // playSound("press_but",1,false);
        _oButtonBg.visible = false;
        _oButtonBgO.visible = true;
        _oButtonBgD.visible = false;

        if(_aCbCompleted[ON_MOUSE_OVER]) {
            _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER], _aParams);
        }
    };
    
    this.setPosition = function(iXPos,iYPos){
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };
    
    this.tweenPosition = function(iXPos,iYPos,iTime,iDelay,oEase,oCallback,oCallOwner){
        createjs.Tween.get(_oButton).wait(iDelay).to({x:iXPos,y:iYPos}, iTime,oEase).call(function(){
            if(oCallback !== undefined){
                oCallback.call(oCallOwner);
            }
        }); 
    };
    
    this.setText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.setX = function(iXPos){
        _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
        _oButton.y = iYPos;
    };
    
    this.setScale = function(scale) {
        _oButton.scaleX = scale;
        _oButton.scaleY = scale;
    }

    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this.getSprite = function(){
        return _oButton;
    };
    
    this.getText = function(){
        return _oText.getString();
    };
    
    this.getScale = function(){
        return _oButton.scaleX;
    };

    this._init(iXPos, iYPos, oSprite, oSpriteO, oSpriteD, szText, szFont, szColor, iFontSize);
}