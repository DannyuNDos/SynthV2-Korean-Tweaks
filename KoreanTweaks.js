function getClientInfo() {
    return {
        "name": "Korean Tweaks",
        "category": "Unofficial language support",
        "author": "Dannyu NDos",
        "versionNumber": 0,
        "minEditorVersion": 131330,
        "type": "SidePanelSection"
    };
}

const TITLE = "KOREAN TWEAKS";
const MESSAGE = "Select notes with Hangul lyrics, and press the button below.";
const NORTH_KOREAN_TEXT = "Use North Korean pronunication";
const FORCE_PUTTING_TEXT = "Force putting phonemes";
const BUTTON_TEXT = "Correct pronunciation";
function getTranslations(langCode) {
    if (langCode == "ja-jp") {
        return [
            [TITLE, "韓国語発音矯正"],
            [MESSAGE, "ハングルの歌詞が書いてある音符たちを選択して、ボタンを押してください。"],
            [NORTH_KOREAN_TEXT, "北朝鮮の発音を使う"],
            [FORCE_PUTTING_TEXT, "音素を強制に入れる"],
            [BUTTON_TEXT, "発音を矯正"]
        ];
    }
    else if (langCode == "zh-cn") {
        return [
            [TITLE, "韩语发音校正"],
            [MESSAGE, "选择写有韩文歌词的音符们，按下按键。"],
            [NORTH_KOREAN_TEXT, "使用北朝鲜的发音"],
            [FORCE_PUTTING_TEXT, "强制插入音素"],
            [BUTTON_TEXT, "校正发音"]
        ];
    }
    else if (langCode == "zh-tw") {
        return [
            [TITLE, "韓語發音校正"],
            [MESSAGE, "選擇寫有韓文歌詞的音符們，按下按鍵。"],
            [NORTH_KOREAN_TEXT, "使用北朝鮮的發音"],
            [FORCE_PUTTING_TEXT, "强制插入音素"],
            [BUTTON_TEXT, "校正發音"]
        ];
    }
    else if (langCode == "ko-kr") {
        return [
            [TITLE, "한국어 발음교정"],
            [MESSAGE, "한글 가사가 적힌 음표들을 선택하고, 버튼을 눌러주세요."],
            [NORTH_KOREAN_TEXT, "북한식으로 발음하기"],
            [FORCE_PUTTING_TEXT, "음소를 강제로 넣기"],
            [BUTTON_TEXT, "발음 교정하기"]
        ];
    }
    else if (langCode == "fr-fr") {
        return [
            [TITLE, "RÉGLAGES DU CORÉEN"],
            [MESSAGE, "Sélectionnez des notes avec les paroles de Hangul, et appuyez sur le bouton."],
            [NORTH_KOREAN_TEXT, "Utiliser la prononciation nord-coréen"],
            [FORCE_PUTTING_TEXT, "Forcer l'insertion des phonèmes"],
            [BUTTON_TEXT, "Corriger la prononciation"]
        ];
    }
    else if (langCode == "es-la") {
        return [
            [TITLE, "AJUSTES EN COREANO"],
            [MESSAGE, "Seleccione notas con las letras de Hangul, y apriete el botón."],
            [NORTH_KOREAN_TEXT, "Usar la pronunciación norcoreano"],
            [FORCE_PUTTING_TEXT, "Forzar la inserción de fonemas"],
            [BUTTON_TEXT, "Corregir la pronunciación"]
        ];
    }
}

const onsetN = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const vowelN = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const codaN = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
function decomposeHangul(character) {
    if ('가' <= character && character <= '힣') {
        const syllable_index = character.charCodeAt(0) - "가".charCodeAt(0);
        const coda = syllable_index % codaN.length;
        const vowel = (syllable_index - coda) / codaN.length % vowelN.length;
        const onset = ((syllable_index - coda) / codaN.length - vowel) / vowelN.length % onsetN.length;
        return {
            "onset": onsetN[onset],
            "vowel": vowelN[vowel],
            "coda": codaN[coda]
        };
    }
    else {
        return {
            "onset": null,
            "vowel": null,
            "coda": null
        };
    }
}

