function CCreditsPanel(){
    var _oBg;
    var _oButExit;
    var _oMsgText;
    var _oMsgTextOutline;
    
    var _oHitArea;
    
    var _oLink;
    var _oLinkOutline;
    
    var _pStartPosExit;
    
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH/2 + 380, y: 190};  
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
       
        _oMsgTextOutline = new createjs.Text(TEXT_CREDITS_DEVELOPED, "38px " + FONT_GAME, "#000");
        _oMsgTextOutline.textAlign = "center";
        _oMsgTextOutline.textBaseline = "alphabetic";
	_oMsgTextOutline.x = CANVAS_WIDTH/2;
        _oMsgTextOutline.y = 270;
        _oMsgTextOutline.outline = 2;
	_oContainer.addChild(_oMsgTextOutline);
       
        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "38px " + FONT_GAME, "#fff");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
	_oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = 270;
	_oContainer.addChild(_oMsgText);
        
        _oLinkOutline = new createjs.Text("www.codethislab.com", "34px " + FONT_GAME, "#000");
        _oLinkOutline.textAlign = "center";
        _oLinkOutline.textBaseline = "alphabetic";
	_oLinkOutline.x = CANVAS_WIDTH/2;
        _oLinkOutline.y = 385;
        _oLinkOutline.outline = 2;
        _oContainer.addChild(_oLinkOutline);
        
        _oLink = new createjs.Text("www.codethislab.com", "34px " + FONT_GAME, "#fff");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
	_oLink.x = CANVAS_WIDTH/2;
        _oLink.y = 385;
        _oContainer.addChild(_oLink);
        
	createjs.Tween.get(_oContainer).to({alpha:1} , 600,createjs.Ease.cubicOut);
        
	this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
	
    this.refreshButtonPos = function (iNewX, iNewY) {
    };
    
    this.unload = function(){
        _oHitArea.off("click", this._onLogoButRelease);
        
        _oButExit.unload(); 
        _oButExit = null;

        s_oStage.removeChild(_oContainer);
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en","_blank");
    };
    
    this._init();
    
    
};


