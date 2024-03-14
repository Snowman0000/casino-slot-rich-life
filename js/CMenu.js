function CMenu(){
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButFullscreen;
    var _oBg;
    var _oFade;
    
    this._init = function(){
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
    };
    
    this.unload = function(){
        s_oAttachSection.removeChild(_oBg);
        _oBg = null;
        
        s_oAttachSection.removeChild(_oFade);
        _oFade = null;
        
        s_oMenu = null;
    };
    
    this._onButPlayRelease = function(){
        tryCheckLogin();
    };
    
    this.exitFromMenu = function(){
        this.unload();
        s_oMain.gotoGame();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButCreditsRelease = function(){
        new CCreditsPanel();
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };


    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;