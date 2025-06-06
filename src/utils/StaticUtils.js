import dayjs from "dayjs";
import crypto from "crypto";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import styled from "./log/styled.js";

export default class StaticUtils {
    static async sleep(seconds = 1) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    static isUrl(text) {
        const regex = new RegExp(
            '^(https?:\\/\\/)' + // Deve começar com http:// ou https://
            '([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*(\\.[a-zA-Z]{2,})?|localhost)?' + // Domínio válido ou localhost (opcional após o protocolo)
            '(\\:\\d+)?' + // Porta (opcional)
            '(\\/.*)?$', // Caminho (opcional)
            'i' // Ignore case
        );
        return regex.test(text);
    }

    static substituteEmojisAnswer(message) {
        const regexEmoji = /[\p{Extended_Pictographic}]/gu;

        const removeEmoji = message.replace(regexEmoji, '').trim();

        //remover 2 ou mais espaços mas ignorar quebras de linha
        return removeEmoji.replace(/ {2,}/g, ' ');
    }

    static substituirEmojis(mensagem) {
        const regexEmoji = /[\p{Extended_Pictographic}]/gu;

        return mensagem.replace(regexEmoji, '[emoji]');
    }

    static encodeString(string) {
        let base64 = btoa(string);
        return base64.replace(/=/g, '');
    }

    static decodeString(string) {
        return atob(string);
    }

    static jsonPromptToString(text) {
        /* ```json
    {
      "date": "08/01/2025",
      "availableOptions": ["11:00", "11:30"]
    }
    ``` */

        const clearText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(clearText);
        return json;
    }

    static extractJsonPrompt(text) {
        // Capturar apenas de onde inicia a mensagem com ```json e termina com ``` para pegar apenas o JSON e retornar o objeto
        styled.info('[StaticUtils.extractJsonPrompt] Texto:', text);
        const regex = /```json([\s\S]*?)```/g;
        const match = regex.exec(text);
        if (match) {
            return StaticUtils.jsonPromptToString(match[0]);
        } else {
            return null;
        }
    }

    static toDateTime(date) {
        dayjs.extend(customParseFormat);
        return dayjs(date, 'DD/MM/YYYY HH:mm').toDate();
    }

    static changeTimezone(date, timezone) {
        var invdate = new Date(date.toLocaleString('pt-BR', {
            timeZone: timezone
        }));

        var diff = date.getTime() - invdate.getTime();

        return new Date(date.getTime() - diff);
    }

    static getCalendarName(dentist) {
        if (dentist?.includes('Juliana Leite')) {
            return 'Dra. Juliana Leite';
        } else if (dentist?.includes('Lucília')) {
            return 'Odontopediatria'
        } else if (dentist?.includes('Odontopediatria')) {
            return 'Odontopediatria'
        } else {
            return 'Demais Dentistas'
        }
    }

    static normalizeDate(dateString) {
        const match = dateString.match(/^(\d{1,2})\D?(\d{1,2})\D?(\d{2,4})$/);
        const finalYearDigits = new Date().getFullYear().toString().slice(-2);

        if (match) {
            let [_, day, month, year] = match;

            if (year.length === 2) {
                year = parseInt(year, 10) <= finalYearDigits ? '20' + year : '19' + year;
            }

            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }

        return null;
    }

    static asciiToPhone(ascii) {
        return ascii.replace(/%28|%29|%20|\+|-/g, "");
    }

    static formatTelephone(numero) {
        let string = '';

        if (typeof numero === 'number') {
            string = numero.toString();
        } else {
            string = numero;
        }

        let newNumber = '';
        let ddd = '';

        string = string.replace(/[^0-9]/g, '');

        if (string.slice(0, 2) === '55') {
            string = string.substring(2);
        }

        if (string.length === 11) {
            ddd = string.slice(0, 2);
            newNumber = string.substring(3);

        } else if (string.length === 10) {
            ddd = string.slice(0, 2);
            newNumber = string.substring(2);

        } else if (string.length === 9) {
            ddd = '81';
            newNumber = string.substring(1);

        } else if (string.length === 8) {
            ddd = '81';
            newNumber = string;
        }

        return `+55${ddd}${newNumber.substring(0, 4)}${newNumber.substring(4)}`;
    }

