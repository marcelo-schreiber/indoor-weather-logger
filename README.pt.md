
# Logger de Clima Interno

[![Licença MIT](https://img.shields.io/github/license/marcelo-schreiber/indoor-weather-logger?style=social&logo=github)](https://github.com/marcelo-schreiber/indoor-weather-logger/blob/master/LICENSE)  
[README em português](https://github.com/marcelo-schreiber/indoor-weather-logger/blob/master/README.pt.md)  

Este projeto registra dados climáticos (temperatura, umidade, pressão e qualidade do ar) usando um **ESP32 Wemos Lolin32** com sensores **DHT22**, **BMP280** e **MQ135**. Os dados são enviados para uma **aplicação web Next.js** hospedada na **Vercel** para armazenamento e visualização. O backend usa **Supabase** como seu banco de dados, e um job cron está configurado para gerenciar os resets diários dos dados.

---

## Índice

- [Arquitetura Geral](#arquitetura-geral)
- [Iniciando](#iniciando)
  - [Estrutura de Pastas](#estrutura-de-pastas)
  - [Configuração do ESP32](#configuração-do-esp32)
  - [Configuração da Aplicação Web](#configuração-da-aplicação-web)
- [Como Funciona](#como-funciona)
  - [Registro de Dados no ESP32](#registro-de-dados-no-esp32)
  - [Reset Diário com Job Cron](#reset-diário-com-job-cron)
- [Tecnologias](#tecnologias)
- [Feedback](#feedback)

---

## Arquitetura Geral

A arquitetura do sistema está ilustrada abaixo:

![Arquitetura do Sistema](docs/diagram(1).png)

---

## Iniciando

### Estrutura de Pastas

- **`esp32/`**: Contém o arquivo `.ino` para a configuração do ESP32.
- **`webapp/`**: Contém a aplicação Next.js.

---

### Configuração do ESP32

0. **Configuração de Hardware**:
   - Conecte o sensor DHT22 à placa ESP32 da seguinte forma:
     - VCC -> 3.3V
     - GND -> GND
     - DATA -> 13
   - Conecte o sensor BMP280 à placa ESP32 da seguinte forma:
     - VCC -> 3.3V
     - GND -> GND
     - SCL -> 25 (I2C SCL)
     - SDA -> 26 (I2C SDA)
   - Conecte o sensor MQ135 à placa ESP32 da seguinte forma:
     - VCC -> SVN
     - GND -> GND
     - AOUT -> 39

     Consulte [este guia](https://randomnerdtutorials.com/esp32-built-in-oled-ssd1306/) para mais dicas sobre a configuração do ESP32.

1. Instale as bibliotecas necessárias no Arduino IDE:
   - [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)
   - [BMP280 Library](https://github.com/adafruit/Adafruit_BMP280_Library)
   - [WiFi](https://www.arduino.cc/en/Reference/WiFi)

2. Abra o arquivo `esp32.ino` no Arduino IDE e atualize os campos com suas credenciais:

   ```cpp
   const char* ssid = "<WIFI-UUID>";          // SSID do seu WiFi
   const char* password = "<WIFI-PASSWORD>";  // Senha do seu WiFi
   const char* api_key = "<API-KEY>";         // Chave da API configurada na aplicação Next.js
   String serverName = "<VERCEL-ENDPOINT-URL>"; // URL da API hospedada na Vercel
   ```

3. Conecte o ESP32 ao seu computador, faça o upload do código e monitore a saída serial para verificar o status da conexão.

### Configuração da Aplicação Web

1. Clone o repositório e navegue até o diretório `webapp/`:

    ```bash
    git clone https://github.com/marcelo-schreiber/weather.git
    cd weather/webapp
    ```

2. No diretório `webapp/`, crie um arquivo `.env` com base no arquivo `.env.example`:

    ```bash
    cp .env.example .env
    ```

3. Atualize o arquivo `.env` com suas credenciais.

4. Dentro da pasta `webapp/`, instale as dependências:

    ```bash
    npm install --force # devido ao storybook e react 19
    ```

5. Para rodar a aplicação localmente, use o seguinte comando:

    ```bash
    npm run dev
    ```

6. Para implantar a aplicação na Vercel, use o comando:

    ```bash
    vercel
    ```

7. Configure um job cron usando [cron-job.org](https://cron-job.org/en/) para enviar uma requisição GET para `/api/cron` diariamente às 00:01. Certifique-se de adicionar um cabeçalho com o CRON_SECRET:

    ```bash
    Authorization: Bearer <CRON_SECRET>
    ```

---

## Testando o Front-end

Usando o Storybook, você pode testar os componentes isoladamente, isso foi utilizado porque é uma maneira simples de testar os componentes sem precisar rodar a aplicação inteira.

Os componentes são todos os cards e gráficos exibidos na página principal.

1. Para rodar o Storybook, use o seguinte comando:

```bash
npm run storybook
```

O Storybook estará disponível em `http://localhost:6006/`.

## Como Funciona

### Registro de Dados no ESP32

- O ESP32 coleta dados a cada minuto dos sensores DHT22, BMP280 e MQ135.
  - DHT22: Temperatura e umidade.
  - BMP280: Pressão atmosférica.
  - MQ135: Qualidade do ar em ppm.

- Os dados coletados são enviados como uma requisição `POST` para o endpoint `/api` da aplicação Next.js hospedada. A estrutura do payload JSON:

   ```json
   {
     "apiKey": "<API-KEY>",
     "temperature": 25.5,
     "humidity": 60.2,
     "pressure": 1013.25,
     "airQuality": 120
   }
   ```

- A aplicação Next.js valida a requisição usando a chave da API e armazena os dados em um banco de dados Supabase.

### Reset Diário com Job Cron

- Um job cron envia uma requisição GET para o endpoint `/api/cron` diariamente às 00:01.
- O manipulador de `/api/cron`:
  - Calcula a média e a mediana dos dados coletados nas últimas 24 horas.
  - Faz o reset dos dados diários para um único registro de resumo.

---

## Tecnologias

- **ESP32 Wemos Lolin32**: Placa microcontroladora com Wi-Fi e Bluetooth integrados.
- **Sensor DHT22**: Sensor digital de temperatura e umidade.
- **Sensor BMP280**: Sensor de pressão atmosférica.
- **Sensor MQ135**: Sensor de qualidade do ar.
- **Next.js**: Framework React para construção de aplicações web.
- **Vercel**: Plataforma em nuvem para sites estáticos e funções serverless.
- **Supabase**: Alternativa open-source ao Firebase para bancos de dados e autenticação.
- **Cron-job.org**: Serviço gratuito online para jobs cron.

---

## Feedback

Se você tiver feedback ou sugestões, fique à vontade para entrar em contato pelo e-mail `marcelorissette15@gmail.com`.

---