function tweakKorean(noteGroup, note, phones, northKorean, fallback) {
    var defaultPhones = true;
    const jamos = decomposeHangul(note.getLyrics());
    const noteIndex = note.getIndexInParent();
    const pre_coda = 0 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex - 1).getLyrics())["coda"];
    const post_onset = noteGroup.getNumNotes() - 1 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex + 1).getLyrics())["onset"];
    var newPhones = [];
    switch (jamos["onset"]) {
        case 'ㄱ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("k_t");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("k");
            }
            else {
                newPhones.push("g");
            }
            break;
        case 'ㄲ':
            newPhones.push("k_t");
            break;
        case 'ㄴ':
            if ("ㄹㄼㄽㄾ".indexOf(pre_coda) != -1) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("t_t");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("t");
            }
            else {
                newPhones.push("d");
            }
            break;
        case 'ㄸ':
            newPhones.push("t_t");
            break;
        case 'ㄹ':
            if (' ' == pre_coda) {
                newPhones.push("4");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            newPhones.push("m");
            break;
        case 'ㅂ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("p_t");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("p");
            }
            else {
                newPhones.push("b");
            }
            break;
        case 'ㅃ':
            newPhones.push("p_t");
            break;
        case 'ㅅ':
            if (!fallback && "ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            else if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("s_t");
            }
            else {
                newPhones.push("s");
            }
            break;
        case 'ㅆ':
            if (!fallback && "ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            else {
                newPhones.push("s_t");
            }
            break;
        case 'ㅇ':
            switch (pre_coda) {
                case 'ㄱ': case 'ㄺ':
                    newPhones.push("g");
                    break;
                case 'ㄲ':
                    newPhones.push("k_t");
                    break;
                case 'ㄴ': case 'ㄶ':
                    newPhones.push("n");
                    break;
                case 'ㄷ':
                    newPhones.push("d");
                    break;
                case 'ㄹ': case 'ㅀ':
                    newPhones.push("4");
                    break;
                case 'ㅁ': case 'ㄻ':
                    newPhones.push("m");
                    break;
                case 'ㅂ': case 'ㄼ':
                    newPhones.push("b");
                    break;
                case 'ㅅ': case 'ㄽ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                        return;
                    }
                    else {
                        newPhones.push("s");
                    }
                    break;
                case 'ㅆ': case 'ㄳ': case 'ㅄ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                        return;
                    }
                    else {
                        newPhones.push("s_t");
                    }
                    break;
                case 'ㅇ':
                    newPhones.push("N");
                    break;
                case 'ㅈ': case 'ㄵ':
                    newPhones.push("dz\\");
                    break;
                case 'ㅊ':
                    newPhones.push("ts\\_h");
                    break;
                case 'ㅋ':
                    newPhones.push("k");
                    break;
                case 'ㅌ': case 'ㄾ':
                    newPhones.push("t");
                    break;
                case 'ㅍ': case 'ㄿ':
                    newPhones.push("p");
                    break;
                case 'ㅎ':
                    break;
            }
            break;
        case 'ㅈ':
            if (!fallback && northKorean) {
                tweakKorean_MandarinDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("ts\\h");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("ts\\_h");
            }
            else {
                newPhones.push("dz\\");
            }
            break;
        case 'ㅉ':
            if (!fallback && northKorean) {
                tweakKorean_MandarinDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("ts\\h");
            break;
        case 'ㅊ':
            if (!fallback && northKorean) {
                tweakKorean_MandarinDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("ts\\_h");
            break;
        case 'ㅋ':
            newPhones.push("k");
            break;
        case 'ㅌ':
            newPhones.push("t")
            break;
        case 'ㅍ':
            newPhones.push("p");
            break;
        case 'ㅎ':
            newPhones.push("h");
            break;
    }
    switch (jamos["vowel"]) {
        case 'ㅏ':
            newPhones.push("6");
            break;
        case 'ㅐ':
            if (!fallback) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("e_o");
            break;
        case 'ㅑ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("6");
            break;
        case 'ㅒ':
            if (!fallback) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("e_o");
            break;
        case 'ㅓ':
            if (!fallback && northKorean) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("V");
            break;
        case 'ㅔ':
            newPhones.push("e_o");
            break;
        case 'ㅕ':
            if (!fallback && northKorean) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("V");
            break;
        case 'ㅖ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("e_o");
            break;
        case 'ㅗ':
            newPhones.push("o");
            break;
        case 'ㅘ':
            newPhones.push("w");
            newPhones.push("6");
            break;
        case 'ㅙ': case 'ㅚ':
            if (!fallback) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("w");
            newPhones.push("e_o");
            break;
        case 'ㅛ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("o");
            break;
        case 'ㅜ':
            newPhones.push("u");
            break;
        case 'ㅝ':
            if (!fallback && northKorean) {
                tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean);
                return;
            }
            newPhones.push("w");
            newPhones.push("V");
            break;
        case 'ㅞ':
            newPhones.push("w");
            newPhones.push("e_o");
            break;
        case 'ㅟ':
            newPhones.push("w");
            newPhones.push("i");
            break;
        case 'ㅠ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            else {
                defaultPhones = false;
            }
            newPhones.push("u");
            break;
        case 'ㅡ':
            newPhones.push("M");
            break;
        case 'ㅢ':
            newPhones.push("M_");
            newPhones.push("i");
            break;
        case 'ㅣ':
            newPhones.push("i");
            break;
    }
    switch (jamos["coda"]) {
        case 'ㄱ': case 'ㄲ': case 'ㅋ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                defaultPhones = false;
                newPhones.push("g");
            }
            break;
        case 'ㄳ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else {
                defaultPhones = false;
                newPhones.push("g");
            }
            break;
        case 'ㄴ': case 'ㄶ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("n");
            }
            break;
        case 'ㄵ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("n");
            }
            else if ('ㅇ' != post_onset) {
                defaultPhones = false;
                newPhones.push("d");
            }
            break;
        case 'ㄹ': case 'ㅀ':
            if ('ㅇ' != post_onset) {
                newPhones.push("l");
            }
            break;
        case 'ㄺ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                defaultPhones = false;
                newPhones.push("g");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㄻ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            else {
                newPhones.push('l')
            }
            break;
        case 'ㄼ': case 'ㄽ': case 'ㄾ':
            newPhones.push('l');
            break;
        case 'ㄿ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                defaultPhones = false;
                newPhones.push("b");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            break;
        case 'ㅂ': case 'ㅍ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                defaultPhones = false;
                newPhones.push("b");
            }
            break;
        case 'ㅄ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else {
                defaultPhones = false;
                newPhones.push("b");
            }
            break;
        case 'ㅇ':
            if ('ㅇ' != post_onset) {
                newPhones.push("N");
            }
            break;
        case 'ㅎ':
            defaultPhones = false;
            break;
        default:
            break;
    }
    note.setLanguageOverride("korean");
    const newPhonemeSymbols = newPhones.join(" ");
    if (!defaultPhones) {
        note.setPhonemes(newPhonemeSymbols);
    }
}

