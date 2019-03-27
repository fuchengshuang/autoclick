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
	var freq = 1000;
	var exEndTime = 0;
	var start = "0"; //0正常 1定时2启动
	//本地时间和服务器 误差值
	function toExamineTime() {
		var exBeginT = new Date().getTime();
		$.ajax({
			type: "GET",
			async: false,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType: "json",
			url: "http://quan.suning.com/getSysTime.do",
			success: function(data) {
				var reT = new Date().getTime() - exBeginT;
				console.log("请求完成时间:" + reT);
				console.log(data.sysTime2);
				console.log("本地时间:" + Util.date.getDatetime(null));
				console.log(Util.date.str2Date(data.sysTime2) - new Date().getTime() + reT);
			}

		});
	}
	toExamineTime();
	console.log("倒计时(毫秒):" + ProDet.reserObj.spareSec + ",服务器时间:" + ProDet.reserObj.localTime + "本地时间:" + Util.date.getDatetimes(null) + ",发布时间:" + ProDet.reserObj.releaseTime + ",预备时间(分):" + ProDet.reserObj.reserveTime);
	var timeErrRange = 500;
	if(ProDet.reserObj.localTime) {
		timeErrRange = Util.date.str2Date(ProDet.reserObj.localTime) - new Date().getTime() - 200;
	}

	function nowValid() {
		var a = $('.pro-get-button-box a');
		var nowValid = true;
		if(a != null) {
			for(var i = 0; i < a.length; i++) {　　
				console.log("classList:" + a[i].classList);
				if(a[i].classList.contains('btn-disabled') == true) {　　　　
					nowValid = false;
					break;
				}
			}
		}
		return nowValid;

	}
	// 获取当前时间
	function getCurTime() {
		return new Date().getTime() + timeErrRange;
	}

	console.log("误差时间:" + timeErrRange + ",curT:" + getCurTime());

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
	function exCompareTime() {
		if(exEndTime == null || exEndTime == '0') {
			return 0;
		}
		var spareSec = exEndTime - getCurTime();
		console.log("开始抢单时间:" + exEndTime + ",倒计时:" + spareSec);
		return spareSec;

	}

	// 时间倒计时函数
	function exTimeCountDown() {
		start = sessionStorage.getItem("ClickStart");
		if(start == 1) {
			var totalrRmain = exCompareTime();
			// 如果已经可以抢单(小于1秒抢单)
			if(totalrRmain < 1000) {
				placeOrder();
			} else {
				setTimeout(exTimeCountDown, 1000);
				setBtnText(document.getElementById("waleson_auto_click"), ProDet.secsToHMS(totalrRmain));
			}
		}

	}

	//	function getBasicInfo() { //  /data/homeData.json
	//		var linkHref = "/front/agent/homeOutBoundBusiness!getOutboundDealInfoData?uid=home0005";
	//		Util.ajax.postJson(linkHref, {
	//			"campaignId": ProDet.busId,
	//			"mainCampaignId": hostId
	//		}, function(result) {
	//			console.log("result:" + result)
	//			if(result.returnCode != 0) {
	//				return;
	//			}
	//		});
	//	}

	function Initlabel() {
		console.log("Initlabel...");
		start = sessionStorage.getItem("ClickStart");
		walesonAddBtn = document.getElementById("waleson_auto_click");
		if(walesonAddBtn != null) {
			if(start == "2") {
				walesonAddBtn.innerHTML = "已开启自动抢单";
			} else {
				walesonAddBtn.innerHTML = "开始自动抢单";
			};
		} else {
			console.log("walesonAddBtn. is null..");
		}
	}

	function placeOrder() {
		sessionStorage.setItem("ClickStart", "2");
		setBtnText(walesonAddBtn, "已开启自动抢单");
	}

	function StartAuto() {
		walesonAddBtn = document.getElementById("waleson_auto_click");
		if(walesonAddBtn != null) {
			//自动定时抢单 1判断是否是倒计时抢单 算出服务器与本地误差时间

			start = sessionStorage.getItem("ClickStart");
			if(start == "2" || start == "1") {
				sessionStorage.setItem("ClickStart", "0");
				//walesonAddBtn.innerHTML = "已停止自动抢单";
				setBtnText(walesonAddBtn, "已停止自动抢单");
			} else {
				ccc = prompt("频率(秒),抢单时间", "1");
				console.log("--ccc--" + ccc);
				if(ccc != null) {
					var arrs = ccc.split(",")
					if(arrs == null || arrs.length > 2) {
						alert("错误:参数格式不正确")
						return;
					}
					freq = arrs[0] * 1000;
					if(freq < 50) {
						freq = 50
					};
					if(arrs.length > 1) {
						exEndTime = Util.date.str2Date(Util.date.getDate(null) + " " + arrs[1] + ":00");
					}
					sessionStorage.setItem("freq", freq);
					//walesonAddBtn.innerHTML = "已开启自动抢单";
					sessionStorage.setItem("ClickStart", "1");
					exTimeCountDown();
				}
			};
		} else {
			window.location.reload();
		}
	}

	function CheckClick() {
		start = sessionStorage.getItem("ClickStart");
		if(start == "2") {
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
							setBtnText(wbtn, "主项目抢单" + walesonc + "次");
							if(platformType == 2) {
								grabSingle(ProDet.busId, null, "isCsb");
							} else {
								grabSingle(ProDet.busId, "", "", true);
							}

						} else {
							//wbtn.innerHTML = "子项目自动抢单" + walesonc + "次";
							setBtnText(wbtn, "子项目抢单" + walesonc + "次");
							grabSingle(ProDet.busId);
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
		freq = sessionStorage.getItem("freq");
		if(freq == "") {
			freq = 1000
		};
		setInterval("CheckClick()", 100);
		AddBtn();
		Initlabel();
	}
	setTimeout(initAutoclick, 1000);
}