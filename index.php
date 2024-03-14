<?php include('../../session.php'); ?>
<?php

    $wallet_stmt = $conexion->prepare("SELECT id_wallet,balance FROM pl7_wallet WHERE id_usr = ? AND wallet_act = 'y'");
    $wallet_stmt->bind_param('i', $sys_usr);
    $wallet_stmt->execute();
    //$wallet_result = $wallet_stmt->get_result();
    $wallet_obj=$wallet_stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0];
    $wallet_balance = $wallet_obj['balance'];
    $wallet_id= $wallet_obj['id_wallet'];

    $game_id = 6;
    $jackpot_stmt = $conexion->prepare("SELECT balance FROM pl7_jackpot WHERE game_id = ? ");
    $jackpot_stmt->bind_param('i', $game_id);
    $jackpot_stmt->execute();
    //$wallet_result = $jackpot_stmt->get_result();
    $jackpot_obj=$jackpot_stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0];
    $jackpot_balance = $jackpot_obj['balance'];
?>

<!DOCTYPE html>
<html>
<head>
        <title>Loteria</title>
        <link rel="stylesheet" href="css/reset.css" type="text/css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="css/orientation_utils.css" type="text/css">
        <link rel='shortcut icon' type='image/x-icon' href='./logo.jpg' />
        <link rel="stylesheet" href="css/ios_fullscreen.css" type="text/css">

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
	    <meta name="msapplication-tap-highlight" content="no"/>

        <script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
        <script type="text/javascript" src="js/createjs-2015.11.26.min.js"></script>
        <script type="text/javascript" src="js/howler.min.js"></script>
        <script type="text/javascript" src="js/screenfull.js"></script>
        <script type="text/javascript" src="js/platform.js"></script>
        <script type="text/javascript" src="js/ios_fullscreen.js"></script>
        <script type="text/javascript" src="js/ctl_utils.js"></script>
        <script type="text/javascript" src="js/sprite_lib.js"></script>
        <script type="text/javascript" src="js/settings.js"></script>
        <script type="text/javascript" src="js/CSlotSettings.js"></script>
        <script type="text/javascript" src="js/CLang.js"></script>
        <script type="text/javascript" src="js/CPreloader.js"></script>
        <script type="text/javascript" src="js/CMain.js"></script>
        <script type="text/javascript" src="js/CTextButton.js"></script>
        <script type="text/javascript" src="js/CGfxButton.js"></script>
        <script type="text/javascript" src="js/CBetToggle.js"></script>
        <script type="text/javascript" src="js/CToggle.js"></script>
        <script type="text/javascript" src="js/CBetBut.js"></script>
        <script type="text/javascript" src="js/CMenu.js"></script>
        <script type="text/javascript" src="js/CGame.js"></script>
        <script type="text/javascript" src="js/CReelColumn.js"></script>
        <script type="text/javascript" src="js/CInterface.js"></script>
        <script type="text/javascript" src="js/CPayTablePanel.js"></script>
        <script type="text/javascript" src="js/CHelpPanel.js"></script>
        <script type="text/javascript" src="js/CStaticSymbolCell.js"></script>
        <script type="text/javascript" src="js/CTweenController.js"></script>
        <script type="text/javascript" src="js/CMsgBox.js"></script>
        <script type="text/javascript" src="js/CVector2.js"></script>
        <script type="text/javascript" src="js/CFormatText.js"></script>
        <script type="text/javascript" src="js/CWheelBonus.js"></script>
        <script type="text/javascript" src="js/CBonusPanel.js"></script>
        <script type="text/javascript" src="js/CDouble.js"></script>
        <script type="text/javascript" src="js/CFreeSpinSetting.js"></script>
        <script type="text/javascript" src="js/CFreeSpinWin.js"></script>
        <script type="text/javascript" src="js/CJackpot.js"></script>
        <script type="text/javascript" src="js/CLedsBonus.js"></script>
	    <script type="text/javascript" src="js/CSlotLogic.js"></script>
        <script type="text/javascript" src="js/CCreditsPanel.js"></script>
        <script type="text/javascript" src="js/CCTLText.js"></script>
    </head>
    <body ondragstart="return false;" ondrop="return false;" >
	<div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%"></div>
          <script>
            $(document).ready(function(){
                    var oMain = new CMain({
                        win_occurrence: 30,       //WIN PERCENTAGE.SET A VALUE FROM 0 TO 100.
                        slot_cash: <?php echo $jackpot_balance ?>,          //THIS IS THE CURRENT SLOT CASH AMOUNT. THE GAME CHECKS IF THERE IS AVAILABLE CASH FOR WINNINGS.
                        min_reel_loop:0,          //NUMBER OF REEL LOOPS BEFORE SLOT STOPS  
                        reel_delay: 2,            //NUMBER OF FRAMES TO DELAY THE REELS THAT START AFTER THE FIRST ONE
                        time_show_win:2000,       //DURATION IN MILLISECONDS OF THE WINNING COMBO SHOWING
                        time_show_all_wins: 2000, //DURATION IN MILLISECONDS OF ALL WINNING COMBO
                        money:<?php echo $wallet_balance ?>,                //STARING CREDIT FOR THE USER
                        freespin_occurrence: 15,   //IF USER MUST WIN, SET THIS VALUE FOR FREESPIN OCCURRENCE
                        jackpot_occurrence: 10000,    
                        bonus_occurrence:5,       //IF USER MUST WIN, SET THIS VALUE FOR BONUS OCCURRENCE
                        freespin_symbol_num_occur:[90,10,5,1],//WHEN PLAYER GET FREESPIN, THIS ARRAY GET THE OCCURRENCE OF RECEIVING 3,4 OR 5 FREESPIN SYMBOLS IN THE WHEEL
                        num_freespin: [4,6,8],     //THIS IS THE NUMBER OF FREESPINS IF IN THE FINAL WHEEL THERE ARE 3,4 OR 5 FREESPIN SYMBOLS
                        bonus_prize:      [10,30,60,90,0,20,60,120,200,0,40,30,20,10,0,80,60,40,1000,0],//THIS IS THE LIST OF BONUS PRIZES. KEEP BEST PRIZE IN PENULTIMATE POSITION IN ARRAY
                        bonus_prize_occur: [6, 6, 6, 5,6, 5, 4,  3,  1,5, 5, 6, 7, 5,4, 4, 5, 5,   1,4],//OCCURRENCE FOR EACH PRIZE IN BONUS_PRIZES. HIGHER IS THE NUMBER, MORE POSSIBILITY OF OUTPUT HAS THE PRIZE
                        coin_bet:[0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25], //COIN BET VALUES
                        /***********PAYTABLE********************/
                        //EACH SYMBOL PAYTABLE HAS 5 VALUES THAT INDICATES THE MULTIPLIER FOR X1,X2,X3,X4 OR X5
                        paytable_symbol_1: [0,0,25,40,150], //PAYTABLE FOR SYMBOL 1
                        paytable_symbol_2: [0,0,50,250,1500], //PAYTABLE FOR SYMBOL 2
                        paytable_symbol_3: [0,0,50,250,1000], //PAYTABLE FOR SYMBOL 3
                        paytable_symbol_4: [0,0,40,150,750],  //PAYTABLE FOR SYMBOL 4
                        paytable_symbol_5: [0,0,30,100,500],   //PAYTABLE FOR SYMBOL 5
                        paytable_symbol_6: [0,0,30,50,200],   //PAYTABLE FOR SYMBOL 6
                        paytable_symbol_7: [0,0,25,50,175],   //PAYTABLE FOR SYMBOL 7
                        paytable_symbol_8: [0,0,100,1000,10000],   //PAYTABLE FOR SYMBOL 8
                        paytable_symbol_9: [0,0,20,30,125],   //PAYTABLE FOR SYMBOL 9
                        paytable_symbol_10: [0,2,5,20,400],   //PAYTABLE FOR SYMBOL 10
                        paytable_symbol_11: [0,0,15,20,100],   //PAYTABLE FOR SYMBOL 11
                        paytable_symbol_12: [0,0,10,20,75],   //PAYTABLE FOR SYMBOL 12
                        
                        audio_enable_on_startup:false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                        fullscreen:true,                       //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
                        check_orientation:true,                //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                        show_credits:true,                     //ENABLE/DISABLE CREDITS BUTTON IN THE MAIN SCREEN
                        num_spin_ads_showing:10     //NUMBER OF SPIN TO COMPLETE, BEFORE TRIGGERING AD SHOWING.
                        //// THIS FUNCTIONALITY IS ACTIVATED ONLY WITH CTL ARCADE PLUGIN.///////////////////////////
                        /////////////////// YOU CAN GET IT AT: /////////////////////////////////////////////////////////
                        // http://codecanyon.net/item/ctl-arcade-wordpress-plugin/13856421 ///////////
                    });

                    $(oMain).on("start_session", function (evt) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeStartSession();
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("end_session", function (evt) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeEndSession();
                        }
						window.location.href='../../home.php';
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });
                    
                    $(oMain).on("bet_placed", function (evt, oBetInfo) {
                        var iBet = oBetInfo.bet;
                        var iTotBet = oBetInfo.tot_bet;
                        //...ADD YOUR CODE HERE EVENTUALLY
						if(iTotBet != 0)
							update_balance(-iTotBet);
                    });
                    
                    $(oMain).on("bonus_start", function (evt) {
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("bonus_end", function (evt, iMoney, bonusChange) {
                        //...ADD YOUR CODE HERE EVENTUALLY
						if(bonusChange != '0')
							update_balance(bonusChange);
                    });
                    
                    $(oMain).on("save_score", function (evt, iMoney, change) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeSaveScore({score:iMoney});
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
						if(change > 0){
							update_balance(change);
						}
                    });

                    $(oMain).on("show_interlevel_ad", function (evt) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeShowInterlevelAD();
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("share_event", function (evt, oData) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeShareEvent(oData);
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });
                     
                    if(isIOS()){
                        setTimeout(function(){sizeHandler();},200); 
                    }else{ 
                        sizeHandler(); 
                    }
            });

			function update_balance(c){
                $.ajax({
                    url:'../../wallet_services.php',
                    async:false,
                    method:'POST',
                    data:{
                        g:6,
                        bc:c,
                        w:<?php echo $wallet_id ?>
                    },
                    success: data => {
                        tData = JSON.parse(data);
                        s_aSession["iSlotCash"] = parseFloat(tData.jackpot_balance);
                    },
                    error: data => {
                        
                    }
                });
		    }

        </script>
        
        <div class="check-fonts">
            <p class="check-font-1">test 1</p>
        </div> 

        <div class="preloader" id="preloader">
            <div class="chicken"></div>
            <div class="load_gif"></div>
        </div>
        
        <canvas id="canvas" class='ani_hack' width="1500" height="640"> </canvas>
	<div data-orientation="landscape" class="orientation-msg-container"></div>
        <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>
    </body>
</html>