function tweakKorean_FrenchDelegate(noteGroup, note, phones, northKorean) {
    const jamos = decomposeHangul(note.getLyrics());
    const noteIndex = note.getIndexInParent();
    const pre_coda = 0 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex - 1).getLyrics())["coda"];
    const post_onset = noteGroup.getNumNotes() - 1 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex + 1).getLyrics())["onset"];
    var newPhones = [];
    switch (jamos["onset"]) {
        case 'ㄱ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("g");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("k");
            }
            else {
                newPhones.push("g");
            }
            break;
        case 'ㄲ':
            newPhones.push("cl");
            newPhones.push("g");
            break;
        case 'ㄴ':
            if ("ㄹㄼㄽㄾ".indexOf(pre_coda) != -1) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("d");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("t");
            }
            else {
                newPhones.push("d");
            }
            break;
        case 'ㄸ':
            newPhones.push("cl");
            newPhones.push("d");
            break;
        case 'ㄹ':
            if (' ' == pre_coda) {
                if ("ㅐㅒㅙ".indexOf(jamos["vowel"]) != -1) {
                    tweakKorean_PortugueseDelegate(noteGroup, note, phones, northKorean);
                    return;
                }
                else {
                    tweakKorean(noteGorup, note, phones, northKorean, true);
                    return;
                }
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            newPhones.push("m");
            break;
        case 'ㅂ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("b");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("p");
            }
            else {
                newPhones.push("b");
            }
            break;
        case 'ㅃ':
            newPhones.push("cl");
            newPhones.push("b");
            break;
        case 'ㅅ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                    newPhones.push("S");
                    newPhones.push("S");
                }
                else {
                    newPhones.push("S");
                }
            }
            else if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("s");
                newPhones.push("s");
            }
            else {
                newPhones.push("s");
            }
            break;
        case 'ㅆ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                newPhones.push("S");
                newPhones.push("S");
            }
            else {
                newPhones.push("s");
                newPhones.push("s");
            }
            break;
        case 'ㅇ':
            switch (pre_coda) {
                case 'ㄱ': case 'ㄺ':
                    newPhones.push("g");
                    break;
                case 'ㄲ':
                    newPhones.push("cl");
                    newPhones.push("g");
                    break;
                case 'ㄴ': case 'ㄶ':
                    newPhones.push("n");
                    break;
                case 'ㄷ':
                    newPhones.push("d");
                    break;
                case 'ㄹ': case 'ㅀ':
                    tweakKorean(noteGorup, note, phones, northKorean, true);
                    return;
                case 'ㅁ': case 'ㄻ':
                    newPhones.push("m");
                    break;
                case 'ㅂ': case 'ㄼ':
                    newPhones.push("b");
                    break;
                case 'ㅅ': case 'ㄽ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("S");
                    }
                    else {
                        newPhones.push("s");
                    }
                    break;
                case 'ㅆ': case 'ㄳ': case 'ㅄ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("S");
                        newPhones.push("S");
                    }
                    else {
                        newPhones.push("s");
                        newPhones.push("s");
                    }
                    break;
                case 'ㅇ':
                    newPhones.push("N");
                    break;
                case 'ㅈ': case 'ㄵ':
                    newPhones.push("dZ");
                    break;
                case 'ㅊ':
                    newPhones.push("t");
                    newPhones.push("S");
                    break;
                case 'ㅋ':
                    newPhones.push("k");
                    break;
                case 'ㅌ': case 'ㄾ':
                    newPhones.push("t");
                    break;
                case 'ㅍ': case 'ㄿ':
                    newPhones.push("p");
                    break;
                case 'ㅎ':
                    break;
            }
            break;
        case 'ㅈ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("dZ");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("t");
                newPhones.push("S");
            }
            else {
                newPhones.push("dZ");
            }
            break;
        case 'ㅉ':
            newPhones.push("cl");
            newPhones.push("dZ");
            break;
        case 'ㅊ':
            newPhones.push("t");
            newPhones.push("S");
            break;
        case 'ㅋ':
            newPhones.push("k");
            break;
        case 'ㅌ':
            newPhones.push("t")
            break;
        case 'ㅍ':
            newPhones.push("p");
            break;
        case 'ㅎ':
            tweakKorean_PortugueseDelegate(noteGroup, note, phones, northKorean);
            return;
    }
    switch (jamos["vowel"]) {
        case 'ㅏ':
            newPhones.push("a");
            break;
        case 'ㅐ':
            newPhones.push("E");
            break;
        case 'ㅑ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("a");
            break;
        case 'ㅒ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("E");
            break;
        case 'ㅓ':
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅔ':
            newPhones.push("e");
            break;
        case 'ㅕ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅖ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("e");
            break;
        case 'ㅗ':
            newPhones.push("o");
            break;
        case 'ㅘ':
            newPhones.push("w");
            newPhones.push("a");
            break;
        case 'ㅙ':
            newPhones.push("w");
            newPhones.push("E");
            break;
        case 'ㅚ':
            newPhones.push("2");
            break;
        case 'ㅛ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("H");
            }
            newPhones.push("o");
            break;
        case 'ㅜ':
            newPhones.push("u");
            break;
        case 'ㅝ':
            newPhones.push("w");
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅞ':
            newPhones.push("w");
            newPhones.push("e");
            break;
        case 'ㅟ':
            newPhones.push("H");
            newPhones.push("i");
            break;
        case 'ㅠ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("H");
            }
            newPhones.push("u");
            break;
        case 'ㅡ':
            tweakKorean(noteGorup, note, phones, northKorean, true);
            return;
        case 'ㅢ':
            tweakKorean(noteGorup, note, phones, northKorean, true);
            return;
        case 'ㅣ':
            newPhones.push("i");
            break;
    }
    switch (jamos["coda"]) {
        case 'ㄱ': case 'ㄲ': case 'ㅋ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("g");
            }
            break;
        case 'ㄳ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else {
                newPhones.push("g");
            }
            break;
        case 'ㄴ': case 'ㄶ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("n");
            }
            break;
        case 'ㄵ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("n");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("d");
            }
            break;
        case 'ㄹ': case 'ㅀ':
            if ('ㅇ' != post_onset) {
                newPhones.push("l");
            }
            break;
        case 'ㄺ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("g");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㄻ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            else {
                newPhones.push('l')
            }
            break;
        case 'ㄼ': case 'ㄽ': case 'ㄾ':
            newPhones.push('l');
            break;
        case 'ㄿ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("b");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            break;
        case 'ㅂ': case 'ㅍ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("b");
            }
            break;
        case 'ㅄ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else {
                newPhones.push("b");
            }
            break;
        case 'ㅇ':
            if ('ㅇ' != post_onset) {
                newPhones.push("N");
            }
            break;
        case 'ㅎ': default:
            break;
    }
    note.setLanguageOverride("french");
    note.setPhonemes(newPhones.join(" "));
}

