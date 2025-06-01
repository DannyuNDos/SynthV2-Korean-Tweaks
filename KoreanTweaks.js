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
    const noteGroup = SV.getMainEditor().getCurrentGroup().getTarget();
    const automation = noteGroup.getParameter("mouthOpening");
    const notes = SV.getMainEditor().getSelection().getSelectedNotes();
    if (0 == notes.length) {
        SV.showMessageBox("Korean Tweaks", "Select notes before execution of this script.");
        SV.finish();
        return;
    }
    const form = {
        "title": "Korean Tweaks",
        "message": "Select your wanted tweaks.",
        "buttons": "OkCancel",
        "widgets": [
            {
                "name": "S", "type": "CheckBox",
                "text": "Correct palatalization of ㅅ/ㅆ",
                "default": true
            },
            {
                "name": "E", "type": "CheckBox",
                "text": "Make distinction of ㅐ/ㅔ",
                "default": false
            },
            {
                "name": "C", "type": "CheckBox",
                "text": "Correct codas ㄱ/ㄷ/ㅂ",
                "default": true
            },
            {
                "name": "OE", "type": "CheckBox",
                "text": "Pronounce ㅚ/ㅟ as a monophthong",
                "default": false
            }
        ]
    };
    const result = SV.showCustomDialog(form);
    for (var i = 0; i < notes.length; ++i) {
        tweakKorean(notes[i], automation, result.answers["S"], result.answers["E"], result.answers["C"], result.answers["OE"]);
    }
    SV.finish();
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function tweakKorean(note, automation, correct_s, distinguish_e, correct_codas, monophthong_oe) {
    const lyrics = note.getLyrics();
    var phonemes = [];
    var leading_glottal = 0;
    if ('\'' == lyrics[0]) {
        phonemes.push("cl");
        leading_glottal = 1;
    }
    for (var i = leading_glottal; i < lyrics.length; ++i) {
        var syllable_phonemes = [];
        if ('가' <= lyrics[i] && lyrics[i] <= '힣') {
            const onsetN = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
            const vowelN = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
            const codaN = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
            const syllable_index = lyrics.charCodeAt(i) - "가".charCodeAt(0);
            const coda = syllable_index % codaN.length;
            const vowel = (syllable_index - coda) / codaN.length % vowelN.length;
            const onset = ((syllable_index - coda) / codaN.length - vowel) / vowelN.length % onsetN.length;
            switch (vowelN[vowel]) {
                case 'ㅏ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["6"];
                    break;
                case 'ㅐ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["e_o"];
                    if (distinguish_e) {
                        automation.remove(note.getOnset(), note.getEnd());
                        automation.add(note.getOnset(), 0.0);
                        automation.add(note.getOnset() + 1, 1.0);
                        automation.add(note.getEnd() - 2, 1.0);
                        automation.add(note.getEnd() - 1, 0.0);
                    }
                    break;
                case 'ㅑ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "a"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅒ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "e"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["j", "e_o"];
                    }
                    if (distinguish_e) {
                        automation.remove(note.getOnset(), note.getEnd());
                        automation.add(note.getOnset(), 0.0);
                        automation.add(note.getOnset() + 1, 1.0);
                        automation.add(note.getEnd() - 2, 1.0);
                        automation.add(note.getEnd() - 1, 0.0);
                    }
                    break;
                case 'ㅓ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["V"];
                    break;
                case 'ㅔ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["e_o"];
                    break;
                case 'ㅕ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "@"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["j", "V"];
                    }
                    break;
                case 'ㅖ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "e"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["j", "e_o"];
                    }
                    break;
                case 'ㅗ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["o"];
                    break;
                case 'ㅘ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "a"];
                    break;
                case 'ㅙ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "e_o"];
                    if (distinguish_e) {
                        automation.remove(note.getOnset(), note.getEnd());
                        automation.add(note.getOnset(), 0.0);
                        automation.add(note.getOnset() + 1, 1.0);
                        automation.add(note.getEnd() - 2, 1.0);
                        automation.add(note.getEnd() - 1, 0.0);
                    }
                    break;
                case 'ㅚ':
                    if (monophthong_oe) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["y"];
                        automation.remove(note.getOnset(), note.getEnd());
                        automation.add(note.getOnset(), 0.0);
                        automation.add(note.getOnset() + 1, 0.2);
                        automation.add(note.getEnd() - 2, 0.2);
                        automation.add(note.getEnd() - 1, 0.0);
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["w", "e_o"];
                    }
                    break;
                case 'ㅛ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "U"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["j", "o"];
                    }
                    break;
                case 'ㅜ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["u"];
                    break;
                case 'ㅝ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "V"];
                    break;
                case 'ㅞ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["w", "e"];
                    break;
                case 'ㅟ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset]) || monophthong_oe) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["y", ":\\i"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["w", "i"];
                    }
                    break;
                case 'ㅠ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "u"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["j", "u"];
                    }
                    break;
                case 'ㅡ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M"];
                    break;
                case 'ㅢ':
                    note.setLanguageOverride("korean");
                    syllable_phonemes = ["M_", "i"];
                    break;
                default:
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["i"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                        syllable_phonemes = ["i"];
                    }
                    break;
            }
            if ("mandarin" == note.getLanguageOverride()) {
                switch (onsetN[onset]) {
                    case 'ㄱ':
                        syllable_phonemes = ["k"].concat(syllable_phonemes);
                        break;
                    case 'ㄲ':
                        syllable_phonemes = ["cl", "k"].concat(syllable_phonemes);
                        break;
                    case 'ㄴ':
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                        break;
                    case 'ㄷ':
                        syllable_phonemes = ["t"].concat(syllable_phonemes);
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
                        syllable_phonemes = ["p"].concat(syllable_phonemes);
                        break;
                    case 'ㅃ':
                        syllable_phonemes = ["cl", "p"].concat(syllable_phonemes);
                        break;
                    case 'ㅅ':
                        if (syllable_phonemes[0] == "j") {
                            syllable_phonemes = ["s\\"].concat(syllable_phonemes.slice(1));
                        }
                        else if (["i", "y"].indexOf(syllable_phonemes[0]) >= 0) {
                            syllable_phonemes = ["s\\"].concat(syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅆ':
                        if (syllable_phonemes[0] == "j") {
                            syllable_phonemes = ["s\\", "s\\"].concat(syllable_phonemes.slice(1));
                        }
                        else if (["i", "y"].indexOf(syllable_phonemes[0]) >= 0) {
                            syllable_phonemes = ["s\\", "s\\"].concat(syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅇ':
                        break;
                    case 'ㅈ':
                        if (syllable_phonemes[0] == "j") {
                            syllable_phonemes = ["ts\\"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["ts\\"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅉ':
                        if (syllable_phonemes[0] == "j") {
                            syllable_phonemes = ["cl", "ts\\"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["cl", "ts\\"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅊ':
                        if (syllable_phonemes[0] == "j") {
                            syllable_phonemes = ["ts\\h"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["ts\\h"].concat(syllable_phonemes);
                        }
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
                    default:
                        syllable_phonemes = ["x"].concat(syllable_phonemes);
                        break;
                }
                switch (codaN[coda]) {
                    case ' ':
                        break;
                    case 'ㄴ': case 'ㄵ': case 'ㄶ':
                        syllable_phonemes.push(":n");
                        break;
                    case 'ㄹ': case 'ㄼ': case 'ㄽ': case 'ㄾ': case 'ㅀ':
                        syllable_phonemes.push("l");
                        break;
                    case 'ㄻ': case 'ㅁ':
                        syllable_phonemes.push("m");
                        break;
                    case 'ㅇ':
                        syllable_phonemes.push("N");
                        break;
                    case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ': case 'ㅎ':
                        syllable_phonemes.push("t");
                        break;
                    case 'ㄿ': case 'ㅂ': case 'ㅄ': case 'ㅍ':
                        syllable_phonemes.push("p");
                        break;
                    default:
                        syllable_phonemes.push("k");
                        break;
                }
                if (note.getMusicalType() == "rap") {
                    note.setRapAccent(4);
                }
            }
            else if ("korean" == note.getLanguageOverride()) {
                if (correct_codas) {
                    switch (onsetN[onset]) {
                        case 'ㄱ':
                            syllable_phonemes = ["g"].concat(syllable_phonemes);
                            break;
                        case 'ㄲ':
                            syllable_phonemes = ["k_t"].concat(syllable_phonemes);
                            break;
                        case 'ㄴ':
                            syllable_phonemes = ["n"].concat(syllable_phonemes);
                            break;
                        case 'ㄷ':
                            syllable_phonemes = ["d"].concat(syllable_phonemes);
                            break;
                        case 'ㄸ':
                            syllable_phonemes = ["t_t"].concat(syllable_phonemes);
                            break;
                        case 'ㄹ':
                            syllable_phonemes = ["4"].concat(syllable_phonemes);
                            break;
                        case 'ㅁ':
                            syllable_phonemes = ["m"].concat(syllable_phonemes);
                            break;
                        case 'ㅂ':
                            syllable_phonemes = ["b"].concat(syllable_phonemes);
                            break;
                        case 'ㅃ':
                            syllable_phonemes = ["p_t"].concat(syllable_phonemes);
                            break;
                        case 'ㅅ':
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                            break;
                        case 'ㅆ':
                            syllable_phonemes = ["s_t"].concat(syllable_phonemes);
                            break;
                        case 'ㅇ':
                            break;
                        case 'ㅈ':
                            syllable_phonemes = ["dz\\"].concat(syllable_phonemes);
                            break;
                        case 'ㅉ':
                            syllable_phonemes = ["ts\\h"].concat(syllable_phonemes);
                            break;
                        case 'ㅊ':
                            syllable_phonemes = ["ts\\_h"].concat(syllable_phonemes);
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
                        default:
                            syllable_phonemes = ["h"].concat(syllable_phonemes);
                            break;
                    }
                    switch (codaN[coda]) {
                        case 'ㄱ': case 'ㄲ': case 'ㄳ': case 'ㄺ': case 'ㅋ':
                            syllable_phonemes.push("cl")
                            break;
                        case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ': case 'ㅎ':
                            syllable_phonemes.push("d");
                            break;
                        case 'ㄿ': case 'ㅂ': case 'ㅄ': case 'ㅍ':
                            syllable_phonemes.push("b");
                            break;
                        default:
                            note.setPhonemes(null);
                            return;
                    }
                }
                else {
                    note.setPhonemes(null);
                    return;
                }
            }
        }
        else {
            return;
        }
        phonemes = phonemes.concat(syllable_phonemes);
    }
    note.setPhonemes(phonemes.join(" "));
}