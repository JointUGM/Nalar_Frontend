export interface KbMisconception { id: string; wrong: string; right: string; cues: readonly string[]; counter: string }
export interface KbConcept { id: string; name: string; x: number; y: number; desc: string; cp: string; src: string; mis: readonly KbMisconception[] }
export interface KbReview { pages: number; selectedId: string; concepts: readonly KbConcept[]; leadsTo: readonly (readonly [from: string, to: string])[] }

const cp = 'CP IPA Fase D · Tekanan zat'

// Supplied "Tinjau dan setujui" sample. x/y are percentages of the map; leadsTo lists exactly the
// arrows the reference draws ("dipelajari lebih dulu"), so no relationship is invented.
export const kbReviewByTopic: Readonly<Record<string, KbReview>> = {
  'tekanan-zat': {
    pages: 18,
    selectedId: 'tekanan',
    leadsTo: [['gaya', 'tekanan'], ['luas', 'tekanan'], ['tekanan', 'hidro'], ['hidro', 'pascal'], ['hidro', 'archi'], ['tekanan', 'udara']],
    concepts: [
      { id: 'gaya', name: 'Gaya', x: 14, y: 19, desc: 'Tarikan atau dorongan pada benda, diukur dalam newton.', cp: 'CP IPA Fase D · Gaya dan gerak', src: 'Halaman 61', mis: [] },
      { id: 'tekanan', name: 'Tekanan', x: 57, y: 19, desc: 'Besar gaya pada setiap satuan luas bidang tekan (p = F/A).', cp, src: 'Halaman 62–63', mis: [
        { id: 'tekanan-1', wrong: 'Tekanan hanya bergantung pada berat benda', right: 'Tekanan bergantung pada gaya dan luas bidang tekan.', cues: ['yang berat pasti menekan lebih kuat', 'tergantung beratnya aja'], counter: 'Kenapa sepatu hak tinggi meninggalkan bekas di lantai kayu, padahal gajah yang jauh lebih berat tidak?' },
        { id: 'tekanan-2', wrong: 'Pisau tajam lebih kuat daripada pisau tumpul', right: 'Pisau tajam memusatkan gaya pada luas kecil, sehingga tekanannya besar.', cues: ['pisaunya lebih kuat', 'tajam itu keras'], counter: 'Kalau gayanya sama, apa bedanya menekan dengan ujung jari dan dengan telapak tangan?' },
      ] },
      { id: 'luas', name: 'Luas bidang tekan', x: 14, y: 48, desc: 'Luas permukaan tempat gaya bekerja.', cp, src: 'Halaman 62', mis: [] },
      { id: 'hidro', name: 'Tekanan hidrostatis', x: 57, y: 52, desc: 'Tekanan zat cair yang diam, bertambah dengan kedalaman.', cp, src: 'Halaman 65', mis: [
        { id: 'hidro-1', wrong: 'Tekanan air hanya mengarah ke bawah', right: 'Tekanan zat cair bekerja ke segala arah pada kedalaman yang sama.', cues: ['airnya neken ke bawah', 'cuma ke bawah karena gravitasi'], counter: 'Kalau tekanan hanya ke bawah, kenapa air menyembur ke samping dari lubang di dinding botol?' },
      ] },
      { id: 'pascal', name: 'Hukum Pascal', x: 84, y: 76, desc: 'Tekanan pada zat cair tertutup diteruskan sama besar ke segala arah.', cp, src: 'Halaman 68', mis: [] },
      { id: 'archi', name: 'Hukum Archimedes', x: 28, y: 76, desc: 'Benda dalam zat cair mendapat gaya ke atas seberat zat cair yang dipindahkan.', cp, src: 'Halaman 70–71', mis: [
        { id: 'archi-1', wrong: 'Benda berat selalu tenggelam', right: 'Tenggelam atau terapung bergantung pada massa jenis benda dan zat cair.', cues: ['soalnya berat', 'kapal kan dari besi tapi…'], counter: 'Kapal baja beratnya ribuan ton. Kenapa terapung, sedangkan paku kecil tenggelam?' },
      ] },
      { id: 'udara', name: 'Tekanan udara', x: 86, y: 19, desc: 'Tekanan yang diberikan udara di sekitar kita, berkurang dengan ketinggian.', cp, src: 'Halaman 73', mis: [] },
    ],
  },
}
