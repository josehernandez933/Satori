// =============================================
// BANCO DE PREGUNTAS DE REDES - SATORI
// 35 preguntas sobre fundamentos de redes
// =============================================

const networkQuestions = [
  // --- MODELO OSI ---
  {
    id: "q001",
    categoria: "Modelo OSI",
    pregunta: "¿Cuántas capas tiene el modelo OSI?",
    opciones: {
      a: "4 capas",
      b: "5 capas",
      c: "7 capas",
      d: "6 capas"
    },
    correcta: "c",
    retroalimentacion: "El modelo OSI tiene 7 capas: Física, Enlace de datos, Red, Transporte, Sesión, Presentación y Aplicación."
  },
  {
    id: "q002",
    categoria: "Modelo OSI",
    pregunta: "¿Qué capa del modelo OSI es responsable del direccionamiento lógico?",
    opciones: {
      a: "Capa de Enlace de Datos",
      b: "Capa de Transporte",
      c: "Capa de Red",
      d: "Capa Física"
    },
    correcta: "c",
    retroalimentacion: "La Capa de Red (capa 3) es responsable del direccionamiento lógico (IP) y el enrutamiento de paquetes."
  },
  {
    id: "q003",
    categoria: "Modelo OSI",
    pregunta: "¿Qué capa del modelo OSI convierte los datos en señales eléctricas?",
    opciones: {
      a: "Capa de Sesión",
      b: "Capa Física",
      c: "Capa de Enlace de Datos",
      d: "Capa de Presentación"
    },
    correcta: "b",
    retroalimentacion: "La Capa Física (capa 1) se encarga de la transmisión de bits en forma de señales eléctricas, ópticas o de radio."
  },
  {
    id: "q004",
    categoria: "Modelo OSI",
    pregunta: "¿Cuál es la función principal de la capa de Transporte?",
    opciones: {
      a: "Enrutar paquetes entre redes",
      b: "Convertir formatos de datos",
      c: "Proporcionar transferencia de datos confiable extremo a extremo",
      d: "Gestionar el acceso al medio físico"
    },
    correcta: "c",
    retroalimentacion: "La Capa de Transporte (capa 4) garantiza la entrega confiable de datos entre sistemas finales, usando protocolos como TCP y UDP."
  },
  {
    id: "q005",
    categoria: "Modelo OSI",
    pregunta: "¿En qué capa del modelo OSI opera un switch?",
    opciones: {
      a: "Capa 1 - Física",
      b: "Capa 2 - Enlace de Datos",
      c: "Capa 3 - Red",
      d: "Capa 4 - Transporte"
    },
    correcta: "b",
    retroalimentacion: "Un switch opera en la Capa 2 (Enlace de Datos) y usa direcciones MAC para reenviar tramas dentro de una red local."
  },

  // --- TCP/IP ---
  {
    id: "q006",
    categoria: "TCP/IP",
    pregunta: "¿Qué significa LAN?",
    opciones: {
      a: "Local Area Network",
      b: "Large Access Node",
      c: "Line Access Network",
      d: "Logical Area Number"
    },
    correcta: "a",
    retroalimentacion: "LAN significa Local Area Network (Red de Área Local). Conecta dispositivos en un área geográfica pequeña como una oficina o edificio."
  },
  {
    id: "q007",
    categoria: "TCP/IP",
    pregunta: "¿Cuál es el puerto estándar del protocolo HTTP?",
    opciones: {
      a: "21",
      b: "25",
      c: "80",
      d: "443"
    },
    correcta: "c",
    retroalimentacion: "HTTP utiliza el puerto 80 por defecto. HTTPS usa el puerto 443 para comunicaciones seguras."
  },
  {
    id: "q008",
    categoria: "TCP/IP",
    pregunta: "¿Qué protocolo garantiza la entrega de paquetes?",
    opciones: {
      a: "UDP",
      b: "ICMP",
      c: "TCP",
      d: "ARP"
    },
    correcta: "c",
    retroalimentacion: "TCP (Transmission Control Protocol) garantiza la entrega de datos mediante acuse de recibo y retransmisión de paquetes perdidos."
  },
  {
    id: "q009",
    categoria: "TCP/IP",
    pregunta: "¿Cuántas capas tiene el modelo TCP/IP?",
    opciones: {
      a: "3 capas",
      b: "4 capas",
      c: "5 capas",
      d: "7 capas"
    },
    correcta: "b",
    retroalimentacion: "El modelo TCP/IP tiene 4 capas: Acceso a la Red, Internet, Transporte y Aplicación."
  },
  {
    id: "q010",
    categoria: "TCP/IP",
    pregunta: "¿Qué significa IP en redes?",
    opciones: {
      a: "Internet Processor",
      b: "Internal Protocol",
      c: "Internet Protocol",
      d: "Interconnection Point"
    },
    correcta: "c",
    retroalimentacion: "IP significa Internet Protocol. Es el protocolo principal que define cómo se transmiten los datos en internet."
  },

  // --- PROTOCOLOS ---
  {
    id: "q011",
    categoria: "Protocolos",
    pregunta: "¿Qué protocolo se usa para transferencia de archivos?",
    opciones: {
      a: "HTTP",
      b: "FTP",
      c: "SMTP",
      d: "DNS"
    },
    correcta: "b",
    retroalimentacion: "FTP (File Transfer Protocol) es el protocolo estándar para transferir archivos entre cliente y servidor. Usa los puertos 20 y 21."
  },
  {
    id: "q012",
    categoria: "Protocolos",
    pregunta: "¿Cuál es la función del protocolo DNS?",
    opciones: {
      a: "Asignar direcciones IP automáticamente",
      b: "Traducir nombres de dominio a direcciones IP",
      c: "Encriptar comunicaciones web",
      d: "Enviar correos electrónicos"
    },
    correcta: "b",
    retroalimentacion: "DNS (Domain Name System) traduce nombres de dominio legibles (como google.com) a direcciones IP numéricas."
  },
  {
    id: "q013",
    categoria: "Protocolos",
    pregunta: "¿Qué protocolo asigna direcciones IP automáticamente?",
    opciones: {
      a: "DNS",
      b: "FTP",
      c: "DHCP",
      d: "SMTP"
    },
    correcta: "c",
    retroalimentacion: "DHCP (Dynamic Host Configuration Protocol) asigna automáticamente direcciones IP y otros parámetros de red a los dispositivos."
  },
  {
    id: "q014",
    categoria: "Protocolos",
    pregunta: "¿Cuál es el puerto estándar de HTTPS?",
    opciones: {
      a: "80",
      b: "22",
      c: "443",
      d: "8080"
    },
    correcta: "c",
    retroalimentacion: "HTTPS (HTTP Secure) usa el puerto 443 y cifra la comunicación usando TLS/SSL para mayor seguridad."
  },
  {
    id: "q015",
    categoria: "Protocolos",
    pregunta: "¿Qué protocolo se utiliza para el envío de correos electrónicos?",
    opciones: {
      a: "POP3",
      b: "IMAP",
      c: "SMTP",
      d: "FTP"
    },
    correcta: "c",
    retroalimentacion: "SMTP (Simple Mail Transfer Protocol) es el protocolo usado para enviar correos electrónicos. POP3 e IMAP se usan para recibirlos."
  },
  {
    id: "q016",
    categoria: "Protocolos",
    pregunta: "¿Cuál es el puerto de SSH?",
    opciones: {
      a: "21",
      b: "22",
      c: "23",
      d: "25"
    },
    correcta: "b",
    retroalimentacion: "SSH (Secure Shell) usa el puerto 22 para conexiones remotas seguras. Es la alternativa segura a Telnet (puerto 23)."
  },

  // --- DIRECCIONAMIENTO IP ---
  {
    id: "q017",
    categoria: "Direccionamiento IP",
    pregunta: "¿Cuántos bits tiene una dirección IPv4?",
    opciones: {
      a: "16 bits",
      b: "64 bits",
      c: "128 bits",
      d: "32 bits"
    },
    correcta: "d",
    retroalimentacion: "Una dirección IPv4 tiene 32 bits, divididos en 4 octetos de 8 bits, representados en notación decimal punteada."
  },
  {
    id: "q018",
    categoria: "Direccionamiento IP",
    pregunta: "¿Cuántos bits tiene una dirección IPv6?",
    opciones: {
      a: "32 bits",
      b: "64 bits",
      c: "128 bits",
      d: "256 bits"
    },
    correcta: "c",
    retroalimentacion: "IPv6 usa direcciones de 128 bits, representadas en hexadecimal, lo que proporciona un espacio de direcciones enormemente mayor que IPv4."
  },
  {
    id: "q019",
    categoria: "Direccionamiento IP",
    pregunta: "¿Qué dirección IP está reservada para loopback?",
    opciones: {
      a: "192.168.1.1",
      b: "10.0.0.1",
      c: "127.0.0.1",
      d: "172.16.0.1"
    },
    correcta: "c",
    retroalimentacion: "127.0.0.1 es la dirección de loopback, también llamada 'localhost'. Permite que un dispositivo se comunique consigo mismo."
  },
  {
    id: "q020",
    categoria: "Direccionamiento IP",
    pregunta: "¿Qué clase de IP es la red 192.168.0.0?",
    opciones: {
      a: "Clase A",
      b: "Clase B",
      c: "Clase C",
      d: "Clase D"
    },
    correcta: "c",
    retroalimentacion: "192.168.x.x pertenece a la Clase C, reservada para redes privadas locales. El rango es de 192.0.0.0 a 223.255.255.255."
  },
  {
    id: "q021",
    categoria: "Direccionamiento IP",
    pregunta: "¿Qué representa la máscara de subred 255.255.255.0?",
    opciones: {
      a: "/8",
      b: "/16",
      c: "/24",
      d: "/32"
    },
    correcta: "c",
    retroalimentacion: "255.255.255.0 equivale a /24 en notación CIDR. Significa que los primeros 24 bits identifican la red y los 8 restantes los hosts."
  },

  // --- DISPOSITIVOS DE RED ---
  {
    id: "q022",
    categoria: "Dispositivos de Red",
    pregunta: "¿Cuál es la función principal de un router?",
    opciones: {
      a: "Conectar dispositivos dentro de la misma red",
      b: "Amplificar señales de red",
      c: "Enrutar paquetes entre diferentes redes",
      d: "Convertir señales analógicas a digitales"
    },
    correcta: "c",
    retroalimentacion: "Un router conecta múltiples redes y decide la mejor ruta para reenviar paquetes entre ellas usando tablas de enrutamiento."
  },
  {
    id: "q023",
    categoria: "Dispositivos de Red",
    pregunta: "¿Qué diferencia a un switch de un hub?",
    opciones: {
      a: "El switch es más lento",
      b: "El switch envía datos al puerto destino específico, el hub a todos",
      c: "El hub usa direcciones IP, el switch no",
      d: "No hay diferencia significativa"
    },
    correcta: "b",
    retroalimentacion: "Un switch usa direcciones MAC para enviar datos solo al destino correcto, mientras que un hub retransmite a todos los puertos, generando más colisiones."
  },
  {
    id: "q024",
    categoria: "Dispositivos de Red",
    pregunta: "¿Qué dispositivo permite conectar redes con diferentes tecnologías?",
    opciones: {
      a: "Hub",
      b: "Switch",
      c: "Gateway",
      d: "Repetidor"
    },
    correcta: "c",
    retroalimentacion: "Un gateway (puerta de enlace) conecta redes que usan diferentes protocolos o tecnologías, traduciendo entre ellas."
  },
  {
    id: "q025",
    categoria: "Dispositivos de Red",
    pregunta: "¿Qué es un punto de acceso inalámbrico (AP)?",
    opciones: {
      a: "Un dispositivo que amplifica señales cableadas",
      b: "Un dispositivo que permite conexiones WiFi a la red cableada",
      c: "Un firewall inalámbrico",
      d: "Un tipo de router sin antenas"
    },
    correcta: "b",
    retroalimentacion: "Un Access Point (AP) permite que dispositivos inalámbricos se conecten a una red cableada mediante señales WiFi."
  },

  // --- SEGURIDAD DE REDES ---
  {
    id: "q026",
    categoria: "Seguridad de Redes",
    pregunta: "¿Qué es un firewall?",
    opciones: {
      a: "Un dispositivo para aumentar la velocidad de red",
      b: "Un sistema que filtra el tráfico de red según reglas de seguridad",
      c: "Un protocolo de encriptación",
      d: "Un tipo de cable de red resistente al fuego"
    },
    correcta: "b",
    retroalimentacion: "Un firewall monitorea y controla el tráfico de red entrante y saliente basándose en reglas de seguridad predefinidas."
  },
  {
    id: "q027",
    categoria: "Seguridad de Redes",
    pregunta: "¿Qué significa VPN?",
    opciones: {
      a: "Virtual Private Network",
      b: "Very Protected Node",
      c: "Virtual Public Network",
      d: "Verified Protocol Network"
    },
    correcta: "a",
    retroalimentacion: "VPN (Virtual Private Network) crea un túnel cifrado sobre internet, permitiendo conexiones seguras como si estuvieras en una red privada."
  },
  {
    id: "q028",
    categoria: "Seguridad de Redes",
    pregunta: "¿Qué tipo de ataque inunda una red con tráfico para inhabilitarla?",
    opciones: {
      a: "Phishing",
      b: "Man in the Middle",
      c: "DDoS",
      d: "SQL Injection"
    },
    correcta: "c",
    retroalimentacion: "Un ataque DDoS (Distributed Denial of Service) usa múltiples sistemas para inundar un servidor con tráfico y dejarlo inaccesible."
  },
  {
    id: "q029",
    categoria: "Seguridad de Redes",
    pregunta: "¿Qué protocolo de seguridad utiliza WPA2 para cifrar WiFi?",
    opciones: {
      a: "DES",
      b: "MD5",
      c: "AES",
      d: "RSA"
    },
    correcta: "c",
    retroalimentacion: "WPA2 utiliza el algoritmo AES (Advanced Encryption Standard) para cifrar las comunicaciones WiFi, siendo más seguro que WEP y WPA."
  },

  // --- TOPOLOGÍAS ---
  {
    id: "q030",
    categoria: "Topologías de Red",
    pregunta: "¿Qué topología conecta todos los dispositivos a un cable central?",
    opciones: {
      a: "Topología en estrella",
      b: "Topología en anillo",
      c: "Topología en bus",
      d: "Topología en malla"
    },
    correcta: "c",
    retroalimentacion: "En la topología en bus, todos los dispositivos comparten un único cable de comunicación central. Si el cable falla, toda la red cae."
  },
  {
    id: "q031",
    categoria: "Topologías de Red",
    pregunta: "¿Cuál es la topología más común en redes LAN modernas?",
    opciones: {
      a: "Anillo",
      b: "Bus",
      c: "Malla",
      d: "Estrella"
    },
    correcta: "d",
    retroalimentacion: "La topología en estrella es la más usada en LANs modernas. Todos los dispositivos se conectan a un switch central, facilitando el mantenimiento."
  },
  {
    id: "q032",
    categoria: "Topologías de Red",
    pregunta: "¿Qué topología ofrece mayor redundancia ante fallos?",
    opciones: {
      a: "Bus",
      b: "Estrella",
      c: "Malla completa",
      d: "Anillo simple"
    },
    correcta: "c",
    retroalimentacion: "La topología en malla completa conecta cada dispositivo con todos los demás, ofreciendo máxima redundancia aunque a mayor costo."
  },

  // --- CONCEPTOS GENERALES ---
  {
    id: "q033",
    categoria: "Conceptos Generales",
    pregunta: "¿Qué significa WAN?",
    opciones: {
      a: "Wireless Area Network",
      b: "Wide Area Network",
      c: "Web Access Node",
      d: "Wired Area Network"
    },
    correcta: "b",
    retroalimentacion: "WAN (Wide Area Network) es una red que cubre grandes áreas geográficas. Internet es el ejemplo más grande de una WAN."
  },
  {
    id: "q034",
    categoria: "Conceptos Generales",
    pregunta: "¿Qué es el ancho de banda en redes?",
    opciones: {
      a: "El peso del cable de red",
      b: "La cantidad máxima de datos transmitidos por unidad de tiempo",
      c: "El número de dispositivos conectados",
      d: "La distancia máxima del cable"
    },
    correcta: "b",
    retroalimentacion: "El ancho de banda es la capacidad máxima de transferencia de datos de una red, medida en bits por segundo (bps, Mbps, Gbps)."
  },
  {
    id: "q035",
    categoria: "Conceptos Generales",
    pregunta: "¿Qué es la latencia en redes?",
    opciones: {
      a: "La velocidad máxima de conexión",
      b: "El número de paquetes perdidos",
      c: "El tiempo que tarda un paquete en llegar al destino",
      d: "La capacidad de almacenamiento del router"
    },
    correcta: "c",
    retroalimentacion: "La latencia (o ping) es el tiempo que tarda un paquete de datos en viajar desde el origen hasta el destino. Se mide en milisegundos (ms)."
  }
];

module.exports = networkQuestions;
