/* ==========================================================================
   CORE — Firebase + utilitários (compartilhado)
   ========================================================================== */
const firebaseConfig = { 
  apiKey: "AIzaSyDK8KJ5hNL9fRxtn9LxWVOswUo0ouFRZ64", 
  authDomain: "jose-e-noemy.firebaseapp.com", 
  databaseURL: "https://jose-e-noemy-default-rtdb.firebaseio.com", 
  projectId: "jose-e-noemy", 
  storageBucket: "jose-e-noemy.firebasestorage.app", 
  messagingSenderId: "655520586576", 
  appId: "1:655520586576:web:080ba2ee31142f94e42a55" 
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const $ = id => document.getElementById(id);
const brl = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

function toast(msg) {
    let t = $('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Pix copia e cola ---------- */
const semAcento = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9 ]/g, '').toUpperCase();
const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;

function crc16(s) {
    let c = 0xFFFF;
    for (let i = 0; i < s.length; i++) {
        c ^= s.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) : (c << 1);
        c &= 0xFFFF;
    }
    return c.toString(16).toUpperCase().padStart(4, '0');
}


function pixPayload({ chave, nome, cidade, valor }) {
    let p = tlv('00', '01')
          + tlv('26', tlv('00', 'br.gov.bcb.pix') + tlv('01', chave.trim()))
          + tlv('52', '0000') + tlv('53', '986');
    if (valor > 0) p += tlv('54', Number(valor).toFixed(2));
    p += tlv('58', 'BR')
       + tlv('59', (semAcento(nome) || 'CASAL').slice(0, 25))
       + tlv('60', (semAcento(cidade) || 'BRASIL').slice(0, 15))
       + tlv('62', tlv('05', '***')) + '6304';
    return p + crc16(p);
}