function tweakKorean_MandarinDelegate(noteGroup, note, phones, northKorean) {
    const jamos = decomposeHangul(note.getLyrics());
    const noteIndex = note.getIndexInParent();
    const pre_coda = 0 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex - 1).getLyrics())["coda"];
    const post_onset = noteGroup.getNumNotes() - 1 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex + 1).getLyrics())["onset"];
    var newPhones = [];
    switch (jamos["onset"]) {
        case 'ㄱ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("k");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("kh");
            }
            else {
                newPhones.push("k");
            }
            break;
        case 'ㄲ':
            newPhones.push("cl");
            newPhones.push("k");
            break;
        case 'ㄴ':
            if ("ㄹㄼㄽㄾ".indexOf(pre_coda) != -1) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("t");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("th");
            }
            else {
                newPhones.push("t");
            }
            break;
        case 'ㄸ':
            newPhones.push("cl");
            newPhones.push("t");
            break;
        case 'ㄹ':
            if (' ' == pre_coda) {
                tweakKorean(noteGroup, note, phones, northKorean, true);
                return;
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            newPhones.push("m");
            break;
        case 'ㅂ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("p");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("ph");
            }
            else {
                newPhones.push("p");
            }
            break;
        case 'ㅃ':
            newPhones.push("cl");
            newPhones.push("p");
            break;
        case 'ㅅ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                    newPhones.push("s\\");
                    newPhones.push("s\\");
                }
                else {
                    newPhones.push("s\\");
                }
            }
            else if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("s");
                newPhones.push("s");
            }
            else {
                newPhones.push("s");
            }
            break;
        case 'ㅆ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                newPhones.push("s\\");
                newPhones.push("s\\");
            }
            else {
                newPhones.push("s");
                newPhones.push("s");
            }
            break;
        case 'ㅇ':
            switch (pre_coda) {
                case 'ㄱ': case 'ㄺ':
                    newPhones.push("k");
                    break;
                case 'ㄲ':
                    newPhones.push("cl");
                    newPhones.push("k");
                    break;
                case 'ㄴ': case 'ㄶ':
                    newPhones.push("n");
                    break;
                case 'ㄷ':
                    newPhones.push("d");
                    break;
                case 'ㄹ': case 'ㅀ':
                    tweakKorean(noteGroup, note, phones, northKorean, true);
                    return;
                case 'ㅁ': case 'ㄻ':
                    newPhones.push("m");
                    break;
                case 'ㅂ': case 'ㄼ':
                    newPhones.push("p");
                    break;
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("s\\");
                    }
                    else {
                        newPhones.push("s");
                    }
                    break;
                case 'ㅆ': case 'ㄳ': case 'ㅄ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("s\\");
                        newPhones.push("s\\");
                    }
                    else {
                        newPhones.push("s");
                        newPhones.push("s");
                    }
                    break;
                case 'ㅇ':
                    newPhones.push("N");
                    break;
                case 'ㅈ': case 'ㄵ':
                    newPhones.push("ts\\");
                    break;
                case 'ㅊ':
                    newPhones.push("ts\\h");
                    break;
                case 'ㅋ':
                    newPhones.push("kh");
                    break;
                case 'ㅌ': case 'ㄾ':
                    newPhones.push("th");
                    break;
                case 'ㅍ': case 'ㄿ':
                    newPhones.push("ph");
                    break;
                case 'ㅎ':
                    break;
            }
            break;
        case 'ㅈ':
            if (northKorean && "ㅑㅒㅕㅖㅛㅠㅟㅣ".indexOf(jamos["vowel"]) == -1) {
                if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                    newPhones.push("cl");
                    newPhones.push("ts");
                }
                else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                    newPhones.push("tsh");
                }
                else {
                    newPhones.push("ts");
                }
            }
            else {
                if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                    newPhones.push("cl");
                    newPhones.push("ts\\");
                }
                else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                    newPhones.push("ts\\h");
                }
                else {
                    newPhones.push("ts\\");
                }
            }
            break;
        case 'ㅉ':
            if (northKorean && "ㅑㅒㅕㅖㅛㅠㅟㅣ".indexOf(jamos["vowel"]) == -1) {
                newPhones.push("cl");
                newPhones.push("ts");
            }
            else {
                newPhones.push("cl");
                newPhones.push("ts\\");
            }
            break;
        case 'ㅊ':
            if (northKorean && "ㅑㅒㅕㅖㅛㅠㅟㅣ".indexOf(jamos["vowel"]) == -1) {
                newPhones.push("tsh");
            }
            else {
                newPhones.push("ts\\h");
            }
            break;
        case 'ㅋ':
            newPhones.push("kh");
            break;
        case 'ㅌ':
            newPhones.push("th")
            break;
        case 'ㅍ':
            newPhones.push("ph");
            break;
        case 'ㅎ':
            newPhones.push("x");
            break;
    }
    switch (jamos["vowel"]) {
        case 'ㅏ':
            newPhones.push("a");
            break;
        case 'ㅐ': case 'ㅔ':
            newPhones.push("e");
            break;
        case 'ㅑ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("a");
            break;
        case 'ㅒ': case 'ㅖ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("e");
            break;
        case 'ㅓ':
            if (northKorean) {
                newPhones.push("o");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅕ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            if (northKorean) {
                newPhones.push("o");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅗ':
            newPhones.push("U");
            break;
        case 'ㅘ':
            newPhones.push("w");
            newPhones.push("a");
            break;
        case 'ㅙ': case 'ㅚ':
            newPhones.push("w");
            newPhones.push("e");
            break;
        case 'ㅛ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("U");
            break;
        case 'ㅜ':
            newPhones.push("u");
            break;
        case 'ㅝ':
            newPhones.push("w");
            if (northKorean) {
                newPhones.push("o");
            }
            else {
                newPhones.push("@");
            }
            break;
        case 'ㅞ':
            newPhones.push("w");
            newPhones.push("e");
            break;
        case 'ㅟ':
            newPhones.push("y");
            newPhones.push(":\\i");
            break;
        case 'ㅠ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("u");
            break;
        case 'ㅡ':
            newPhones.push("l\\");
            break;
        case 'ㅢ':
            newPhones.push("l\\");
            newPhones.push(":\\i");
            break;
        case 'ㅣ':
            newPhones.push("i");
            break;
    }
    switch (jamos["coda"]) {
        case 'ㄱ': case 'ㄲ': case 'ㅋ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("k");
            }
            break;
        case 'ㄳ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else {
                newPhones.push("k");
            }
            break;
        case 'ㄴ': case 'ㄶ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("n");
            }
            break;
        case 'ㄵ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("n");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("t");
            }
            break;
        case 'ㄹ': case 'ㅀ':
            if ('ㅇ' != post_onset) {
                newPhones.push("l");
            }
            break;
        case 'ㄺ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("k");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㄻ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            else {
                newPhones.push('l')
            }
            break;
        case 'ㄼ': case 'ㄽ': case 'ㄾ':
            newPhones.push('l');
            break;
        case 'ㄿ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("p");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            break;
        case 'ㅂ': case 'ㅍ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("p");
            }
            break;
        case 'ㅄ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else {
                newPhones.push("p");
            }
            break;
        case 'ㅇ':
            if ('ㅇ' != post_onset) {
                newPhones.push("N");
            }
            break;
        case 'ㅎ': default:
            break;
    }
    note.setLanguageOverride("mandarin");
    note.setPhonemes(newPhones.join(" "));
}

