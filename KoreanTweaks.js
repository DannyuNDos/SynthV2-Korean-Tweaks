function getClientInfo() {
    return {
        "name": "Korean Tweaks",
        "category": "Unofficial language support",
        "author": "Dannyu NDos",
        "versionNumber": 0,
        "minEditorVersion": 67840
    };
};

function main() {
    const notes = SV.getMainEditor().getSelection().getSelectedNotes();
    if (0 == notes.length) {
        SV.showMessageBox("Korean Tweaks", "Select notes before execution of this script.");
        SV.finish();
        return;
    }
    tweakKorean(notes);
    SV.finish();
};

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

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function tweakKorean(notes) {
    for (var i = 0; i < notes.length; ++i) {
        const note = notes[i];
        const pre_lyrics = 0 == i || notes[i-1].getEnd() < note.getOnset() ? null : notes[i-1].getLyrics();
        const lyrics = note.getLyrics();
        const post_lyrics = notes.length - 1 == i || note.getEnd() < notes[i+1].getOnset() ? null : notes[i+1].getLyrics();
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
        switch (vowel) {
            case 'ㅏ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["6"];
                }
                break;
            case 'ㅐ':
                note.setLanguageOverride("english");
                syllable_phonemes = ["ae"];
                break;
            case 'ㅑ':
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "6"];
                }
                break;
            case 'ㅒ':
                note.setLanguageOverride("english");
                syllable_phonemes = ["y", "ae"];
                break;
            case 'ㅓ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["@"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["V"];
                }
                break;
            case 'ㅔ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["e"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["e_o"];
                }
                break;
            case 'ㅕ':
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "@"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "V"];
                }
                break;
            case 'ㅖ':
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "e"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "e_o"];
                }
                break;
            case 'ㅗ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["U"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["o"];
                }
                break;
            case 'ㅘ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "a"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "6"];
                }
                break;
            case 'ㅙ':
                note.setLanguageOverride("english");
                syllable_phonemes = ["w", "ae"];
                break;
            case 'ㅛ':
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "U"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "o"];
                }
                break;
            case 'ㅜ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["u"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["u"];
                }
                break;
            case 'ㅝ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "@"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "V"];
                }
                break;
            case 'ㅚ': case 'ㅞ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["w", "e"];
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
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["j", "u"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["j", "u"];
                }
                break;
            case 'ㅡ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i\\"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M"];
                }
                break;
            case 'ㅢ':
                if ("ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i\\", ":\\i"];
                }
                else {
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M", "j"];
                    default_required = false;
                }
                break;
            case 'ㅣ':
                if ("ㅅㅆ".includes(onset) || "ㄽㅄㅅㅆ".includes(coda) && 'ㅇ' == post_onset && "ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel)) {
                    note.setLanguageOverride("mandarin");
                    syllable_phonemes = ["i"];
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
                        syllable_phonemes = ["cl", "ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else if ("ㄶㅀㅎ".includes(pre_coda)) {
                        syllable_phonemes = ["ts\\h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    else {
                        syllable_phonemes = ["ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    }
                    break;
                case 'ㅉ':
                    syllable_phonemes = ["cl", "ts\\"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
                    break;
                case 'ㅊ':
                    syllable_phonemes = ["ts\\h"].concat(syllable_phonemes[0] == "j" ? syllable_phonemes.slice(1) : syllable_phonemes);
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
                    syllable_phonemes = ["x"].concat(syllable_phonemes);
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat([":n", "ts\\"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    syllable_phonemes.push(":n");
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "s\\"] : ["l", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ts\\h"] : ["l", "th"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "m"]);
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
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["s\\", "s\\"] : ["s", "s"]);
                        break;
                    }
                case 'ㅈ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ts\\");
                        break;
                    }
                case 'ㅊ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ts\\h");
                        break;
                    }
                case 'ㅌ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ts\\h" : "th");
                        break;
                    }
                case 'ㅎ':
                    if ('ㅇ' == post_onset) {
                        break;
                    }
                case 'ㄷ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push(":n");
                    }
                    else {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "ts\\" : "t");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "ph"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["p", "s\\"] : ["p", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("ph");
                        break;
                    }
                case 'ㅂ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else {
                        syllable_phonemes.push("p");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["cl", "k"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["k", "s\\"] : ["k", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "k"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("kh");
                        break;
                    }
                case 'ㄱ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("N");
                    }
                    else {
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
        if ("english" == note.getLanguageOverride()) {
            default_required = false;
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    syllable_phonemes = ["hh"].concat(syllable_phonemes);
                    break;
                default:
                    continue;
            }
            switch (coda) {
                case ' ':
                    break;
                case 'ㄵ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["n", "jh"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    syllable_phonemes.push("n");
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "b"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "sh"] : ["l", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ch"] : ["l", "t"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "m"]);
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
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["sh", "sh"] : ["s", "s"]);
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
                    if ('ㅇ' == post_onset) {
                        break;
                    }
                case 'ㄷ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "jh" : "d");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["b", "sh"] : ["b", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("p");
                        break;
                    }
                case 'ㅂ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else {
                        syllable_phonemes.push("b");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["cl", "g"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["g", "sh"] : ["g", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.concat(["l", "g"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("k");
                        break;
                    }
                case 'ㄱ':
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("ng");
                    }
                    else {
                        syllable_phonemes.push("g");
                    }
                    break;
                default:
                    continue;
            }
        }
        if ("korean" == note.getLanguageOverride()) {
            switch (onset) {
                case 'ㄱ':
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄹㄼㄽㄾㅀ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    if ("ㄱㄲㄳㄵㄷㄺㄻㄼㄾㄿㅂㅄㅅㅆㅈㅊㅋㅌㅍ".includes(pre_coda)) {
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
                    syllable_phonemes = ["h"].concat(syllable_phonemes);
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
                        syllable_phonemes.concat(["n", "dz\\"]);
                        break;
                    }
                case 'ㄶ':
                case 'ㄴ':
                    syllable_phonemes.push("n");
                    break;
                case 'ㄼ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["l", "b"]);
                        break;
                    }
                case 'ㄽ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["l", "s"]);
                        break;
                    }
                case 'ㄾ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? ["l", "ts\\_h"] : ["l", "t"]);
                        break;
                    }
                case 'ㅀ':
                case 'ㄹ':
                    syllable_phonemes.push("l");
                    break;
                case 'ㄻ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["l", "m"]);
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
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        break;
                    }
                case 'ㄷ':
                    default_required = false;
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("n");
                    }
                    else {
                        syllable_phonemes.push("ㅑㅒㅕㅖㅛㅟㅠㅣ".includes(post_vowel) ? "dz\\" : "d");
                    }
                    break;
                case 'ㄿ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["l", "p"]);
                        break;
                    }
                case 'ㅄ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["b", "s"]);
                        break;
                    }
                case 'ㅍ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("p");
                        break;
                    }
                case 'ㅂ':
                    default_required = false;
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("m");
                    }
                    else {
                        syllable_phonemes.push("b");
                    }
                    break;
                case 'ㄲ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["k_t"]);
                        break;
                    }
                case 'ㄳ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["g", "s"]);
                        break;
                    }
                case 'ㄺ':
                    if ('ㅇ' == post_onset) {
                        default_required = false;
                        syllable_phonemes.concat(["l", "g"]);
                        break;
                    }
                case 'ㅋ':
                    if ('ㅇ' == post_onset) {
                        syllable_phonemes.push("k");
                        break;
                    }
                case 'ㄱ':
                    default_required = false;
                    if ("ㄴㅁ".includes(post_onset)) {
                        syllable_phonemes.push("ng");
                    }
                    else {
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
