const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Comprime uma imagem se ela exceder o tamanho máximo
 * @param {string} filePath - Caminho do arquivo
 * @param {number} maxSizeKB - Tamanho máximo em KB (default: 1024 = 1MB)
 * @returns {Promise<number>} - Tamanho final em KB
 */
async function compressImage(filePath, maxSizeKB = 1024) {
  const stats = await fs.stat(filePath);
  const currentSizeKB = Math.round(stats.size / 1024);

  // Se já está abaixo do limite, retorna
  if (currentSizeKB <= maxSizeKB) {
    return currentSizeKB;
  }

  console.log(`Comprimindo imagem: ${currentSizeKB}KB → objetivo: ${maxSizeKB}KB`);

  // Calcula quality necessário proporcionalmente
  let quality = Math.floor((maxSizeKB / currentSizeKB) * 100);
  quality = Math.max(20, Math.min(quality, 90)); // Entre 20% e 90%

  const tempPath = filePath + '.temp';

  try {
    await sharp(filePath)
      .jpeg({ quality, progressive: true })
      .toFile(tempPath);

    // Verifica se conseguiu comprimir adequadamente
    const newStats = await fs.stat(tempPath);
    const newSizeKB = Math.round(newStats.size / 1024);

    // Se ainda está muito grande, tenta redimensionar também
    if (newSizeKB > maxSizeKB) {
      await sharp(filePath)
        .resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality: quality - 10, progressive: true })
        .toFile(tempPath);
    }

    // Substitui arquivo original
    await fs.unlink(filePath);
    await fs.rename(tempPath, filePath);

    const finalStats = await fs.stat(filePath);
    const finalSizeKB = Math.round(finalStats.size / 1024);

    console.log(`✓ Imagem comprimida: ${finalSizeKB}KB`);
    return finalSizeKB;

  } catch (error) {
    // Se der erro, remove temp e mantém original
    try {
      await fs.unlink(tempPath);
    } catch {}
    
    console.error('Erro ao comprimir imagem:', error.message);
    return currentSizeKB;
  }
}

/**
 * Gera um slug a partir de um texto
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

/**
 * Calcula distância entre duas coordenadas (Haversine)
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Hash de IP para privacidade
 */
function hashIP(ip) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex');
}

module.exports = {
  compressImage,
  generateSlug,
  calcularDistancia,
  hashIP
};