function tweakKorean_PortugueseDelegate(noteGroup, note, phones, northKorean) {
    const jamos = decomposeHangul(note.getLyrics());
    const noteIndex = note.getIndexInParent();
    const pre_coda = 0 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex - 1).getLyrics())["coda"];
    const post_onset = noteGroup.getNumNotes() - 1 == noteIndex ? null : decomposeHangul(noteGroup.getNote(noteIndex + 1).getLyrics())["onset"];
    var newPhones = [];
    switch (jamos["onset"]) {
        case 'ㄱ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("g");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("k");
            }
            else {
                newPhones.push("g");
            }
            break;
        case 'ㄲ':
            newPhones.push("cl");
            newPhones.push("g");
            break;
        case 'ㄴ':
            if ("ㄹㄼㄽㄾ".indexOf(pre_coda) != -1) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("d");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("t");
            }
            else {
                newPhones.push("d");
            }
            break;
        case 'ㄸ':
            newPhones.push("cl");
            newPhones.push("d");
            break;
        case 'ㄹ':
            if (' ' == pre_coda) {
                newPhones.push("4");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            newPhones.push("m");
            break;
        case 'ㅂ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("b");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("p");
            }
            else {
                newPhones.push("b");
            }
            break;
        case 'ㅃ':
            newPhones.push("cl");
            newPhones.push("b");
            break;
        case 'ㅅ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                    newPhones.push("S");
                    newPhones.push("S");
                }
                else {
                    newPhones.push("S");
                }
            }
            else if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("s");
                newPhones.push("s");
            }
            else {
                newPhones.push("s");
            }
            break;
        case 'ㅆ':
            if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                newPhones.push("S");
                newPhones.push("S");
            }
            else {
                newPhones.push("s");
                newPhones.push("s");
            }
            break;
        case 'ㅇ':
            switch (pre_coda) {
                case 'ㄱ': case 'ㄺ':
                    newPhones.push("g");
                    break;
                case 'ㄲ':
                    newPhones.push("cl");
                    newPhones.push("g");
                    break;
                case 'ㄴ': case 'ㄶ':
                    newPhones.push("n");
                    break;
                case 'ㄷ':
                    newPhones.push("d");
                    break;
                case 'ㄹ': case 'ㅀ':
                    newPhones.push("4");
                    break;
                case 'ㅁ': case 'ㄻ':
                    newPhones.push("m");
                    break;
                case 'ㅂ': case 'ㄼ':
                    newPhones.push("b");
                    break;
                case 'ㅅ': case 'ㄽ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("S");
                    }
                    else {
                        newPhones.push("s");
                    }
                    break;
                case 'ㅆ': case 'ㄳ': case 'ㅄ':
                    if ("ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos["vowel"]) != -1) {
                        newPhones.push("S");
                        newPhones.push("S");
                    }
                    else {
                        newPhones.push("s");
                        newPhones.push("s");
                    }
                    break;
                case 'ㅇ':
                    newPhones.push("N");
                    break;
                case 'ㅈ': case 'ㄵ':
                    newPhones.push("dZ");
                    break;
                case 'ㅊ':
                    newPhones.push("tS");
                    break;
                case 'ㅋ':
                    newPhones.push("k");
                    break;
                case 'ㅌ': case 'ㄾ':
                    newPhones.push("t");
                    break;
                case 'ㅍ': case 'ㄿ':
                    newPhones.push("p");
                    break;
                case 'ㅎ':
                    break;
            }
            break;
        case 'ㅈ':
            if ("ㄱㄲㄳㄷㄺㄿㅂㅄㅅㅆㅈㅉㅊㅋㅌㅍ".indexOf(pre_coda) != -1) {
                newPhones.push("cl");
                newPhones.push("dZ");
            }
            else if ("ㄶㅀㅎ".indexOf(pre_coda) != -1) {
                newPhones.push("tS");
            }
            else {
                newPhones.push("dZ");
            }
            break;
        case 'ㅉ':
            newPhones.push("cl");
            newPhones.push("dZ");
            break;
        case 'ㅊ':
            newPhones.push("tS");
            break;
        case 'ㅋ':
            newPhones.push("k");
            break;
        case 'ㅌ':
            newPhones.push("t")
            break;
        case 'ㅍ':
            newPhones.push("p");
            break;
        case 'ㅎ':
            newPhones.push("X");
            break;
    }
    switch (jamos["vowel"]) {
        case 'ㅏ':
            newPhones.push("a");
            break;
        case 'ㅐ':
            newPhones.push("E");
            break;
        case 'ㅑ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("a");
            break;
        case 'ㅒ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("E");
            break;
        case 'ㅓ':
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                tweakKorean(noteGroup, note, phones, northKorean, true);
                return;
            }
            break;
        case 'ㅔ':
            newPhones.push("e");
            break;
        case 'ㅕ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                tweakKorean(noteGroup, note, phones, northKorean, true);
                return;
            }
            break;
        case 'ㅖ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("e");
            break;
        case 'ㅗ':
            newPhones.push("o");
            break;
        case 'ㅘ':
            newPhones.push("w");
            newPhones.push("a");
            break;
        case 'ㅙ':
            newPhones.push("w");
            newPhones.push("E");
            break;
        case 'ㅚ':
            tweakKorean(noteGroup, note, phones, northKorean, true);
            return;
        case 'ㅛ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("o");
            break;
        case 'ㅜ':
            newPhones.push("u");
            break;
        case 'ㅝ':
            newPhones.push("w");
            if (northKorean) {
                newPhones.push("O");
            }
            else {
                tweakKorean(noteGroup, note, phones, northKorean, true);
                return;
            }
            break;
        case 'ㅞ':
            newPhones.push("w");
            newPhones.push("e");
            break;
        case 'ㅟ':
            newPhones.push("w");
            newPhones.push("i");
            break;
        case 'ㅠ':
            if ("ㅅㅆㅈㅉㅊ".indexOf(jamos["onset"]) == -1) {
                newPhones.push("j");
            }
            newPhones.push("u");
            break;
        case 'ㅡ':
            tweakKorean(noteGorup, note, phones, northKorean, true);
            return;
        case 'ㅢ':
            tweakKorean(noteGorup, note, phones, northKorean, true);
            return;
        case 'ㅣ':
            newPhones.push("i");
            break;
    }
    switch (jamos["coda"]) {
        case 'ㄱ': case 'ㄲ': case 'ㅋ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("g");
            }
            break;
        case 'ㄳ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else {
                newPhones.push("g");
            }
            break;
        case 'ㄴ': case 'ㄶ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("n");
            }
            break;
        case 'ㄵ':
            if ('ㄹ' == post_onset) {
                newPhones.push("l");
            }
            else {
                newPhones.push("n");
            }
            break;
        case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("n");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("d");
            }
            break;
        case 'ㄹ': case 'ㅀ':
            if ('ㅇ' != post_onset) {
                newPhones.push("l");
            }
            break;
        case 'ㄺ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("N");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("g");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㄻ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            else {
                newPhones.push('l')
            }
            break;
        case 'ㄼ': case 'ㄽ': case 'ㄾ':
            newPhones.push('l');
            break;
        case 'ㄿ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("b");
            }
            else {
                newPhones.push("l");
            }
            break;
        case 'ㅁ':
            if ('ㅇ' != post_onset) {
                newPhones.push("m");
            }
            break;
        case 'ㅂ': case 'ㅍ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else if ('ㅇ' != post_onset) {
                newPhones.push("b");
            }
            break;
        case 'ㅄ':
            if ("ㄴㅁ".indexOf(post_onset) != -1) {
                newPhones.push("m");
            }
            else {
                newPhones.push("b");
            }
            break;
        case 'ㅇ':
            if ('ㅇ' != post_onset) {
                newPhones.push("N");
            }
            break;
        case 'ㅎ': default:
            break;
    }
    note.setLanguageOverride("portuguese");
    note.setPhonemes(newPhones.join(" "));
}

