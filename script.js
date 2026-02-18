const apiKey = "b0960a6831bad00a102e0b9f48045b6c";

setInterval(()=>{
    const now = new Date();
    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
},1000);

// const hour = new Date().getHours();
// let greet;

// if(hour >= 0 && hour < 12){
//     greet = "Good Morning ☀";
// }
// else if(hour >= 12 && hour < 18){
//     greet = "Good Afternoon 🌤";
// }
// else{
//     greet = "Good Evening 🌙";
// }

document.getElementById("greeting").innerText = greet;

async function fetchWeather(url){
    loader(true);

    const res = await fetch(url);
    const data = await res.json();

    loader(false);

    if(data.cod != 200){
        alert("City not found");
        return;
    }

    showWeather(data);
}

function getWeather(){
    const city = document.getElementById("cityInput").value;
    if(!city) return alert("Enter city");

    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
}

function getLocationWeather(){
    navigator.geolocation.getCurrentPosition(

        // success
        pos=>{
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        },

        // error
        err=>{
            alert("Location access denied or unavailable");
            console.log(err);
        }

    );
}
function showWeather(data){
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("city").innerText = data.name;
    document.getElementById("temp").innerText = data.main.temp + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    document.getElementById("extra").innerText =
        "Humidity " + data.main.humidity + "% | Wind " + data.wind.speed + " km/h";

    changeBackground(data.weather[0].main);
    getForecast(data.coord.lat, data.coord.lon);
}

function loader(show){
    document.getElementById("loader").classList.toggle("hidden", !show);
}

function changeBackground(weather){
    let bg;

    if(weather.includes("Cloud")) bg="linear-gradient(120deg,#d7d2cc,#304352)";
    else if(weather.includes("Rain")) bg="linear-gradient(120deg,#4e54c8,#8f94fb)";
    else if(weather.includes("Clear")) bg="linear-gradient(120deg,#fceabb,#f8b500)";
    else if(weather.includes("Snow")) bg="linear-gradient(120deg,#e6dada,#274046)";
    else bg="linear-gradient(120deg,#89f7fe,#66a6ff)";

    document.body.style.background = bg;
}

async function getForecast(lat,lon){

const res = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
);

const data = await res.json();

const box = document.getElementById("forecast");
box.innerHTML="";

data.list
.filter(item => item.dt_txt.includes("12:00"))
.forEach(day=>{

box.innerHTML += `
<div class="day">
<p>${new Date(day.dt_txt).toLocaleDateString()}</p>
<p>${Math.round(day.main.temp)}°C</p>
</div>
`;

});
}

