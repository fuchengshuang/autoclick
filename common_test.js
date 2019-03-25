console.log("commjs..starting.");
platformType = 0;
var pathName = window.location.pathname
if(pathName == "/module/agent/project_detail.html") {
	console.log("---老平台---");
	platformType = 1;
} else if(pathName == "/ngocp/module/agent/project_detail.html") {
	console.log("---新平台---");
	platformType = 2;
} else {
	console.log("---不启动自动抢单---");
	platformType = 0;
}

if(platformType > 0) {
	var walesonc = 0;
	var allcc = 0;
	//本地时间和服务器 误差值
	console.log("倒计时(毫秒):" + ProDet.reserObj.spareSec + ",服务器时间:" + ProDet.reserObj.localTime + "本地时间:" + Util.date.getDatetimes(null) + ",发布时间:" + ProDet.reserObj.releaseTime + ",预备时间(分):" + ProDet.reserObj.reserveTime);
	var timeErrRange = Util.date.str2Date(ProDet.reserObj.localTime) - new Date().getTime() - 200;

	console.log("误差时间:" + timeErrRange);

	// 获取当前时间
	getCurTime: function() {
		return new Date().getTime() + timeErrRange;
	}

	function setBtnText(btn, text) {
		if(btn != null) {
			btn.value = text;
		}
	}
	/**
	 * 判断还有多长时间可以开始倒计时
	 * @param releaseTime 发布时间
	 * @param reserveTime 预留时间
	 */
	exCompareTime: function(releaseTime, reserveTime) {
		var spareSec = 0;
		if(releaseTime && reserveTime) {
			var relTime = Util.date.str2Date(releaseTime),
				relSec = reserveTime * 60 * 1000;
			spareSec = relSec - (getCurTime() - relTime);
		}
		return spareSec < 0 ? 0 : spareSec;
	}

	// 时间倒计时函数
	exTimeCountDown: function() {
		var totalrRmain = exCompareTime(ProDet.reserObj.releaseTime, ProDet.reserObj.reserveTime);
		// 如果已经可以抢单(小于1秒抢单)
		if(totalrRmain < 1000) {
			placeOrder();
		} else {
			if(totalrRmain > 1000) {
				setTimeout(exTimeCountDown, 1000);
			}
			setBtnText(document.getElementById("waleson_auto_click"), ProDet.secsToHMS(totalrRmain));
		}
	}

	function Initlabel() {
		console.log("Initlabel...");
		start = sessionStorage.getItem("ClickStart");
		walesonAddBtn = document.getElementById("waleson_auto_click");
		if(walesonAddBtn != null) {
			if(start == "true") {
				walesonAddBtn.innerHTML = "已开启自动抢单";
			} else {
				walesonAddBtn.innerHTML = "开始自动抢单";
			};
		} else {
			console.log("walesonAddBtn. is null..");
		}
	}

	function placeOrder() {
		sessionStorage.setItem("ClickStart", "true");
		setBtnText(walesonAddBtn, "已开启自动抢单");
	}

	function StartAuto() {
		walesonAddBtn = document.getElementById("waleson_auto_click");
		if(walesonAddBtn != null) {
			//自动定时抢单 1判断是否是倒计时抢单 算出服务器与本地误差时间

			start = sessionStorage.getItem("ClickStart");
			if(start == "true") {
				sessionStorage.setItem("ClickStart", "false");
				//walesonAddBtn.innerHTML = "已停止自动抢单";
				setBtnText(walesonAddBtn, "已停止自动抢单");
			} else {
				ccc = prompt("请输入频率s", "0.2");
				console.log("--ccc--" + ccc);
				if(ccc != null) {
					freq = ccc * 1000;
					if(freq < 50) {
						freq = 50
					};
					sessionStorage.setItem("freq", freq);
					//walesonAddBtn.innerHTML = "已开启自动抢单";
					exTimeCountDown();
				}
			};
		} else {
			window.location.reload();
		}
	}

	function CheckClick() {
		start = sessionStorage.getItem("ClickStart");
		console.log("--CheckClick--" + start);
		if(start == "true") {
			mydate = new Date();
			timeok = false;
			h = mydate.getHours();
			timeok = (h >= 8);
			if(timeok) {
				wbtn = document.getElementById("waleson_auto_click");
				if(wbtn != null) {
					allcc += 100;
					if(allcc >= freq) {
						if($(".J_grab_single").hasClass("j-ishost")) {
							//wbtn.innerHTML = "主项目自动抢单" + walesonc + "次";
							setBtnText(wbtn, "主项目自动抢单" + walesonc + "次");
							if(platformType == 2) {
								//grabSingle(ProDet.busId, null, "isCsb");
							} else {
								//grabSingle(ProDet.busId, "", "", true);
							}

						} else {
							//wbtn.innerHTML = "子项目自动抢单" + walesonc + "次";
							setBtnText(wbtn, "子项目自动抢单" + walesonc + "次");
							//grabSingle(ProDet.busId);
						}

						walesonc += 1;
						allcc = 0;
					};
				} else {
					window.location.reload();
				}

			}
		}
	}

	function AddBtn() {
		console.log("AddBtn...");
		gwaleson = document.getElementsByClassName("pro-get-button-box")[0];
		if(gwaleson) {
			console.log("createElement button..开启自动抢单.");
			br = document.createElement("br")
			abtn = document.createElement("input");
			abtn.innerHTML = "开启自动抢单";
			abtn.setAttribute("class", "btn btn-yellow btn-mid");
			abtn.setAttribute("id", "waleson_auto_click");
			abtn.setAttribute("type", "button");
			abtn.setAttribute("value", "开启自动抢单");
			abtn.setAttribute("onclick", "javascript:StartAuto()");
			if(platformType == 2) {
				abtn.setAttribute("style", "margin-top:8px");
			}
			//gwaleson.appendChild(br)
			gwaleson.appendChild(abtn);
		} else {
			console.log("no pro-get-button-box");
		}
	}

	function initAutoclick() {
		console.log("------- start initAutoclick ---------");
		var abc = sessionStorage.getItem("abc");
		console.log("abc:" + abc);
		if(abc == null) {
			sessionStorage.setItem(abc, true)
		}
		var start = false;
		var freq = 200;
		freq = sessionStorage.getItem("freq");
		if(freq == "") {
			freq = 200
		};
		setInterval("CheckClick()", 100);
		AddBtn();
		Initlabel();
	}

	if(platformType == 2) {
		setTimeout(initAutoclick, 1000);
	} else {
		initAutoclick();
	}
}