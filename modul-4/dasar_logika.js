// File: dasar_logika.js
// Praktik Dasar Sintaks, Tipe Data, dan Arrow Function

const namaProgrammer = "muhammad saepul hidayat";
const tahunMulai = 2021;
const tahunSekarang = new Date().getFullYear();
//Arrow function menghitung masa pengalaman

const HitungPengalaman = (mulai, sekarang) => -mulai;
const MasaKerja = HitungPengalaman(tahunMulai, tahunSekarang);

//Evaluasi Kondisi dengan ternary oprator
const StatusSenioritas = MasaKerja >= 2 ? "Mid-level Develover" : "Junior Develover";

console.log("===INFORMASI PENGEMBANG===");
console.log("NAMA       :${Nama Programmer}");
console.log("Pengalaman :${masaKerja}Tahun}");
console.log("Kategori   :${setatusSenioritas}");

//Menguji Strict Equality vs Loose Equality
console.log("\n=== UJI PERBANDINGAN TIPE DATA ===");
console.log("10 == '10':", 10 == "10"); //true (type coercion)
console.log("10 === '10' :", 10 === "10"); // false (strict equality)
console.log("Tipe 10 :", typeof 10);
console.log("Tipe '10' :", typeof "10");
 