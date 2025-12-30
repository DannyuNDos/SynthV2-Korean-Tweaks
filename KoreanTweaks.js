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
const BUTTON_TEXT = "Correct pronunciation";
function getTranslations(langCode) {
    if (langCode == "ja-jp") {
        return [
            [TITLE, "韓国語発音矯正"],
            [MESSAGE, "ハングルの歌詞が書いてある音符たちを選択して、ボタンを押してください。"],
            [NORTH_KOREAN_TEXT, "北朝鮮の発音を使う"],
            [BUTTON_TEXT, "発音を矯正"]
        ];
    }
    else if (langCode == "zh-cn") {
        return [
            [TITLE, "韩语发音校正"],
            [MESSAGE, "选择写有韩文歌词的音符们，按下按键。"],
            [NORTH_KOREAN_TEXT, "使用北朝鲜的发音"],
            [BUTTON_TEXT, "校正发音"]
        ];
    }
    else if (langCode == "zh-tw") {
        return [
            [TITLE, "韓語發音校正"],
            [MESSAGE, "選擇寫有韓文歌詞的音符們，按下按鍵。"],
            [NORTH_KOREAN_TEXT, "使用北朝鮮的發音"],
            [BUTTON_TEXT, "校正發音"]
        ];
    }
    else if (langCode == "ko-kr") {
        return [
            [TITLE, "한국어 발음교정"],
            [MESSAGE, "한글 가사가 적힌 음표들을 선택하고, 버튼을 눌러주세요."],
            [NORTH_KOREAN_TEXT, "북한식으로 발음하기"],
            [BUTTON_TEXT, "발음 교정하기"]
        ];
    }
    else if (langCode == "fr-fr") {
        return [
            [TITLE, "RÉGLAGES DU CORÉEN"],
            [MESSAGE, "Sélectionnez des notes avec les paroles de Hangul, et appuyez sur le bouton."],
            [NORTH_KOREAN_TEXT, "Utilisez la prononciation nord-coréen"],
            [BUTTON_TEXT, "Corrigez la prononciation"]
        ];
    }
    else if (langCode == "es-la") {
        return [
            [TITLE, "AJUSTES EN COREANO"],
            [MESSAGE, "Seleccione notas con las letras de Hangul, y apriete el botón."],
            [NORTH_KOREAN_TEXT, "Use la pronunciación norcoreano"],
            [BUTTON_TEXT, "Corrija la pronunciación"]
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

function tweakKorean(notes, north_korean) {
    for (var i = 0; i < notes.length; ++i) {
        const note = notes[i];
        note.setPhonemes(null);
        const get_pre_lyrics = function (j) {
            if (0 == j || notes[j - 1].getEnd() < note.getOnset()) {
                return null;
            }
            else {
                const pre_lyrics_candidate = notes[j - 1].getLyrics();
                return "-" != pre_lyrics_candidate ? pre_lyrics_candidate : get_pre_lyrics(j - 1);
            }
        };
        const pre_lyrics = get_pre_lyrics(i);
        const lyrics = note.getLyrics();
        const get_post_lyrics = function (j) {
            if (notes.length - 1 == j || note.getEnd() < notes[j + 1].getOnset()) {
                return null;
            }
            else {
                const post_lyrics_candidate = notes[j + 1].getLyrics();
                return "-" != post_lyrics_candidate ? post_lyrics_candidate : get_post_lyrics(j + 1);
            }
        };
        const post_lyrics = get_post_lyrics(i);
        var phonemes = [];
        var leading_glottal = 0;
        if ('\'' == lyrics[0]) {
            phonemes.push("cl");
            leading_glottal = 1;
        }
        var syllable_phonemes = [];
        var default_required = true;
        const jamos = decomposeHangul(lyrics[leading_glottal]);
        const pre_coda = null == pre_lyrics || 0 != leading_glottal ? null : decomposeHangul(pre_lyrics[pre_lyrics.length - 1])["coda"];
        const onset = jamos["onset"];
        const vowel = jamos["vowel"];
        const coda = jamos["coda"];
        const post_onset = null == post_lyrics || post_lyrics[0] == '\'' ? null : decomposeHangul(post_lyrics[0])["onset"];
        const post_vowel = null == post_lyrics || post_lyrics[0] == '\'' ? null : decomposeHangul(post_lyrics[0])["vowel"];
        const trailing_iotated_S = "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel);
        const onset_north_korean = north_korean && "ㅈㅉㅊ".includes(onset);
        const trailing_north_korean = north_korean && ("ㅈㅉㅊ".includes(onset) || "ㅈㅉㅊ".includes(coda) && 'ㅇ' == post_onset && !"ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel));
        switch (vowel) {
            case 'ㅏ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["a"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["6"];
                }
                break;
            case 'ㅐ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["e"];
                }
                else {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["ae"];
                }
                break;
            case 'ㅑ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "a"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["y", "a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "6"];
                }
                break;
            case 'ㅒ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "iE"];
                }
                else {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["y", "ae"];
                }
                break;
            case 'ㅓ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["o"];
                }
                else if (trailing_iotated_S || north_korean) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = [north_korean ? "ao" : "ax"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["V"];
                }
                break;
            case 'ㅔ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["e"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["eh"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["e_o"];
                }
                break;
            case 'ㅕ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "o"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S || north_korean) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["y", north_korean ? "ao" : "ax"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "V"];
                }
                break;
            case 'ㅖ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "e"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["y", "eh"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "e_o"];
                }
                break;
            case 'ㅗ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["U"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["o"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["o"];
                }
                break;
            case 'ㅘ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "a"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["w", "a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "6"];
                }
                break;
            case 'ㅙ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "e"];
                }
                else {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["w", "ae"];
                }
                break;
            case 'ㅛ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "U"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["y", "o"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "o"];
                }
                break;
            case 'ㅜ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["u"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["uw"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["u"];
                }
                break;
            case 'ㅝ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "o"];
                }
                else if (trailing_iotated_S || north_korean) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["w", north_korean ? "ao" : "ax"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "V"];
                }
                break;
            case 'ㅚ': case 'ㅞ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "e"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["w", "eh"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "e_o"];
                }
                break;
            case 'ㅟ':
                note.setLanguageOverride("mandarin");
                syllable_phonemes = ["y", ":\\i"];
                break;
            case 'ㅠ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "u"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["y", "uw"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "u"];
                }
                break;
            case 'ㅡ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i\\"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["u"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M"];
                }
                break;
            case 'ㅢ':
                if (onset_north_korean || trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i\\", ":\\i"];
                }
                else if (trailing_iotated_S) {
                    note.setLanguageOverride("japanese");
                    syllable_phonemes = ["u", "y"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M_", "i"];
                }
                break;
            case 'ㅣ':
                if (trailing_north_korean) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i"];
                }
                else if ("ㅅㅆ".includes(onset) || trailing_iotated_S) {
                    note.setLanguageOverride("english");
                    syllable_phonemes = ["iy"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["i"];
                }
                break;
            default:
                continue;
        }
        if ("mandarin" == note.getLanguageOverride()) {
            default_required = false;
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "k"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["kh"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄲ':
                    syllable_phonemes = ["cl", "k"].concat(syllable_phonemes);
                    break;
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
                        syllable_phonemes = ["l"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄷ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "t"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["th"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄸ':
                    syllable_phonemes = ["cl", "t"].concat(syllable_phonemes);
                    break;
                case 'ㄹ':
                    syllable_phonemes = ["l"].concat(syllable_phonemes);
                    break;
                case 'ㅁ':
                    syllable_phonemes = ["m"].concat(syllable_phonemes);
                    break;
                case 'ㅂ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "p"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["ph"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅃ':
                    syllable_phonemes = ["cl", "p"].concat(syllable_phonemes);
                    break;
                case 'ㅅ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        if (["j", "i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["s\\", "s\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                        }
                    }
                    else {
                        if (["j", "i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["s\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                        }
                    }
                    break;
                case 'ㅆ':
                    if (["j", "i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                        syllable_phonemes = ["s\\", "s\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅇ':
                    break;
                case 'ㅈ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", onset_north_korean ? "ts" : "ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = [onset_north_korean ? "tsh" : "ts\\h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = [onset_north_korean ? "ts" : "ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    break;
                case 'ㅉ':
                    syllable_phonemes = ["cl", onset_north_korean ? "ts" : "ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅊ':
                    syllable_phonemes = [onset_north_korean ? "tsh" : "ts\\h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅋ':
                    syllable_phonemes = ["kh"].concat(syllable_phonemes);
                    break;
                case 'ㅌ':
                    syllable_phonemes = ["th"].concat(syllable_phonemes);
                    break;
                case 'ㅍ':
                    syllable_phonemes = ["ph"].concat(syllable_phonemes);
                    break;
                case 'ㅎ':
                    if ("ㄱㄲㄳㄺㅋ".includes(pre_coda)) {
                        syllable_phonemes = ["kh"].concat(syllable_phonemes);
                    }
                    else if ("ㄷㄾㅅㅆㅊㅈㅌ".includes(pre_coda)) {
                        syllable_phonemes = ["th"].concat(syllable_phonemes);
                    }
                    else if ("ㄿㅂㅄㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["ph"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["x"].concat(syllable_phonemes);
                    }
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["n", trailing_north_korean ? "ts" : "ts\\"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(post_onset)) {
                        syllable_phonemes.push("l");
                    }
                    else {
                        syllable_phonemes.push("n");
                    }
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "s\\"] : ["l", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ts\\h"] : ["l", "th"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "m"]);
                        break;
                    }
                case 'ㅁ':
                    syllable_phonemes.push("m");
                    break;
                case 'ㅇ':
                    syllable_phonemes.push("N");
                    break;
                case 'ㅅ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "s\\" : "s");
                        break;
                    }
                case 'ㅆ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["s\\", "s\\"] : ["s", "s"]);
                        break;
                    }
                case 'ㅈ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push(trailing_north_korean ? "ts" : "ts\\");
                        break;
                    }
                case 'ㅊ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push(trailing_north_korean ? "tsh" : "ts\\h");
                        break;
                    }
                case 'ㅌ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ts\\h" : "th");
                        break;
                    }
                case 'ㅎ':
                    if ("ㄱㄷㅂㅇㅈ".includes(post_onset)) {
                        break;
                    }
                case 'ㄷ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push('ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ts\\" : "t");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "ph"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["p", "s\\", "s\\"] : ["p", "s", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ph");
                        break;
                    }
                case 'ㅂ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("p");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["cl", "k"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["k", "s\\", "s\\"] : ["k", "s", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "k"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("kh");
                        break;
                    }
                case 'ㄱ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("N");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("k");
                    }
                    break;
                default:
                    continue;
            }
            if (note.getMusicalType() == "rap") {
                note.setRapAccent(4);
            }
        }
        else if ("english" == note.getLanguageOverride()) {
            default_required = false;
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "g"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["g"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄲ':
                    syllable_phonemes = ["cl", "g"].concat(syllable_phonemes);
                    break;
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
                        syllable_phonemes = ["l"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄷ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "d"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["d"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄸ':
                    syllable_phonemes = ["cl", "d"].concat(syllable_phonemes);
                    break;
                case 'ㄹ':
                    if (' ' != pre_coda) {
                        syllable_phonemes = ["l"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["dx"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅁ':
                    syllable_phonemes = ["m"].concat(syllable_phonemes);
                    break;
                case 'ㅂ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "b"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["b"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅃ':
                    syllable_phonemes = ["cl", "b"].concat(syllable_phonemes);
                    break;
                case 'ㅅ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        if (["iy", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                        }
                    }
                    else {
                        if (["iy", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                        }
                    }
                    break;
                case 'ㅆ':
                    if (["iy", "y"].indexOf(syllable_phonemes[0]) != -1) {
                        syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅇ':
                    break;
                case 'ㅈ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "jh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["ch"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["jh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    break;
                case 'ㅉ':
                    syllable_phonemes = ["cl", "jh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅊ':
                    syllable_phonemes = ["ch"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅋ':
                    syllable_phonemes = ["k"].concat(syllable_phonemes);
                    break;
                case 'ㅌ':
                    syllable_phonemes = ["t"].concat(syllable_phonemes);
                    break;
                case 'ㅍ':
                    syllable_phonemes = ["p"].concat(syllable_phonemes);
                    break;
                case 'ㅎ':
                    if ("ㄱㄲㄳㄺㅋ".includes(pre_coda)) {
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else if ("ㄷㄾㅅㅆㅊㅈㅌ".includes(pre_coda)) {
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else if ("ㄿㅂㅄㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["hh"].concat(syllable_phonemes);
                    }
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["n", "jh"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(post_onset)) {
                        syllable_phonemes.push("l");
                    }
                    else {
                        syllable_phonemes.push("n");
                    }
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "b"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "sh"] : ["l", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ch"] : ["l", "t"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("dx");
                        break;
                    }
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "m"]);
                        break;
                    }
                case 'ㅁ':
                    syllable_phonemes.push("m");
                    break;
                case 'ㅇ':
                    syllable_phonemes.push("ng");
                    break;
                case 'ㅅ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "sh" : "s");
                        break;
                    }
                case 'ㅆ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["sh", "sh"] : ["s", "s"]);
                        break;
                    }
                case 'ㅈ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("jh");
                        break;
                    }
                case 'ㅊ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ch");
                        break;
                    }
                case 'ㅌ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ch" : "t");
                        break;
                    }
                case 'ㅎ':
                    if ("ㄱㄷㅂㅇㅈ".includes(post_onset)) {
                        break;
                    }
                case 'ㄷ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push('ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "jh" : "d");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["b", "sh", "sh"] : ["b", "s", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("p");
                        break;
                    }
                case 'ㅂ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("b");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["cl", "g"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["g", "sh", "sh"] : ["g", "s", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["l", "g"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("k");
                        break;
                    }
                case 'ㄱ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("ng");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("g");
                    }
                    break;
                default:
                    continue;
            }
        }
        else if ("japanese" == note.getLanguageOverride()) {
            default_required = false;
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "g"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["g"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄲ':
                    syllable_phonemes = ["cl", "g"].concat(syllable_phonemes);
                    break;
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
                        syllable_phonemes = ["r"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄷ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "d"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["d"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄸ':
                    syllable_phonemes = ["cl", "d"].concat(syllable_phonemes);
                    break;
                case 'ㄹ':
                    syllable_phonemes = ["r"].concat(syllable_phonemes);
                    break;
                case 'ㅁ':
                    syllable_phonemes = ["m"].concat(syllable_phonemes);
                    break;
                case 'ㅂ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "b"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["b"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅃ':
                    syllable_phonemes = ["cl", "b"].concat(syllable_phonemes);
                    break;
                case 'ㅅ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        if (["i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                        }
                    }
                    else {
                        if (["i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                            syllable_phonemes = ["sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                        }
                    }
                    break;
                case 'ㅆ':
                    if (["i", "y"].indexOf(syllable_phonemes[0]) != -1) {
                        syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅇ':
                    break;
                case 'ㅈ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "j"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["ch"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["j"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    break;
                case 'ㅉ':
                    syllable_phonemes = ["cl", "j"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅊ':
                    syllable_phonemes = ["ch"].concat(syllable_phonemes[0] == "y" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅋ':
                    syllable_phonemes = ["k"].concat(syllable_phonemes);
                    break;
                case 'ㅌ':
                    syllable_phonemes = ["t"].concat(syllable_phonemes);
                    break;
                case 'ㅍ':
                    syllable_phonemes = ["p"].concat(syllable_phonemes);
                    break;
                case 'ㅎ':
                    if ("ㄱㄲㄳㄺㅋ".includes(pre_coda)) {
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else if ("ㄷㄾㅅㅆㅊㅈㅌ".includes(pre_coda)) {
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else if ("ㄿㅂㅄㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["h"].concat(syllable_phonemes);
                    }
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["n", "j"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(post_onset)) {
                        syllable_phonemes.push("r");
                    }
                    else {
                        syllable_phonemes.push("n");
                    }
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["r", "b"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["r", "sh"] : ["r", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["r", "ch"] : ["r", "t"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    syllable_phonemes.push("r");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["r", "m"]);
                        break;
                    }
                case 'ㅁ':
                    syllable_phonemes.push("m");
                    break;
                case 'ㅇ':
                    syllable_phonemes.push("N");
                    break;
                case 'ㅅ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "sh" : "s");
                        break;
                    }
                case 'ㅆ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["sh", "sh"] : ["s", "s"]);
                        break;
                    }
                case 'ㅈ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("j");
                        break;
                    }
                case 'ㅊ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ch");
                        break;
                    }
                case 'ㅌ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ch" : "t");
                        break;
                    }
                case 'ㅎ':
                    if ("ㄱㄷㅂㅇㅈ".includes(post_onset)) {
                        break;
                    }
                case 'ㄷ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push('ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "j" : "d");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["r", "p"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["b", "sh", "sh"] : ["b", "s", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("p");
                        break;
                    }
                case 'ㅂ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("b");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["cl", "g"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["g", "sh", "sh"] : ["g", "s", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes = syllable_phonemes.concat(["r", "g"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("k");
                        break;
                    }
                case 'ㄱ':
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("N");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("g");
                    }
                    break;
                default:
                    continue;
            }
        }
        else if ("korean" == note.getLanguageOverride()) {
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["k_t"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["g"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄲ':
                    syllable_phonemes = ["k_t"].concat(syllable_phonemes);
                    break;
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["l"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄷ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["t_t"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["d"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㄸ':
                    syllable_phonemes = ["t_t"].concat(syllable_phonemes);
                    break;
                case 'ㄹ':
                    if (' ' != pre_coda) {
                        default_required = false;
                        syllable_phonemes = ["l"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["4"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅁ':
                    syllable_phonemes = ["m"].concat(syllable_phonemes);
                    break;
                case 'ㅂ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["p_t"].concat(syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["b"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅃ':
                    syllable_phonemes = ["p_t"].concat(syllable_phonemes);
                    break;
                case 'ㅅ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["s_t"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["s"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅆ':
                    syllable_phonemes = ["s_t"].concat(syllable_phonemes);
                    break;
                case 'ㅇ':
                    break;
                case 'ㅈ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["ts\\h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["ts\\_h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if (syllable_phonemes[0] == "j") {
                        default_required = false;
                        syllable_phonemes = ["dz\\"].concat(syllable_phonemes.slice(1));
                    }
                    else {
                        syllable_phonemes = ["dz\\"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅉ':
                    if (syllable_phonemes[0] == "j") {
                        default_required = false;
                        syllable_phonemes = ["ts\\h"].concat(syllable_phonemes.slice(1));
                    }
                    else {
                        syllable_phonemes = ["ts\\h"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅊ':
                    if (syllable_phonemes[0] == "j") {
                        default_required = false;
                        syllable_phonemes = ["ts\\_h"].concat(syllable_phonemes.slice(1));
                    }
                    else {
                        syllable_phonemes = ["ts\\_h"].concat(syllable_phonemes);
                    }
                    break;
                case 'ㅋ':
                    syllable_phonemes = ["k"].concat(syllable_phonemes);
                    break;
                case 'ㅌ':
                    syllable_phonemes = ["t"].concat(syllable_phonemes);
                    break;
                case 'ㅍ':
                    syllable_phonemes = ["p"].concat(syllable_phonemes);
                    break;
                case 'ㅎ':
                    if ("ㄱㄲㄳㄺㅋ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                    }
                    else if ("ㄷㄾㅅㅆㅊㅈㅌ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
                    }
                    else if ("ㄿㅂㅄㅍ".includes(pre_coda)) {
                        default_required = false;
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["h"].concat(syllable_phonemes);
                    }
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["n", "dz\\"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    if ("ㄹㄼㄽㄾㅀ".includes(post_onset)) {
                        syllable_phonemes.push("l");
                    }
                    else {
                        syllable_phonemes.push("n");
                    }
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["l", "b"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["l", "s_t"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ts\\_h"] : ["l", "t"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.push("4");
                        break;
                    }
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["l", "m"]);
                        break;
                    }
                case 'ㅁ':
                    syllable_phonemes.push("m");
                    break;
                case 'ㅇ':
                    syllable_phonemes.push("N");
                    break;
                case 'ㅅ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.push("s");
                        break;
                    }
                case 'ㅆ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.push("s_t");
                        break;
                    }
                case 'ㅈ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.push("dz\\");
                        break;
                    }
                case 'ㅊ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.push("ts\\_h");
                        break;
                    }
                case 'ㅌ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ts\\_h" : "t");
                        break;
                    }
                case 'ㅎ':
                    if ("ㄱㄷㅂㅇㅈ".includes(post_onset)) {
                        default_required = false;
                        break;
                    }
                case 'ㄷ':
                    default_required = false;
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push('ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "dz\\" : "d");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["b", "s_t"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("p");
                        break;
                    }
                case 'ㅂ':
                    default_required = false;
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("b");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["k_t"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["g", "s_t"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes = syllable_phonemes.concat(["l", "g"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("k");
                        break;
                    }
                case 'ㄱ':
                    default_required = false;
                    if ("ㄴㄹㅁ".includes(post_onset)) {
                        syllable_phonemes.push("N");
                    }
                    else if ('ㅎ' != post_onset) {
                        syllable_phonemes.push("g");
                    }
                    break;
                default:
                    continue;
            }
        }
        phonemes = phonemes.concat(syllable_phonemes);
        if (!default_required) {
            note.setPhonemes(phonemes.join(" "));
        }
    }
}

var checkValue = SV.create("WidgetValue");
checkValue.setValue(false);

var buttonValue = SV.create("WidgetValue");
buttonValue.setValueChangeCallback(function () {
    tweakKorean(
        SV.getMainEditor().getSelection().getSelectedNotes().sort(function (note1, note2) { return note1.getOnset() - note2.getOnset(); }),
        checkValue.getValue()
    );
});

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
                        "value": checkValue
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
