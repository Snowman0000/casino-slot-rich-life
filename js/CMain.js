function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);  
        
        s_oAttachSection = new createjs.Container();
        s_oStage.addChild(s_oAttachSection);
        
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
	    createjs.Ticker.addEventListener("tick", this._update);
	
        if(navigator.userAgent.match(/Windows Phone/i)){
            DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };

    this.soundLoaded = function(){
         _iCurResource++;
         var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

         _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);


        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'press_but',loop:false,volume:1, ingamename: 'press_but'});
        s_aSoundsInfo.push({path: './sounds/',filename:'win',loop:false,volume:1, ingamename: 'win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'reels',loop:false,volume:1, ingamename: 'reels'});
        s_aSoundsInfo.push({path: './sounds/',filename:'reel_stop',loop:false,volume:1, ingamename: 'reel_stop'});
        s_aSoundsInfo.push({path: './sounds/',filename:'cock_slot',loop:false,volume:1, ingamename: 'cock_slot'});
        s_aSoundsInfo.push({path: './sounds/',filename:'cock_win',loop:false,volume:1, ingamename: 'cock_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'start_reel',loop:false,volume:1, ingamename: 'start_reel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'double_win',loop:false,volume:1, ingamename: 'double_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'double_lose',loop:false,volume:1, ingamename: 'double_lose'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fs_sound',loop:false,volume:1, ingamename: 'fs_sound'});
        s_aSoundsInfo.push({path: './sounds/',filename:'sound_after_pick',loop:false,volume:1, ingamename: 'sound_after_pick'});
        s_aSoundsInfo.push({path: './sounds/',filename:'btn_fr_setting',loop:false,volume:1, ingamename: 'btn_fr_setting'});
        s_aSoundsInfo.push({path: './sounds/',filename:'jackpot',loop:false,volume:1, ingamename: 'jackpot'});
        s_aSoundsInfo.push({path: './sounds/',filename:'drumrollNew',loop:false,volume:1, ingamename: 'drumrollNew'});
        s_aSoundsInfo.push({path: './sounds/',filename:'jackpot_win',loop:false,volume:1, ingamename: 'jackpot_win'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
        setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({
                src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                autoplay: false,
                preload: true,
                loop: oSoundInfo.loop, 
                volume: oSoundInfo.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(szId,szMsg){
                    for(var i=0; i < s_aSoundsInfo.length; i++){
                        if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                            s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                            break;
                        }
                    }
                },
                onplayerror: function(szId) {
                    for(var i=0; i < s_aSoundsInfo.length; i++){
                        if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                            s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                s_aSounds[s_aSoundsInfo[i].ingamename].play();
                            });
                            break;
                        }
                    }
                } 
            });

            
        }, (bDelay ? 200 : 0) );
        
        
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_bg","./sprites/but_play_bg.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("return_to_game","./sprites/return_to_game.png");
        s_oSpriteLibrary.addSprite("paytable1","./sprites/paytable1.jpg");
        s_oSpriteLibrary.addSprite("paytable2","./sprites/paytable2.jpg");
        s_oSpriteLibrary.addSprite("paytable3","./sprites/paytable3.jpg");
        s_oSpriteLibrary.addSprite("help_1","./sprites/help_1.png");
        s_oSpriteLibrary.addSprite("help_2","./sprites/help_2.png");
        s_oSpriteLibrary.addSprite("help_3","./sprites/help_3.png");
        s_oSpriteLibrary.addSprite("help_4","./sprites/help_4.png");
        s_oSpriteLibrary.addSprite("help_5","./sprites/help_5.png");
        s_oSpriteLibrary.addSprite("mask_slot","./sprites/Background.png");
        s_oSpriteLibrary.addSprite("spin_but","./sprites/but_spin_bg.png");
        s_oSpriteLibrary.addSprite("but_autospin","./sprites/but_autospin.png");
        s_oSpriteLibrary.addSprite("spin_bg","./sprites/spin_bg.png");
        s_oSpriteLibrary.addSprite("coin_but","./sprites/but_coin_bg.png");
        s_oSpriteLibrary.addSprite("paytable","./sprites/paytable.png");
        s_oSpriteLibrary.addSprite("paytable_page","./sprites/paytable_page.png");
        s_oSpriteLibrary.addSprite("bet_but","./sprites/bet_but.png");
        s_oSpriteLibrary.addSprite("win_frame_anim","./sprites/slot_anim.png");
        s_oSpriteLibrary.addSprite("but_lines_bg","./sprites/but_lines_bg.png");
        s_oSpriteLibrary.addSprite("but_maxbet_bg","./sprites/but_maxbet_bg.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_arrow_next","./sprites/but_arrow_next.png");
        s_oSpriteLibrary.addSprite("but_arrow_prev","./sprites/but_arrow_prev.png");
        s_oSpriteLibrary.addSprite("exit_help","./sprites/exit_help.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("start_btn","./sprites/btns/START.png");
        s_oSpriteLibrary.addSprite("start_spin","./sprites/start_spin.png");
        s_oSpriteLibrary.addSprite("auto_play","./sprites/btns/auto_play.png");
        s_oSpriteLibrary.addSprite("auto_stop","./sprites/btns/auto_stop.png");

        s_oSpriteLibrary.addSprite("ticker","./sprites/ticker.png");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("free_spin_bg","./sprites/free_spin_bg.png");
        s_oSpriteLibrary.addSprite("win_box","./sprites/win_box.png");
        s_oSpriteLibrary.addSprite("coin","./sprites/coin.png");
        s_oSpriteLibrary.addSprite("box","./sprites/box.png");

        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("home","./sprites/btns/home.png");
        s_oSpriteLibrary.addSprite("homeO","./sprites/btns/homeO.png");
        s_oSpriteLibrary.addSprite("homeD","./sprites/btns/homeD.png");
        s_oSpriteLibrary.addSprite("blank","./sprites/btns/blank.png");
        s_oSpriteLibrary.addSprite("blankO","./sprites/btns/blankO.png");
        s_oSpriteLibrary.addSprite("blankD","./sprites/btns/blankD.png");
        s_oSpriteLibrary.addSprite("settingpane","./sprites/btns/settingpane.png");
        s_oSpriteLibrary.addSprite("settingopen","./sprites/btns/settingopen.png");
        s_oSpriteLibrary.addSprite("settingopenO","./sprites/btns/settingopenO.png");
        s_oSpriteLibrary.addSprite("settingopenD","./sprites/btns/settingopenD.png");
        s_oSpriteLibrary.addSprite("settingclose","./sprites/btns/settingclose.png");
        s_oSpriteLibrary.addSprite("settingcloseO","./sprites/btns/settingcloseO.png");
        s_oSpriteLibrary.addSprite("settingcloseD","./sprites/btns/settingcloseD.png");
        s_oSpriteLibrary.addSprite("fullscreen","./sprites/btns/fullscreen.png");
        s_oSpriteLibrary.addSprite("fullscreenO","./sprites/btns/fullscreenO.png");
        s_oSpriteLibrary.addSprite("fullscreenD","./sprites/btns/fullscreenD.png");
        s_oSpriteLibrary.addSprite("ufullscreen","./sprites/btns/ufullscreen.png");
        s_oSpriteLibrary.addSprite("ufullscreenO","./sprites/btns/ufullscreenO.png");
        s_oSpriteLibrary.addSprite("ufullscreenD","./sprites/btns/ufullscreenD.png");
        s_oSpriteLibrary.addSprite("sound","./sprites/btns/sound.png");
        s_oSpriteLibrary.addSprite("soundO","./sprites/btns/soundO.png");
        s_oSpriteLibrary.addSprite("soundD","./sprites/btns/soundD.png");
        s_oSpriteLibrary.addSprite("usound","./sprites/btns/usound.png");
        s_oSpriteLibrary.addSprite("usoundO","./sprites/btns/usoundO.png");
        s_oSpriteLibrary.addSprite("usoundD","./sprites/btns/usoundD.png");
        s_oSpriteLibrary.addSprite("help","./sprites/btns/help.png");
        s_oSpriteLibrary.addSprite("helpO","./sprites/btns/helpO.png");
        s_oSpriteLibrary.addSprite("helpD","./sprites/btns/helpD.png");
        s_oSpriteLibrary.addSprite("autoplay","./sprites/btns/autoplay.png");
        s_oSpriteLibrary.addSprite("autoplayO","./sprites/btns/autoplayO.png");
        s_oSpriteLibrary.addSprite("autoplayD","./sprites/btns/autoplayD.png");
        s_oSpriteLibrary.addSprite("maxbg","./sprites/btns/maxbg.png");
        s_oSpriteLibrary.addSprite("maxbgO","./sprites/btns/maxbgO.png");
        s_oSpriteLibrary.addSprite("maxbgD","./sprites/btns/maxbgD.png");
        s_oSpriteLibrary.addSprite("betup","./sprites/btns/betup.png");
        s_oSpriteLibrary.addSprite("betupO","./sprites/btns/betupO.png");
        s_oSpriteLibrary.addSprite("betupD","./sprites/btns/betupD.png");
        s_oSpriteLibrary.addSprite("betdown","./sprites/btns/betdown.png");
        s_oSpriteLibrary.addSprite("betdownO","./sprites/btns/betdownO.png");
        s_oSpriteLibrary.addSprite("betdownD","./sprites/btns/betdownD.png");
        s_oSpriteLibrary.addSprite("richlife_top","./sprites/richlife_top.png");
        s_oSpriteLibrary.addSprite("richlife_text","./sprites/richlife_text.png");
        s_oSpriteLibrary.addSprite("back","./sprites/btns/back.png");
        s_oSpriteLibrary.addSprite("backO","./sprites/btns/backO.png");
        s_oSpriteLibrary.addSprite("backD","./sprites/btns/backD.png");
        s_oSpriteLibrary.addSprite("spining","./sprites/btns/spining.png");
        s_oSpriteLibrary.addSprite("spiningO","./sprites/btns/spiningO.png");
        s_oSpriteLibrary.addSprite("spiningD","./sprites/btns/spiningD.png");
        s_oSpriteLibrary.addSprite("diamond","./sprites/diamond.png");

        for(var i=1;i<NUM_SYMBOLS+1;i++){
            s_oSpriteLibrary.addSprite("symbol_"+i,"./sprites/symbol_"+i+".png");
        }
        
        for(var j=1;j<NUM_PAYLINES+1;j++){
            s_oSpriteLibrary.addSprite("payline_"+j,"./sprites/lines/"+j+".png");
        }
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);

    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        s_oGameSettings = new CSlotSettings();
        s_oMsgBox = new CMsgBox();
        _oPreloader.unload();

        WIN_OCCURRENCE = _oData.win_occurrence;
        MIN_REEL_LOOPS = _oData.min_reel_loop;
        REEL_DELAY = _oData.reel_delay;
        TIME_SHOW_WIN = _oData.time_show_win;
        TIME_SHOW_ALL_WINS = _oData.time_show_all_wins;
        SLOT_CASH = _oData.slot_cash;
        TOTAL_MONEY = parseFloat(_oData.money);
        FREESPIN_OCCURRENCE = _oData.freespin_occurrence;
        FREESPIN_SYMBOL_NUM_OCCURR = _oData.freespin_symbol_num_occur;
        NUM_FREESPIN = _oData.num_freespin;
        COIN_BET = _oData.coin_bet;
        NUM_SPIN_FOR_ADS = oData.num_spin_ads_showing;
        PAYTABLE_VALUES = new Array();
        for(var i=0;i<10;i++){
            PAYTABLE_VALUES[i] = oData["paytable_symbol_"+(i+1)];
        }
        
        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
                
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    _oData = oData;
    ENABLE_FULLSCREEN = _oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = _oData.check_orientation;
    s_bAudioActive = oData.audio_enable_on_startup;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oAttachSection;
var s_oMain;
var s_oSpriteLibrary;
var s_bLogged = false;
var s_oMsgBox;
var s_oGameSettings;