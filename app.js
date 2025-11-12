const body=document.getElementById("body")

const main=document.getElementById("weatherInfo")

const input=document.getElementById("input")

const city=document.getElementById("city")
const temperature=document.getElementById("temperature")
const icon=document.getElementById("icon")
const iconDes=document.getElementById("iconDes")

const wind=document.getElementById("wind")
const pressure=document.getElementById("pressure")
const clouds=document.getElementById("clouds")
const sunrise=document.getElementById("sunrise")
const sunriseImg=document.getElementById("sunriseImg")

const nextDays=document.getElementById("nextDays")
const day=document.getElementById("day")
const cloneday=day.cloneNode(true)

let canRender=true

colors=["#888282", "#0097ff"]



input.addEventListener("keyup", function(event) {
    if (event.key === "Enter" && canRender) {
        console.log(input.value)
        GetData(input.value)
        canRender=false
    }
});

async function GetData(city){
    const today=await fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=6b71140880b323e28c07717a319445c7&units=metric&lang=pl")
    const days=await fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=6b71140880b323e28c07717a319445c7&units=metric&lang=pl")

    const data=await today.json()
    const dataDays=await days.json()
    nextDays.innerHTML=null
    RenderDays(dataDays)
    RenderToday(data)
}


async function RenderToday(x){
    const cloneMain=main.cloneNode(true)
    cloneMain.style.zIndex=-1
    cloneMain.classList.add("clone")
    cloneMain.id="clone"

    body.appendChild(cloneMain)

    
    main.style.zIndex=22;
    let slonce=x.sys.sunset
    let zachod=true
    let teraz=Number(Date.now().toString().slice(0, -3))
    if(slonce<teraz){
        slonce=x.sys.sunrise
        zachod=false
    }
    city.innerText=x.name
    temperature.innerText=Round(x.main.temp)+"°C"
    icon.setAttribute("src","./zdj/"+x.weather[0].main+".png")
    iconDes.innerText=x.weather[0].description
    
    if(x.weather[0].main=="Clear"){
        bgColor=colors[1]
    }else{
        bgColor=colors[0]
    }

    
    main.style.background="linear-gradient(0deg, rgba(255,255,255,1) 20%, "+bgColor+" 100%)"    
    
    wind.innerText=x.wind.speed+" m/s"
    pressure.innerText=x.main.pressure+" hPa"
    clouds.innerText=x.clouds.all+" chmur"
    sunrise.innerText=GetTime(slonce+x.timezone-7200)
    sunriseImg.setAttribute("src",zachod?"./zdj/sunset.png":"./zdj/sunrise.png")

    let clone=document.getElementById("clone")


            
    await main.classList.add("slide-top")

    await clone.classList.add("slide-top2")
    await sleep(1000);
    clone.remove()
    await sleep(1000);
    await main.classList.remove("slide-top")
      

    canRender=true
}

function RenderDays(x){
    let lista=Object.values(x.list)
    lista=lista.filter(x=>x.dt_txt.includes("15:00:00"))

    lista.forEach(x=>{
        let clone=day.cloneNode(true)
        let childs=clone.childNodes
        childs[1].innerText=x.dt_txt.slice(11,16)
        childs[3].innerText=Round(x.main.temp)+"°C"
        childs[5].setAttribute("src","./zdj/"+x.weather[0].main+".png")
        childs[7].innerText=getDayName(x.dt_txt.slice(0,10,"pl-PL"))
        //console.log()

        nextDays.appendChild(clone)
    })
}

GetData("Minsk Mazowiecki");


function GetTime(timestamp){
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
}

function Round(x){
    const roundedString = x.toFixed(0);
    return Number(roundedString);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'short' });        
}