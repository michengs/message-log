'use strict'
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` } ;
String.prototype.stripHTML = function () { return this.replace(/<[^>]+>/g, '') };
const Last_Hook = { order: 100010 }, Last_Hookfn = { order: 100010, filter: { fake: null } };
const fs = require('fs');
const path = require('path');
    let    logFile0 = fs.createWriteStream('密语记录.txt', { flags: 'a' });
    let    logFile00 = fs.createWriteStream('一般记录.txt', { flags: 'a' });	
    let    logFile1 = fs.createWriteStream('聊天记录.txt', { flags: 'a' });
    let    logFile2 = fs.createWriteStream('公会记录.txt', { flags: 'a' });
    let    logFile3 = fs.createWriteStream('领地记录.txt', { flags: 'a' });	
    let    logFile4 = fs.createWriteStream('交易记录.txt', { flags: 'a' });		
    let    logFile27 = fs.createWriteStream('世界记录.txt', { flags: 'a' });	
    let gameme;
	let voice = null;
	let speak_voice = false;
try { voice = require('voice') }
catch(e) { voice = null; }
module.exports = function messagelog(mod) {
const { command } = mod.require

  //--------------------------------------------------------------------------------------------------------------------------------------
  let   SUsers = {},
        MyGameId,
		MyGamemeId,
		HUsers = {};
  let hidde = false;
    enableHook();
 	function enableHook() {
		logFile0.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);
		logFile1.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);
		logFile2.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);
		logFile3.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);		
		logFile4.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);
		logFile27.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);
		logFile00.write(`<---- ${getTime(Date.now())} 开始记录 ---->\r\n`);		
	}
	mod.hook('S_LOGIN', 14, sLogin)  //  
 	mod.hook('S_LOAD_TOPO', 'raw', sLoadTopo)//
	mod.hook('S_SPAWN_USER', 15, Last_Hook, sSpawnUser)//
	mod.hook('S_USER_LOCATION', 5, sUserLocation)//	
	mod.hook('S_DEAD_LOCATION', 2, sDeadLocation)	//
	mod.hook('S_DESPAWN_USER', 3, Last_Hook, sDespawnUser)//
	mod.hook('S_USER_STATUS', 3, sUserStatus)//
	mod.hook('S_UNMOUNT_VEHICLE', 2, sUnmountVehicle)//	
	mod.hook('S_MOUNT_VEHICLE', 2, sMountVehicle)	//
	mod.hook('S_LOGIN', 14, (event) => {
		MyGamemeId = event.name
		
	})	
  mod.hook('S_CHAT', 3, event => {
    if (event.channel < 11 || event.channel > 18) {	
    if (event.channel == 1) {  
       logFile1.write(`${getTime(Date.now())}  组队 ：   ${event.name}      ：     ${event.message.stripHTML()}\n`);			
			if(voice){
			if (!speak_voice)	return
			if (event.name === MyGamemeId) {
		     gameme = "";
			} else {
		     gameme = event.name + '说';		  
			}	
           voice.speak(  gameme  + event.message.stripHTML(),1)			  
			}
           }   
    if (event.channel == 2) {  
       logFile2.write(`${getTime(Date.now())}  公会 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		 
    }
    if (event.channel == 3) {  
       logFile3.write(`${getTime(Date.now())}  领地 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		 
    }	
    if (event.channel == 4) {  
       logFile4.write(`${getTime(Date.now())}  交易 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		
    }
    if (event.channel == 27) { 
       logFile27.write(`${getTime(Date.now())}  世界 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		 
    }
    if (event.channel == 0) { 
       logFile00.write(`${getTime(Date.now())}  一般 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		 
    }	
    }
  });
	mod.hook('S_WHISPER', 3, (event) => { 
     logFile0.write(`${getTime(Date.now())}  密语 ：    ${event.name}      ：     ${event.message.stripHTML()}\n`);		
	})
	function getTime(thisTime) {
		var Time = new Date(thisTime)
		return	add_0(Time.getMonth()+1) + "/" + add_0(Time.getDate()) + " " +
				add_0(Time.getHours())   + ":" + add_0(Time.getMinutes())
	}	
	function add_0(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}	
	function sLoadTopo() {
		SUsers = {};
		HUsers = {};
	}
	function sSpawnUser(event) {
		SUsers[event.gameId] = event;
		SUsers[event.gameId].spawnFx = 1;
		if (hidde) {
			HUsers[event.gameId] = event;
			HUsers[event.gameId].spawnFx = 1;
			return false;
		}
	}	
		
	command.add(['语音'], ( )=> {
	 speak_voice = !speak_voice
     command.message(`语音播报已 ${speak_voice?"on":"off"}.`);	
	 }); 	
	

	command.add(['1'], ( )=> {
	 hidde = !hidde
	 if(hidde) {
	 HideAllPlayers()
	 }
	 if(!hidde) {
      ShowAllPlayers()
	 }	
	 }); 	
	mod.hook('C_USE_ITEM', 3, event => {
		if(event.id == 6560) {
	 hidde = !hidde
	 if(hidde) {
	 HideAllPlayers()
	 }
	 if(!hidde) {
      ShowAllPlayers()
	 }
			return false;
		}
	});	
	function ShowAllPlayers() {
		for (let i in HUsers) {
			mod.toClient('S_SPAWN_USER', 15, HUsers[i]);
			delete HUsers[i];
		}
	}
	function HideAllPlayers() {

			for (let i in SUsers) {
				mod.toClient('S_DESPAWN_USER', 3, { gameId: SUsers[i].gameId, type: 1 });
				HUsers[SUsers[i].gameId] = SUsers[i];
				HUsers[SUsers[i].gameId].spawnFx = 1;
			}
		
	}
	function sMountVehicle(event) {
		if (EqGid(event.gameId)) return;
		SUsers[event.gameId].mount = event.id;
		if (HUsers[event.gameId]) HUsers[event.gameId].mount = event.id;
	}	
	function sUnmountVehicle(event) {
		if (EqGid(event.gameId)) return;
		SUsers[event.gameId].mount = 0;
		if (HUsers[event.gameId]) HUsers[event.gameId].mount = 0;
	}	
	function sUserLocation(event) {
		if (SUsers[event.gameId]) {
			SUsers[event.gameId].loc = event.dest;
			SUsers[event.gameId].w = event.w;
		}
		if (HUsers[event.gameId]) {
			HUsers[event.gameId].loc = event.dest;
			HUsers[event.gameId].w = event.w;
			return false;
		}
	}
	function sDeadLocation(event) {
		if (SUsers[event.gameId]) SUsers[event.gameId].loc = event.loc;
		if (HUsers[event.gameId]) HUsers[event.gameId].loc = event.loc;
	}	
	function sDespawnUser(event) {
		delete HUsers[event.gameId];
		delete SUsers[event.gameId];
	}
	function sUserStatus(event) {
		if (SUsers[event.gameId]) SUsers[event.gameId].status = event.status;
		if (HUsers[event.gameId]) {
			HUsers[event.gameId].status = event.status;
			return false;
		}
	}	
	function sDeadLocation(event) {
		if (SUsers[event.gameId]) SUsers[event.gameId].loc = event.loc;
		if (HUsers[event.gameId]) HUsers[event.gameId].loc = event.loc;
	}	
	function EqGid(xg) {
		return (xg === MyGameId);
	}

 //---------------------------------------------------------------------------------------------------------- 
	function sLogin(event) {
		MyGameId = event.gameId;
	}
	mod.hook('S_ANSWER_INTERACTIVE', 2, (event) => {
		mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 2, {
			name: event.name
		})
	});	
command.add('b', () => { mod.send('S_NPC_MENU_SELECT', 1, { type: 28 }) })

	this.destructor = function () {
   {
		logFile0.write(`<---- ${getTime(Date.now())} 结束记录 ---->\r\n`);
		logFile1.write(`<---- ${getTime(Date.now())} 结束记录 ---->\r\n`);
		logFile2.write(`<---- ${getTime(Date.now())} 结束记录 ---->\r\n`);	
		logFile4.write(`<---- ${getTime(Date.now())} 结束记录 ---->\r\n`);
		logFile27.write(`<---- ${getTime(Date.now())} 结束记录 ---->\r\n`);
		}
	}	
}
 