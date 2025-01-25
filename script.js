const dataList = document.getElementById("dataList");
const chart = document.getElementById("chart");
const ctx = chart.getContext("2d");

// Fungsi untuk menyimpan data ke localStorage
function simpanData() {
  const nama = document.getElementById("nama").value.trim();
  const kuis = parseFloat(document.getElementById("kuis").value);
  const uts = parseFloat(document.getElementById("uts").value);
  const uas = parseFloat(document.getElementById("uas").value);

  if (!nama || isNaN(kuis) || isNaN(uts) || isNaN(uas)) {
    alert("Mohon masukkan semua data dengan benar.");
    return;
  }

  const nilaiAkhir = 0.2 * kuis + 0.3 * uts + 0.5 * uas;

  // Simpan data siswa
  const siswa = { nama, kuis, uts, uas, nilaiAkhir };
  let data = JSON.parse(localStorage.getItem("dataSiswa")) || [];
  data.push(siswa);
  localStorage.setItem("dataSiswa", JSON.stringify(data));

  // Perbarui tampilan
  resetForm();
  tampilkanData();
}

// Fungsi untuk menghapus data siswa
function hapusData(index) {
  let data = JSON.parse(localStorage.getItem("dataSiswa")) || [];
  data.splice(index, 1);
  localStorage.setItem("dataSiswa", JSON.stringify(data));
  tampilkanData();
}

// Fungsi untuk mereset form
function resetForm() {
  document.getElementById("nilaiForm").reset();
}

// Fungsi untuk menampilkan data dari localStorage
function tampilkanData() {
  const data = JSON.parse(localStorage.getItem("dataSiswa")) || [];
  dataList.innerHTML = "";

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nama} - Nilai Akhir: ${item.nilaiAkhir.toFixed(2)}</span>
      <button class="delete-btn" onclick="hapusData(${index})">Hapus</button>
    `;
    dataList.appendChild(li);
  });

  gambarGrafik(data);
}

// Fungsi untuk menggambar grafik nilai
function gambarGrafik(data) {
  ctx.clearRect(0, 0, chart.width, chart.height);

  if (data.length === 0) return;

  const maxScore = 100;
  const barWidth = 60;
  const gap = 20;
  const canvasHeight = chart.height - 50;

  data.sort((a, b) => a.nilaiAkhir - b.nilaiAkhir);

  data.forEach((item, index) => {
    const barHeight = (item.nilaiAkhir / maxScore) * canvasHeight;
    const x = index * (barWidth + gap) + gap;
    const y = canvasHeight - barHeight + 50;

    // Bar
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Label
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.font = "14px Roboto";
    ctx.fillText(item.nama, x + barWidth / 2, canvasHeight + 40);
    ctx.fillText(item.nilaiAkhir.toFixed(2), x + barWidth / 2, y - 10);
  });
}

// Tampilkan data saat halaman dimuat
document.addEventListener("DOMContentLoaded", tampilkanData);
