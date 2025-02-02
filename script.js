const API_KEY = "cc8510b0bb874587ac7161837250202";

const translations = {
    vi: {
      title: "Thời Tiết",
      weatherBtn: "Xem Thời Tiết",
      temperatureInfo: "Nhiệt độ hiện tại là",
      season: "Mùa",
      error: "Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau!",
      advice: "Hãy bật điều hòa để giữ mát!",
      coatAdvice: "Hãy mặc thêm áo ấm, nhiệt độ hiện tại là",
      enjoyOutdoors: "Hãy ra ngoài trời tận hưởng không khí trong lành!"
    },
    en: {
      title: "Weather",
      weatherBtn: "Check Weather",
      temperatureInfo: "Current temperature is",
      season: "Season",
      error: "Could not fetch weather data. Please try again later!",
      advice: "Turn on the air conditioner to stay cool!",
      coatAdvice: "Put on a coat, the current temperature is",
      enjoyOutdoors: "Go outside and enjoy the fresh air!"
    }
};

let currentLang = 'vi';  // Mặc định ngôn ngữ là Tiếng Việt

// Hàm thay đổi ngôn ngữ
function changeLanguage() {
  const lang = document.getElementById('languageSwitcher').value;
  currentLang = lang;
  updateContent();
}

// Hàm cập nhật nội dung theo ngôn ngữ
function updateContent() {
  document.getElementById('title').innerText = translations[currentLang].title;
  document.getElementById('weatherBtn').innerText = translations[currentLang].weatherBtn;
}

// Hàm lấy địa chỉ IP
async function getIp() {
  const response = await fetch("https://api64.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
}

// Hàm lấy vị trí từ IP
async function getLocation(ip) {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();
  return data;
}

// Hàm lấy nhiệt độ từ WeatherAPI
async function getTemperature(lat, lon) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`);
  const data = await response.json();
  return data.current.temp_c;
}

// Hàm xác định mùa hiện tại
function getSeason() {
  const month = new Date().getMonth() + 1;  // getMonth() trả về giá trị từ 0 đến 11
  if (month >= 1 && month <= 4) {
    return currentLang === 'vi' ? "Mùa Xuân" : "Spring";
  } else if (month >= 5 && month <= 8) {
    return currentLang === 'vi' ? "Mùa Hạ" : "Summer";
  } else if (month >= 9 && month <= 11) {
    return currentLang === 'vi' ? "Mùa Thu" : "Fall";
  } else {
    return currentLang === 'vi' ? "Mùa Đông" : "Winter";
  }
}

// Hàm in nhiệt độ với màu sắc và lời khuyên
function printTemperature(nhiet_do, season) {
  let colorCode = '';
  let advice = '';

  // Các điều kiện kiểm tra nhiệt độ và lời khuyên
  if (nhiet_do <= 15) {
    colorCode = 'blue'; // Màu xanh nước biển
    advice = translations[currentLang].coatAdvice + ` ${nhiet_do}°C.`; // Cần ở nhà giữ ấm
  } else if (nhiet_do > 15 && nhiet_do <= 20) {
    colorCode = 'green'; // Màu xanh lá cây
    advice = translations[currentLang].coatAdvice + ` ${nhiet_do}°C.`; // Cần mặc áo ấm khi ra ngoài
  } else if (nhiet_do > 20 && nhiet_do <= 30) {
    colorCode = 'yellow'; // Màu vàng
    advice = translations[currentLang].enjoyOutdoors; // Hãy tận hưởng không khí ngoài trời
  } else if (nhiet_do > 30) {
    colorCode = 'red'; // Màu đỏ
    advice = translations[currentLang].advice; // Hãy bật điều hòa hoặc quạt
  }

  return `
    <span style="color: ${colorCode}; font-weight: bold;">
      ${translations[currentLang].temperatureInfo} ${nhiet_do}°C ${translations[currentLang].season} ${season}
    </span>
    <p style="color: ${colorCode}; font-weight: bold;">${advice}</p>
  `;
}

// Hàm xử lý và hiển thị kết quả
async function getWeatherData() {
  try {
    const ip = await getIp();
    const locationData = await getLocation(ip);
    const lat = locationData.lat;
    const lon = locationData.lon;
    const city = locationData.city;

    const nhiet_do = await getTemperature(lat, lon);
    const season = getSeason();

    const weatherInfo = `
      <p><strong>📍 Địa chỉ IP || IP adress: </strong>${locationData.query}</p>
      <p><strong>📍 Quốc gia || country : </strong>${locationData.country}</p>
      <p><strong>📍 Tỉnh/Thành phố  || Province/City : </strong>${city}</p>
      ${printTemperature(nhiet_do, season)}
    `;

    document.getElementById('weatherOutput').innerHTML = weatherInfo;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById('weatherOutput').innerHTML = `<p>${translations[currentLang].error}</p>`;
  }
}
