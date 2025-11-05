interface Coordenadas {
  latitude: number
  longitude: number
}

interface ResultadoGeolocalizacao {
  cidade: string
  estado: string
  siglaEstado: string
}

/**
 * Obtém a localização atual do usuário via navegador
 */
export async function obterLocalizacaoAtual(): Promise<Coordenadas> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        let mensagem = 'Erro ao obter localização'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensagem = 'Permissão de localização negada'
            break
          case error.POSITION_UNAVAILABLE:
            mensagem = 'Localização indisponível'
            break
          case error.TIMEOUT:
            mensagem = 'Tempo esgotado ao buscar localização'
            break
        }
        
        reject(new Error(mensagem))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Busca reversa usando a API do IBGE para descobrir cidade/estado
 * a partir de coordenadas geográficas
 */
export async function buscarCidadePorCoordenadas(
  latitude: number,
  longitude: number
): Promise<ResultadoGeolocalizacao> {
  try {
    // A API do IBGE não tem busca reversa direta, então vamos usar Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'pt-BR'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro na busca reversa de geolocalização')
    }

    const data = await response.json()
    
    // Extrai cidade e estado
    const cidade = 
      data.address.city || 
      data.address.town || 
      data.address.municipality || 
      data.address.village ||
      'Cidade não identificada'
    
    const estado = data.address.state || 'Estado não identificado'
    
    // Tenta descobrir a sigla do estado
    const siglaEstado = obterSiglaEstado(estado)

    return {
      cidade,
      estado,
      siglaEstado
    }
  } catch (error) {
    console.error('Erro na busca reversa:', error)
    throw new Error('Não foi possível identificar sua cidade')
  }
}

/**
 * Converte nome do estado para sigla
 */
function obterSiglaEstado(nomeEstado: string): string {
  const mapa: { [key: string]: string } = {
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amapá': 'AP',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO'
  }

  return mapa[nomeEstado] || ''
}

/**
 * Função principal que combina geolocalização + busca reversa
 */
export async function obterCidadeAutomatica(): Promise<ResultadoGeolocalizacao> {
  const coordenadas = await obterLocalizacaoAtual()
  const resultado = await buscarCidadePorCoordenadas(
    coordenadas.latitude,
    coordenadas.longitude
  )
  
  return resultado
}
