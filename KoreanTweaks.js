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
            }
        ]
    };
    const result = SV.showCustomDialog(form);
    for (var i = 0; i < notes.length; ++i) {
        tweakKorean(notes[i], result.answers["S"], result.answers["E"]);
    }
    SV.finish();
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function tweakKorean(note, correct_s, distinguish_e) {
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
                case 'ㅑ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "a"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅐ':
                    if (distinguish_e) {
                        note.setLanguageOverride("english");
                        syllable_phonemes = ["ae"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅒ':
                    if (distinguish_e) {
                        note.setLanguageOverride("english");
                        syllable_phonemes = ["y", "ae"];
                    }
                    else if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "e"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅕ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "@"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅖ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "e"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅙ':
                    if (distinguish_e) {
                        note.setLanguageOverride("english");
                        syllable_phonemes = ["w", "ae"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅛ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "U"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅟ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["y", ":\\i"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅠ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["j", "u"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                case 'ㅣ':
                    if (correct_s && "ㅅㅆ".includes(onsetN[onset])) {
                        note.setLanguageOverride("mandarin");
                        syllable_phonemes = ["i"];
                    }
                    else {
                        note.setLanguageOverride("korean");
                    }
                    break;
                default:
                    note.setLanguageOverride("korean");
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
            else if ("english" == note.getLanguageOverride()) {
                switch (onsetN[onset]) {
                    case 'ㄱ':
                        syllable_phonemes = ["g"].concat(syllable_phonemes);
                        break;
                    case 'ㄲ':
                        syllable_phonemes = ["cl", "g"].concat(syllable_phonemes);
                        break;
                    case 'ㄴ':
                        syllable_phonemes = ["n"].concat(syllable_phonemes);
                        break;
                    case 'ㄷ':
                        syllable_phonemes = ["d"].concat(syllable_phonemes);
                        break;
                    case 'ㄸ':
                        syllable_phonemes = ["cl", "d"].concat(syllable_phonemes);
                        break;
                    case 'ㄹ':
                        syllable_phonemes = ["dx"].concat(syllable_phonemes);
                        break;
                    case 'ㅁ':
                        syllable_phonemes = ["m"].concat(syllable_phonemes);
                        break;
                    case 'ㅂ':
                        syllable_phonemes = ["b"].concat(syllable_phonemes);
                        break;
                    case 'ㅃ':
                        syllable_phonemes = ["cl", "b"].concat(syllable_phonemes);
                        break;
                    case 'ㅅ':
                        if (syllable_phonemes[0] == "y") {
                            syllable_phonemes = ["sh"].concat(syllable_phonemes.slice(1));
                        }
                        else if (["iy"].indexOf(syllable_phonemes[0]) >= 0) {
                            syllable_phonemes = ["sh"].concat(syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅆ':
                        if (syllable_phonemes[0] == "y") {
                            syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes.slice(1));
                        }
                        else if (["iy"].indexOf(syllable_phonemes[0]) >= 0) {
                            syllable_phonemes = ["sh", "sh"].concat(syllable_phonemes);
                        }
                        else {
                            syllable_phonemes = ["s", "s"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅇ':
                        break;
                    case 'ㅈ':
                        if (syllable_phonemes[0] == "y") {
                            syllable_phonemes = ["jh"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["jh"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅉ':
                        if (syllable_phonemes[0] == "y") {
                            syllable_phonemes = ["cl", "jh"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["cl", "jh"].concat(syllable_phonemes);
                        }
                        break;
                    case 'ㅊ':
                        if (syllable_phonemes[0] == "y") {
                            syllable_phonemes = ["ch"].concat(syllable_phonemes.slice(1));
                        }
                        else {
                            syllable_phonemes = ["ch"].concat(syllable_phonemes);
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
                    default:
                        syllable_phonemes = ["hh"].concat(syllable_phonemes);
                        break;
                }
                switch (codaN[coda]) {
                    case ' ':
                        break;
                    case 'ㄴ': case 'ㄵ': case 'ㄶ':
                        syllable_phonemes.push("n");
                        break;
                    case 'ㄹ': case 'ㄼ': case 'ㄽ': case 'ㄾ': case 'ㅀ':
                        syllable_phonemes.push("l");
                        break;
                    case 'ㄻ': case 'ㅁ':
                        syllable_phonemes.push("m");
                        break;
                    case 'ㅇ':
                        syllable_phonemes.push("ng");
                        break;
                    case 'ㄷ': case 'ㅅ': case 'ㅆ': case 'ㅈ': case 'ㅊ': case 'ㅌ': case 'ㅎ':
                        syllable_phonemes.push("d");
                        break;
                    case 'ㄿ': case 'ㅂ': case 'ㅄ': case 'ㅍ':
                        syllable_phonemes.push("b");
                        break;
                    default:
                        syllable_phonemes.push("g");
                        break;
                }
            }
            else if ("korean" == note.getLanguageOverride()) {
                note.setPhonemes(null);
                return;
            }
        }
        else {
            return;
        }
        phonemes = phonemes.concat(syllable_phonemes);
    }
    note.setPhonemes(phonemes.join(" "));
}