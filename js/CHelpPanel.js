function CHelpPanel(){
    var _iCurPage;
    var _aNumSymbolComboText;
    var _aWinComboText;
    var _aPages;
    var _oCurPage;
    
    var _oHitArea;
    var _oButArrowNext;
    var _oButArrowPrev;
    var _oButExit;
    var _oButExit1;
    var _oContainer;
    
    this._init = function(){
        _iCurPage = 0;
        _aPages = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oAttachSection.addChild(_oContainer);
        
        //ATTACH PAGE 1
        var oContainerPage = new createjs.Container();
        _oContainer.addChild(oContainerPage);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('help_1'));
        oContainerPage.addChild(oBg);
        _aPages[0] = oContainerPage;
        
        //ATTACH PAGE 2
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        oBg = createBitmap(s_oSpriteLibrary.getSprite('help_2'));
        oContainerPage.addChild(oBg);
        _aPages[1] = oContainerPage;
        
        //ATTACH PAGE 3
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        oBg = createBitmap(s_oSpriteLibrary.getSprite('help_3'));
        oContainerPage.addChild(oBg);
        _aPages[2] = oContainerPage;
        
        //ATTACH PAGE 4
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        oBg = createBitmap(s_oSpriteLibrary.getSprite('help_4'));
        oContainerPage.addChild(oBg);
        _aPages[3] = oContainerPage;
        
        //ATTACH PAGE 5
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        oBg = createBitmap(s_oSpriteLibrary.getSprite('help_5'));
        oContainerPage.addChild(oBg);
        _aPages[4] = oContainerPage;
        
        _oCurPage = _aPages[_iCurPage];
        
        
        //ATTACH HIT AREA
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        var oParent = this;
        _oHitArea.on("click",function(){oParent._bDisable();});
        _oContainer.addChild(_oHitArea);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('blank');
        var oSpriteO = s_oSpriteLibrary.getSprite('blankO');
        var oSpriteD = s_oSpriteLibrary.getSprite('blankD');
        _oButExit = new CTTextButton(959, 964, oSprite, oSpriteO, oSpriteD, 'BACK\nTO GAME', FONT_GAME, '#efc272', 50, _oContainer);
        _oButExit.setScale(0.506);
        _oButExit.addEventListenerWithParams(ON_MOUSE_UP, this._onExit, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('autoplay');
        var oSpriteO = s_oSpriteLibrary.getSprite('autoplayO');
        var oSpriteD = s_oSpriteLibrary.getSprite('autoplayD');
        _oButArrowPrev = new CTTextButton(815, 970, oSprite, oSpriteO, oSpriteD, 'PREV', FONT_GAME, '#efc272', 50, _oContainer);
        _oButArrowPrev.setScale(0.506);
        _oButArrowPrev.addEventListenerWithParams(ON_MOUSE_UP, this._onPrev, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('maxbg');
        var oSpriteO = s_oSpriteLibrary.getSprite('maxbgO');
        var oSpriteD = s_oSpriteLibrary.getSprite('maxbgD');
        _oButArrowNext = new CTTextButton(1103, 971, oSprite, oSpriteO, oSpriteD, 'NEXT', FONT_GAME, '#efc272', 50, _oContainer);
        _oButArrowNext.setScale(0.506);
        _oButArrowNext.addEventListenerWithParams(ON_MOUSE_UP, this._onNext, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('back');
        var oSpriteO = s_oSpriteLibrary.getSprite('backO');
        var oSpriteD = s_oSpriteLibrary.getSprite('backD');
        _oButExit1 = new CTButton(75, 981, oSprite, oSpriteO, oSpriteD, _oContainer);
        _oButExit1.setScale(0.5);
        _oButExit1.addEventListenerWithParams(ON_MOUSE_UP, this._onExit, this);
    };
    
    this.unload = function(){        
        s_oAttachSection.removeChild(_oContainer);
    };
    
    this._onNext = function(){
        _iCurPage++;
        if(_iCurPage >= _aPages.length) {
            _iCurPage = 0;
        }
        
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };
    
    this._onPrev = function(){
        _iCurPage--;
        if(_iCurPage < 0) {
            _iCurPage = _aPages.length - 1;
        }
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };
    
    this.show = function(){
        _iCurPage = 0;
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
        
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this._onExit = function(){
        s_oGame.hidePayTable();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };

    this._bDisable = function () {
        return;
    }
    
    this._init();
}