var northKoreanCheckValue = SV.create("WidgetValue");
northKoreanCheckValue.setValue(false);

function perform() {
    const mainEditor = SV.getMainEditor();
    const selectedNotes = mainEditor.getSelection().getSelectedNotes().sort(function (note1, note2) { return note1.getOnset() - note2.getOnset(); });
    const noteGroupRef = mainEditor.getCurrentGroup();
    const noteGroup = noteGroupRef.getTarget();
    const attributes = SV.getComputedAttributesForGroup(noteGroupRef);
    for (var i = 0; i < selectedNotes.length; ++i) {
        const note = selectedNotes[i];
        const j = note.getIndexInParent();
        const phonemes = attributes[j]["phonemes"];
        if (decomposeHangul(note.getLyrics())["onset"] != null) {
            note.setPhonemes(null);
            tweakKorean(noteGroup, note, phonemes.map(function (p) { return p["symbol"]; }), northKoreanCheckValue.getValue(), false);
        }
    }
}

var buttonValue = SV.create("WidgetValue");
buttonValue.setValueChangeCallback(perform);

function getSidePanelSectionState() {
    return {
        "title": SV.T(TITLE),
        "rows": [
            {
                "type": "Label",
                "text": SV.T(MESSAGE),
            },
            {
                "type": "Container",
                "columns": [
                    {
                        "type": "CheckBox",
                        "text": SV.T(NORTH_KOREAN_TEXT),
                        "value": northKoreanCheckValue
                    }
                ]
            },
            {
                "type": "Container",
                "columns": [
                    {
                        "type": "Button",
                        "text": SV.T(BUTTON_TEXT),
                        "value": buttonValue
                    }
                ]
            }
        ]
    };
}
