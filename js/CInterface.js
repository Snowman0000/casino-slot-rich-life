function CInterface(iCurBet,iTotBet,iMoney){
    var _aPayline;
    var _oButExit;
    var _oSpinBut;
    var _oAutoSpinBut;
    var _oHelpBut;
    var _oMaxBetBut;
    var _betUp;
    var _betDown;
    var _oSpiningBut;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oMoneyText;
    var _oTotalBetText;
    var _oWinText;
    var _oFreeSpinNumText;

    var _winLine;

    var _settingContainer;
    var settingOpenBtn;
    var settingCloseBtn;
    var soundOpenBtn;
    var soundCloseBtn;
    var fullscreenOpenBtn;
    var fullscreenCloseBtn;
    var settingPane;
    var richlife_top;
    var richlife_text;
    var box;
    var _oFreeSpinHitArea;

    this._init = function(iCurBet,iTotBet,iMoney) {
        _winLine = new Array();
        var oSprite = s_oSpriteLibrary.getSprite('home');
        var oSpriteO = s_oSpriteLibrary.getSprite('homeO');
        var oSpriteD = s_oSpriteLibrary.getSprite('homeD');
        _oButExit = new CTButton(75, 80, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        _oButExit.setScale(0.5);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        oSprite = s_oSpriteLibrary.getSprite('spin_but');
        _oSpinBut = new CTextButton(1111 + (oSprite.width/2),595 ,oSprite,TEXT_SPIN,FONT_GAME,"#ffffff",26,s_oAttachSection);  
        _oSpinBut.addEventListener(ON_MOUSE_UP, this._onSpin, this);
        _oSpinBut.setVisible(false);

        // Default Texts
        this._initTexts();
        
        // Control Buttons to set betting lines and per bet.
        this._initCBtns();

        // Show selected lines
        this._sLines();

        // Show pay lines
        this._sPayLines();
        
        richlife_top = createBitmap(s_oSpriteLibrary.getSprite('richlife_top'));
        richlife_top.x = 660;
        richlife_top.y = 100;
        s_oAttachSection.addChild(richlife_top);
        
        richlife_text = createBitmap(s_oSpriteLibrary.getSprite('richlife_text'));
        richlife_text.x = 840;
        richlife_text.y = 98;
        s_oAttachSection.addChild(richlife_text);
        
        box = createBitmap(s_oSpriteLibrary.getSprite('box'));
        box.x = 460;
        box.y = 90;
        box.scaleX = 1.8;
        box.scaleY = 1.8;
        box.visible = false;
        s_oAttachSection.addChild(box);
    };

    this._initCBtns = function() {
        oSprite = s_oSpriteLibrary.getSprite('settingpane');
        settingPane = createBitmap(oSprite);
        settingPane.x = 20;
        settingPane.y = 700;
        settingPane.scaleY = 0.55;
        settingPane.scaleX = 0.55;
        settingPane.visible = false;
        s_oAttachSection.addChild(settingPane);

        var oSprite = s_oSpriteLibrary.getSprite('settingopen');
        var oSpriteO = s_oSpriteLibrary.getSprite('settingopenO');
        var oSpriteD = s_oSpriteLibrary.getSprite('settingopenD');
        settingOpenBtn = new CTButton(75, 981, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        settingOpenBtn.setScale(0.5);
        settingOpenBtn.addEventListenerWithParams(ON_MOUSE_UP, this.settingOpen, this);

        var oSprite = s_oSpriteLibrary.getSprite('settingclose');
        var oSpriteO = s_oSpriteLibrary.getSprite('settingcloseO');
        var oSpriteD = s_oSpriteLibrary.getSprite('settingcloseD');
        settingCloseBtn = new CTButton(75, 981, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        settingCloseBtn.setScale(0.5);
        settingCloseBtn.setVisible(false);
        settingCloseBtn.addEventListenerWithParams(ON_MOUSE_UP, this.settingClose, this);
        
        _settingContainer = new createjs.Container();
        _settingContainer.visible = false;
        s_oAttachSection.addChild(_settingContainer);
        var oSprite = s_oSpriteLibrary.getSprite('sound');
        var oSpriteO = s_oSpriteLibrary.getSprite('soundO');
        var oSpriteD = s_oSpriteLibrary.getSprite('soundD');
        soundOpenBtn = new CTButton(75, 830, oSprite, oSpriteO, oSpriteD, _settingContainer);
        soundOpenBtn.setScale(0.5);
        soundOpenBtn.setVisible(false);
        soundOpenBtn.addEventListenerWithParams(ON_MOUSE_UP, this.soundSetting, this, false);
        
        var oSprite = s_oSpriteLibrary.getSprite('usound');
        var oSpriteO = s_oSpriteLibrary.getSprite('usoundO');
        var oSpriteD = s_oSpriteLibrary.getSprite('usoundD');
        soundCloseBtn = new CTButton(75, 830, oSprite, oSpriteO, oSpriteD, _settingContainer);
        soundCloseBtn.setScale(0.5);
        soundCloseBtn.addEventListenerWithParams(ON_MOUSE_UP, this.soundSetting, this, true);
        
        var oSprite = s_oSpriteLibrary.getSprite('fullscreen');
        var oSpriteO = s_oSpriteLibrary.getSprite('fullscreenO');
        var oSpriteD = s_oSpriteLibrary.getSprite('fullscreenD');
        fullscreenOpenBtn = new CTButton(75, 760, oSprite, oSpriteO, oSpriteD, _settingContainer);
        fullscreenOpenBtn.setScale(0.5);
        fullscreenOpenBtn.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('ufullscreen');
        var oSpriteO = s_oSpriteLibrary.getSprite('ufullscreenO');
        var oSpriteD = s_oSpriteLibrary.getSprite('ufullscreenD');
        fullscreenCloseBtn = new CTButton(75, 760, oSprite, oSpriteO, oSpriteD, _settingContainer);
        fullscreenCloseBtn.setScale(0.5);
        fullscreenCloseBtn.setVisible(false);
        fullscreenCloseBtn.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);

        var oSprite = s_oSpriteLibrary.getSprite('help');
        var oSpriteO = s_oSpriteLibrary.getSprite('helpO');
        var oSpriteD = s_oSpriteLibrary.getSprite('helpD');
        _oHelpBut = new CTButton(75, 900, oSprite, oSpriteO, oSpriteD, _settingContainer);
        _oHelpBut.setScale(0.5);
        _oHelpBut.addEventListenerWithParams(ON_MOUSE_UP, this._onHelp, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('maxbg');
        var oSpriteO = s_oSpriteLibrary.getSprite('maxbgO');
        var oSpriteD = s_oSpriteLibrary.getSprite('maxbgD');
        _oMaxBetBut = new CTTextButton(1103, 971, oSprite, oSpriteO, oSpriteD, 'LEVEL\nMAX', FONT_GAME, '#efc272', 50, s_oAttachSection);
        _oMaxBetBut.setScale(0.506);
        _oMaxBetBut.addEventListenerWithParams(ON_MOUSE_UP, this._onMaxBet, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('betup');
        var oSpriteO = s_oSpriteLibrary.getSprite('betupO');
        var oSpriteD = s_oSpriteLibrary.getSprite('betupD');
        _betUp = new CTButton(652, 981, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        _betUp.setScale(0.5);
        _betUp.addEventListenerWithParams(ON_MOUSE_UP, this._onBet, this, 'add');
        
        var oSprite = s_oSpriteLibrary.getSprite('betdown');
        var oSpriteO = s_oSpriteLibrary.getSprite('betdownO');
        var oSpriteD = s_oSpriteLibrary.getSprite('betdownD');
        _betDown = new CTButton(501, 981, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        _betDown.setScale(0.5);
        _betDown.addEventListenerWithParams(ON_MOUSE_UP, this._onBet, this, 'reduce');
        
        _oFreeSpinHitArea = new createjs.Shape();
        _oFreeSpinHitArea.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFreeSpinHitArea.on("click",function(){s_oInterface._bDisable();});
        _oFreeSpinHitArea.visible = false;
        s_oAttachSection.addChild(_oFreeSpinHitArea);
        
        var oSprite = s_oSpriteLibrary.getSprite('blank');
        var oSpriteO = s_oSpriteLibrary.getSprite('blankO');
        var oSpriteD = s_oSpriteLibrary.getSprite('blankD');
        _oStartBut = new CTTextButton(959, 964, oSprite, oSpriteO, oSpriteD, 'REVEAL', FONT_GAME, '#efc272', 60, s_oAttachSection);
        _oStartBut.setScale(0.506);
        _oStartBut.addEventListenerWithParams(ON_MOUSE_UP, this._onSpin, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('autoplay');
        var oSpriteO = s_oSpriteLibrary.getSprite('autoplayO');
        var oSpriteD = s_oSpriteLibrary.getSprite('autoplayD');
        _oAutoSpinBut = new CTTextButton(815, 970, oSprite, oSpriteO, oSpriteD, 'AUTO\nPLAY', FONT_GAME, '#efc272', 50, s_oAttachSection);
        _oAutoSpinBut.setScale(0.506);
        _oAutoSpinBut.addEventListenerWithParams(ON_MOUSE_UP, this._onAutoSpin, this);

        var oSprite = s_oSpriteLibrary.getSprite('spining');
        var oSpriteO = s_oSpriteLibrary.getSprite('spiningO');
        var oSpriteD = s_oSpriteLibrary.getSprite('spiningD');
        _oSpiningBut = new CTButton(959, 964, oSprite, oSpriteO, oSpriteD, s_oAttachSection);
        _oSpiningBut.setScale(0.5);
        _oSpiningBut.setVisible(false);
        _oSpiningBut.addEventListenerWithParams(ON_MOUSE_UP, this._onSpining, this);
    }

    this._onSpining = function() {

    }

    this.showBox = function() {
        richlife_text.visible = false;
        richlife_top.visible = false;
        box.visible = true;
        _oFreeSpinHitArea.visible = true;
    }

    this.disableHBtns = function() {
        _oStartBut.setVisible(false);
        _oAutoSpinBut.setVisible(false);
        _oMaxBetBut.setVisible(false);
        settingOpenBtn.setVisible(false);
        settingCloseBtn.setVisible(false);
        settingPane.visible = false;
        _settingContainer.visible = false;
    }

    this.enableHBtns = function() {
        _oStartBut.setVisible(true);
        _oAutoSpinBut.setVisible(true);
        _oMaxBetBut.setVisible(true);
        settingOpenBtn.setVisible(true);
        settingCloseBtn.setVisible(false);
        settingPane.visible = false;
        _settingContainer.visible = false;
    }

    this.soundSetting = function(value) {
        soundOpenBtn.setVisible(value);
        soundCloseBtn.setVisible(!value);
        s_oInterface._onAudioToggle();
    }

    this.settingOpen = function() {
        settingOpenBtn.setVisible(false);
        settingCloseBtn.setVisible(true);
        settingPane.visible = true;
        _settingContainer.visible = true;
    }

    this.settingClose = function() {
        settingCloseBtn.setVisible(false);
        settingPane.visible = false;
        _settingContainer.visible = false;
        settingOpenBtn.setVisible(true);
    }

    this._sLines = function() {
        if (_bstartSpin) {
            oSprite = s_oSpriteLibrary.getSprite('start_spin');
            _oStartSpin = new CBetToggle(1100, CANVAS_HEIGHT/2, oSprite,'start_spin');
            _oStartSpin.addEventListener(ON_MOUSE_UP, this._onSpin, this);
        }
    }

    this._initTexts = function() {
        _oMoneyText = new CTLText(s_oAttachSection, 
            1450, 960, 128, 50, 
            40, "center", "#fff", FONT_GAME, 1,
            0, 0,
            (iMoney*100).toFixed(),
            true, true, true,
            false );

        _oTotalBetText = new CTLText(s_oAttachSection, 
            510, 960, 128, 50, 
            40, "center", "#fff", FONT_GAME, 1,
            0, 0,
            (iTotBet*100).toFixed(),
            true, true, false,
            false );
        _oTotalBetText.setShadow("#000",1,1,2);

        _oWinText = new CTLText(s_oAttachSection,
            1265, 960, 128, 50,
            40, "center", "#fff", FONT_GAME, 1,
            0, 0,
            (0).toFixed(),
            true, true, false,
            false );

        _oWinText.setShadow("#000",1,1,2);

        lineText = new CTLText(s_oAttachSection, 
            330, 960, 128, 50, 
            40, "center", "#fff", FONT_GAME, 1,
            0, 0,
            20,
            true, true, false,
            false );
        lineText.setShadow("#000",1,1,2);

        _oFreeSpinNumText = new createjs.Text("12", "30px "+'sans-serif', "#fff");
        _oFreeSpinNumText.x = 955;
        _oFreeSpinNumText.y = 1080;
        _oFreeSpinNumText.textAlign = "center";
        _oFreeSpinNumText.textBaseline = "alphabetic";
        s_oAttachSection.addChild(_oFreeSpinNumText);

        _oFreeSpinMultipleText = new createjs.Text("", "bold 20px "+'sans-serif', "#fbfaf3");
        _oFreeSpinMultipleText.x = 750;
        _oFreeSpinMultipleText.y = 625;
        _oFreeSpinMultipleText.textAlign = "center";
        _oFreeSpinMultipleText.textBaseline = "alphabetic";
        s_oAttachSection.addChild(_oFreeSpinMultipleText);
    }

    this._sPayLines = function() {
        _aPayline = new Array();
        for(var k = 0;k<NUM_PAYLINES;k++){
            var oBmp = createLinesBitmap(s_oSpriteLibrary.getSprite('payline_'+(k+1) ));
            oBmp.visible = false;
            s_oAttachSection.addChild(oBmp);
            _aPayline[k] = oBmp;
        }
    }

    this.inVisibleCBtns = function() {
        _oStartBut.setVisible(false);
        if (_bstartSpin) {
            _oStartSpin.setVisible(false);
        }
    }

    this.visibleCBtns = function() {
        _oStartBut.setVisible(true);
        if (_bstartSpin) {
            _oStartSpin.setVisible(true);
        }
    }
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        _oSpinBut.unload();
        _oSpinBut = null;
        _oAutoSpinBut.unload();
        _oAutoSpinBut = null;
        _oMaxBetBut.unload();
        _oMaxBetBut = null;
        _oHelpBut.unload();
        _oHelpBut = null;
        _oStartBut.unload();
        _oStartBut = null;
        _oSpiningBut.unload();
        _oSpiningBut = null;
        if (_bstartSpin) {
            _oStartSpin.unload();
            _oStartSpin = null;
        }
        
        s_oInterface = null;
    };

    this.refreshMoney = function(iMoney){
        _oMoneyText.refreshText((iMoney*100).toFixed());
    };
    
    this.refreshTotalBet = function(iTotBet){
        _oTotalBetText.refreshText((iTotBet*100).toFixed(0));
    };
    
    this.resetWin = function(){
        _oWinText.refreshText(0);
    };
    
    this.refreshWinText = function(iWin){
        _oWinText.refreshText((iWin*100).toFixed());
    };
    
    this.refreshFreeSpinNum = function(iNum){
        if (iNum > 0) {
            _oFreeSpinNumText.text = 'FREE GAME '+(13-iNum)+' of 12';
        } else {
            _oFreeSpinNumText.text = '';
        }
    };

    this.refreshFreeMultiple = function(multiple) {
        _oFreeSpinMultipleText.text = multiple
    }
    
    this.showLine = function(iLine){
        _aPayline[iLine-1].visible = true;
    };
    
    this.hideLine = function(iLine){
        _aPayline[iLine-1].visible = false;
    };
    
    this.hideAllLines = function(){
        for(var i=0;i<NUM_PAYLINES;i++){
            _aPayline[i].visible = false;
        }
    };
    
    this.enableGuiButtons = function(){
        _oSpinBut.enable();
        _oStartBut.enable();
        if (_bstartSpin) {
            _oStartSpin.enable();
            _oStartSpin.setVisible(true);
        }
        _oAutoSpinBut.setText(TEXT_AUTOSPIN);
        _oAutoSpinBut.enable();
        _oMaxBetBut.enable();
        _betUp.enable();
        _betDown.enable();
    };
	
    this.enableSpin = function(freespin) {
        _oSpinBut.enable();
        _oStartBut.enable();
        if (_bstartSpin) {
            _oStartSpin.enable();
            _oStartSpin.setVisible(true);
        }
        _oAutoSpinBut.setText(TEXT_AUTOSPIN);
        _oAutoSpinBut.enable();
        if (freespin !== 'freespin') {
            _oMaxBetBut.enable();
            _betUp.enable();
            _betDown.enable();
        }
    };
    
    this.enableAutoSpin = function(){
        _oAutoSpinBut.enable();
    };

    this.disableSpin = function(bAutoSpin){
        _oSpinBut.disable();
        _oStartBut.disable();
        if (_bstartSpin) {
            _oStartSpin.disable();
            _oStartSpin.setVisible(false);
        }
        if(bAutoSpin){
            _oAutoSpinBut.setText(TEXT_STOP_AUTO);
        }else{
            _oAutoSpinBut.disable();
        }
        _oMaxBetBut.disable();
        _betUp.disable();
        _betDown.disable();
    };
    
    this.disableAutoSpin = function(){
        _oAutoSpinBut.disable();
    };
    
    this.disableGuiButtons = function(bAutoSpin){
        _oSpinBut.disable();
        _oStartBut.disable();
        if (_bstartSpin) {
            _oStartSpin.disable();
            _oStartSpin.setVisible(false);
        }
        if(bAutoSpin){
            _oAutoSpinBut.setText(TEXT_STOP_AUTO);
        }else{
            _oAutoSpinBut.disable();
        }
        
        _oMaxBetBut.disable();
        _betUp.disable();
        _betDown.disable();
    };
    
    this._onBetLineClicked = function(iLine){
        s_oGame.activateLines(iLine);
    };
    
    this._onExit = function(){
        s_oGame.onExit();  
    };
    
    this._onSpin = function(){
        s_oGame.onSpin();
    };
    
    this._onAutoSpin = function(){
        if(_oAutoSpinBut.getText() === TEXT_AUTOSPIN){
            s_oGame.onAutoSpin();
        }else{
            _oAutoSpinBut.disable();
            _oAutoSpinBut.setText(TEXT_AUTOSPIN);
            
            s_oGame.onStopAutoSpin();
        }
    };
    
    this._onAddLine = function(){
        s_oGame.addLine();
    };
    
    this._onInfo = function(){
        s_oGame.onInfoClicked();
    };

    this._onHelp = function(){
        s_oGame.onHelpClicked();
        s_oInterface.disableHBtns();
    };
    
    this._onBet = function(value) {
        s_oGame.changeCoinBet(value);
    };
    
    this._onMaxBet = function(){
        s_oGame.onMaxBet();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.isEnabled){
            // _oButFullscreen.setActive(s_bFullscreen);
        }
    };


    this._onFullscreenRelease = function() {
        if(s_bFullscreen) {
            fullscreenOpenBtn.setVisible(true);
            fullscreenCloseBtn.setVisible(false);
            _fCancelFullScreen.call(window.document);
        }else{
            fullscreenOpenBtn.setVisible(false);
            fullscreenCloseBtn.setVisible(true);
            _fRequestFullScreen.call(window.document.documentElement);
        }
        
        sizeHandler();
    };
    
    this._bDisable = function () {
        return;
    }

    s_oInterface = this;
    
    this._init(iCurBet,iTotBet,iMoney);
    
    return this;
}

var s_oInterface = null;