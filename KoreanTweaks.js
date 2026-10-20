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
const OE_TEXT = "Pronounce ㅚ as a monophthong";
const BUTTON_TEXT = "Correct pronunciation";
function getTranslations(langCode) {
    if (langCode == "ja-jp") {
        return [
            [TITLE, "韓国語発音矯正"],
            [MESSAGE, "ハングルの歌詞が書いてある音符たちを選択して、ボタンを押してください。"],
            [NORTH_KOREAN_TEXT, "北朝鮮の発音を使う"],
            [OE_TEXT, "ㅚを単母音として発音する"],
            [BUTTON_TEXT, "発音を矯正"]
        ];
    }
    else if (langCode == "zh-cn") {
        return [
            [TITLE, "韩语发音校正"],
            [MESSAGE, "选择写有韩文歌词的音符们，按下按键。"],
            [NORTH_KOREAN_TEXT, "使用北朝鲜的发音"],
            [OE_TEXT, "将ㅚ发音为单元音"],
            [BUTTON_TEXT, "校正发音"]
        ];
    }
    else if (langCode == "zh-tw") {
        return [
            [TITLE, "韓語發音校正"],
            [MESSAGE, "選擇寫有韓文歌詞的音符們，按下按鍵。"],
            [NORTH_KOREAN_TEXT, "使用北朝鮮的發音"],
            [OE_TEXT, "將ㅚ發音為單元音"],
            [BUTTON_TEXT, "校正發音"]
        ];
    }
    else if (langCode == "ko-kr") {
        return [
            [TITLE, "한국어 발음교정"],
            [MESSAGE, "한글 가사가 적힌 음표들을 선택하고, 버튼을 눌러주세요."],
            [NORTH_KOREAN_TEXT, "북한식으로 발음하기"],
            [OE_TEXT, "ㅚ를 단모음으로 발음하기"],
            [BUTTON_TEXT, "발음 교정하기"]
        ];
    }
    else if (langCode == "fr-fr") {
        return [
            [TITLE, "RÉGLAGES DU CORÉEN"],
            [MESSAGE, "Sélectionnez des notes avec les paroles de Hangul, et appuyez sur un bouton."],
            [NORTH_KOREAN_TEXT, "Utiliser la prononciation nord-coréen"],
            [OE_TEXT, "Prononcer ㅚ comme un monophtong"],
            [BUTTON_TEXT, "Corriger la prononciation"]
        ];
    }
    else if (langCode == "es-la") {
        return [
            [TITLE, "AJUSTES EN COREANO"],
            [MESSAGE, "Seleccione notas con las letras de Hangul, y apriete un botón."],
            [NORTH_KOREAN_TEXT, "Usar la pronunciación norcoreano"],
            [OE_TEXT, "Pronunciar ㅚ como un monoptongo"],
            [BUTTON_TEXT, "Corregir la pronunciación"]
        ];
    }
    else if (langCode == "de-de") {
        return [
            [TITLE, "KOREANISCH ÄNDERUNGEN"],
            [MESSAGE, "Wählen Sie die Noten mit Hangeul-Texten und drücken Sie eine Taste."],
            [NORTH_KOREAN_TEXT, "Benutzen die nordkoreanisch Aussprache"],
            [OE_TEXT, "Pronounciere ㅚ als Monophthong"],
            [BUTTON_TEXT, "Korrigieren die Aussprache"]
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
        return null;
    }
}

function tweakKorean(note, phonemeStr, northKorean, oe) {
    const jamos = decomposeHangul(note.getLyrics());
    if (jamos == null) {
        return;
    }
    var newPhonemeStr = phonemeStr;
    function replacer(regex, replacement) {
        const candidate = newPhonemeStr.replace(new RegExp(/(^|\s)/.source + regex.source + /(\s|$)/.source, "g"), "$1" + replacement + "$2");
        if (candidate != phonemeStr) {
            newPhonemeStr = candidate;
            return true;
        }
        return false;
    }
    if (northKorean && "ㅑㅒㅕㅖㅛㅟㅠㅣ".indexOf(jamos.vowel) == -1) {
        replacer(/ts\\/, "ts"); replacer(/dz\\/, "d z"); replacer(/ts\\_t/, "cl ts"); replacer(/ts\\_h/, "tsh");
    }
    if (northKorean) {
        replacer(/V/, "O");
    }
    if (oe && jamos.vowel == "ㅚ") {
        replacer(/w e/, "2");
    }
    replacer(/w i/, "H i");
    if ("ㅐㅒㅙ".indexOf(jamos.vowel) != -1) {
        replacer(/e/, "E");
    }
    if (phonemeStr != newPhonemeStr) {
        note.setPhonemes(newPhonemeStr);
    }
}

var northKoreanCheckValue = SV.create("WidgetValue");
northKoreanCheckValue.setValue(false);

var oeCheckValue = SV.create("WidgetValue");
oeCheckValue.setValue(false);

var buttonValue = SV.create("WidgetValue");
buttonValue.setValueChangeCallback(function () {
    const mainEditor = SV.getMainEditor();
    const selectedNotes = mainEditor.getSelection().getSelectedNotes().sort(function (note1, note2) { return note1.getOnset() - note2.getOnset(); });
    for (var i = 0; i < selectedNotes.length; ++i) {
        const note = selectedNotes[i];
        if (decomposeHangul(note.getLyrics()) != null) {
            note.setPhonemes(null);
            note.setAttributes({ "phoneset": "xsampa" });
        }
    }
    function callback() {
        const phonemes = SV.getPhonemesForGroup(mainEditor.getCurrentGroup());
        for (var i = 0; i < selectedNotes.length; ++i) {
            const note = selectedNotes[i];
            const j = note.getIndexInParent();
            tweakKorean(note, phonemes[j], northKoreanCheckValue.getValue(), oeCheckValue.getValue());
        }
    }
    SV.setTimeout(400, callback);
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
                        "value": northKoreanCheckValue
                    }
                ]
            },
            {
                "type": "Container",
                "columns": [
                    {
                        "type": "CheckBox",
                        "text": SV.T(OE_TEXT),
                        "value": oeCheckValue
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
