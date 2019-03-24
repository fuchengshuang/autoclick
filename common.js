
console.log("commjs..starting.");
var walesonc=0;
var allcc=0;
var pathName=window.location.pathname

function isNewPt(){
	if(pathName == "/ngocp/module/agent/project_detail.html"){
		console.log("---新平台---");
		return true;
	}
	console.log("---老平台---");
	return false;
}

function Initlabel(){
  console.log("Initlabel...");
  start=sessionStorage.getItem("ClickStart");
  walesonAddBtn=document.getElementById("waleson_auto_click");
  if(walesonAddBtn!=null){   
      if(start=="true"){         
         walesonAddBtn.innerHTML="已开启自动抢单";          
      }else{
         walesonAddBtn.innerHTML="开始自动抢单"; 
      };
   }else{
    console.log("walesonAddBtn. is null..");
   }
}

function StartAuto(){  
  walesonAddBtn=document.getElementById("waleson_auto_click");
  if(walesonAddBtn!=null){   
      start=sessionStorage.getItem("ClickStart");
      if(start=="true"){
         sessionStorage.setItem("ClickStart", "false"); 
         walesonAddBtn.innerHTML="已停止自动抢单";          
      }else{
         ccc=prompt("请输入频率s","0.2");
         if(ccc!=null){
         freq=ccc*1000; 
         if (freq<50){freq=50};
         sessionStorage.setItem("freq", freq); 
         sessionStorage.setItem("ClickStart", "true");   
         walesonAddBtn.innerHTML="已开启自动抢单"; 
         }
      };
   }else{
    window.location.reload();   
   }
}


function CheckClick()
{
  start=sessionStorage.getItem("ClickStart");
  if(start=="true"){
    mydate=new Date();
    timeok=false;
    h=mydate.getHours();
    timeok=(h>=8);
    if(timeok){
        wbtn=document.getElementById("waleson_auto_click");
        if (wbtn!=null){
          allcc+=100;
          if (allcc>=freq){
               if($(".J_grab_single").hasClass("j-ishost")){ 
                   wbtn.innerHTML="主项目自动抢单"+walesonc+"次";
				   if(isNewPt()){
						grabSingle(ProDet.busId,null,"isCsb");
				   }else{
					    grabSingle(ProDet.busId,"","",true);
				   }
                   
               }else{
                   wbtn.innerHTML="子项目自动抢单"+walesonc+"次";
                   grabSingle(ProDet.busId);
               }
                
                walesonc+=1;                
                allcc=0;
          };          
         }else{          
          window.location.reload();          
        }      

    }    
  }
}

function AddBtn(){
  console.log("AddBtn...");
  gwaleson=document.getElementsByClassName("pro-get-button-box")[0];
  if(gwaleson){
   console.log("createElement button..开启自动抢单.");
   br=document.createElement("br")
   abtn=document.createElement("a");
   abtn.innerHTML="开启自动抢单";
   abtn.setAttribute("class","btn btn-yellow btn-mid");
   abtn.setAttribute("id","waleson_auto_click");
   abtn.setAttribute("href", "javascript:StartAuto()");
   if(isNewPt()){
	   abtn.setAttribute("style", "margin-top:8px");
   }
   //gwaleson.appendChild(br)
   gwaleson.appendChild(abtn); 
  }else{
    console.log("no pro-get-button-box");
  }
}

function initAutoclick(){
	console.log("------- start initAutoclick ---------");
	var start=false;
	var freq=200;
	freq=sessionStorage.getItem("freq");
	if(freq==""){freq=200};
	setInterval("CheckClick()",100);
	AddBtn();
	Initlabel();
}

if(isNewPt()){
	setTimeout(initAutoclick, 1000);
}else{
	initAutoclick();
}






