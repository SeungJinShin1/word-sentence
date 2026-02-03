const HangulHelper = {
    CHOSUNG_LIST: ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
    isHangul: (char) => {
      const code = char.charCodeAt(0);
      return code >= 0xAC00 && code <= 0xD7A3;
    },
    getChosungChar: (char) => {
      if (!HangulHelper.isHangul(char)) return char;
      const code = char.charCodeAt(0) - 0xAC00;
      const chosungIndex = Math.floor(code / 28 / 21);
      return HangulHelper.CHOSUNG_LIST[chosungIndex];
    },
    convertToChosung: (str) => {
      return str.split('').map(char => HangulHelper.getChosungChar(char)).join('');
    }
  };
  
  export default HangulHelper;