    /**
     * Formata um número de telefone para o formato do Evolution
     * @param {string} number - Número a ser formatado
     * @returns {string} - Número formatado
     */
    static removePhoneNonNumericCharacters(number) {
        let formattedNumber = number.replace(/\D/g, '');
        return formattedNumber
    }

    /**
     * Verifica se uma string é uma codificação válida em base64
     * @param {string} str - String a ser verificada
     * @returns {boolean} - Retorna true se a string for uma codificação válida em base64
     */
    static isBase64(str) {
        const cleanedInput = str.replace(/\D/g, '');
        if (/^\d{8,15}$/.test(cleanedInput)) {
            return false;
        }
        try {
            const decoded = Buffer.from(str, 'base64').toString('utf-8');
            if (Buffer.from(decoded, 'utf-8').toString('base64').replace(/=+$/, '') === str.replace(/=+$/, '')) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    /**
     * Retorna o nome do profissional de acordo com a condição informada
     * @param {string} condition - Condição para retornar o nome do profissional
     * @returns {string} - Nome do profissional
     */
    static getProfissionalName(condition = '') {
        const mapping = {
            'Juliana Leite': 'Dra. Juliana Leite',
            'Lucília Miranda': 'Dra. Lucília Miranda',
            'Odontopediatria': 'Dra. Lucília Miranda',
        };

        for (const key in mapping) {
            if (condition.includes(key)) {
                return mapping[key];
            }
        }

        return 'Demais Dentistas';
    }

    /**
     * Retorna o nome do bairro com os caracteres iniciais em maiúsculos (title case) com exceção de palavras como "de", "da", "do", "dos", "das", "e", "em", "no", "na", "nos", "nas", "para"
     * @param {string} bairro - Nome do bairro
     * @returns {string} - Nome do bairro com os caracteres iniciais em maiúsculos
     */
    static titleCaseBairro(bairro = '') {
        const exceptions = ['de', 'da', 'do', 'dos', 'das', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para'];
        const words = bairro.split(' ');

        return words.map((word, index) => {
            if (index === 0 || !exceptions.includes(word.toLowerCase())) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word.toLowerCase();
        }).join(' ');
    }

    /**
     * Gerar um UUIDv4 (Universally Unique Identifier) de 36 caracteres
     * @returns {string} - UUIDv4 gerado
     */
    static generateUUID() {
        return uuidv4();
    }

    /**
     * Gerar um UUIDv5 baseado em um obj
     * @param {object} obj - Objeto a ser usado como base para o UUIDv5
     * @returns {string} - UUIDv5 gerado
     */
    static generateUUIDv5(obj) {
        const namespace = '3a16cbcc-a22f-4973-9714-9dcaebd2b3e3'
        const jsonString = JSON.stringify(obj);
        const hash = uuidv5(jsonString, namespace);
        return hash;
    }

    static generateSimpleHash() {
        return crypto.randomBytes(4).toString('hex'); // Gera uma string hexadecimal de 8 caracteres
    }

    /**
     * Encontra métodos em uma instância
     * @param {object} instance Instância da classe criada
     * @param {string} fn_name Nome da função para pesquisar se há o método na classe criada
     * @returns {Array<string>}
     */
    static findMethods(instance, fn_name = '') {
        const proto = Object.getPrototypeOf(instance);
        return Object
            .getOwnPropertyNames(proto)
            .filter((name) => {
                const prop = proto[name];

                if (fn_name === '') return typeof prop === 'function' && name !== 'constructor';

                return typeof prop === 'function' && name !== 'constructor' && name === fn_name;
            });
    };

    /**
     * Divide um nome completo em primeiro nome e sobrenome
     * @param {string} name Nome completo a ser dividido
     * @return {object} Objeto contendo o primeiro nome e o sobrenome
     */
    static splitName(name) {
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')?.slice(1)?.join(' ') || null; // Juntar o restante do nome como sobrenome
        return {
            firstName,
            ...(lastName && { lastName })
        };
    }
}