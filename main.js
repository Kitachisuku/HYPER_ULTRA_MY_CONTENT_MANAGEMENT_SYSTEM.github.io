//  データ
var datas = [
    //  0
    [
        //  CSS部分
        //  0
        [
            //  datas[0][0][0]  背景色
            "#FFFFFF",
            //  datas[0][0][1]  文字色
            "#000000"
        ]
    ]
];

//  CSSメニューが開いているかどうか
var isCSSMenuOpen = false;

//  現在選択している要素
var nowSelectedElement = null;

//  装飾用
document.getElementById('cssmenu').addEventListener("toggle",e => {moveMenu()});

//  背景色変更
function onChangeBackground()
{
    datas[0][0][0] = document.getElementById("backColorChooser").value; //  データに色を反映
    document.getElementById('cmsbody').style.backgroundColor = getDatas("backcolor");   //  色を反映
}

//  文字色変更
function onChangeForeColor()
{
    datas[0][0][1] = document.getElementById("foreColorChooser").value; //  データに色を反映
    document.getElementById('cmsbody').style.color = getDatas("forecolor");   //  色を反映
}

//  タグ用
function addTag()
{
    //  とりあえず取得
    let text = document.getElementById('tagText').value;
    let id = document.getElementById('tagId').value;

    //  テキストが何か入力されていない場合は警告を出す
    if(text != "")
    {
        //  色々取得
        let forecolor = document.getElementById('tagForeColor').value;
        let backcolor = document.getElementById('tagBackColor').value;
        let typestr = document.getElementById('textType');
    
        //  タイプを取得する用
        let type = "p";

        //  pの場合は上で指定してるのでいらない
        switch(typestr.value)
        {
            case "まとまり(div要素)":
                type = "div";
                break;
            case "見出し1(h1要素)":
                type = "h1";
                break;
            case "見出し2(h2要素)":
                type = "h2";
                break;
            case "見出し3(h3要素)":
                type = "h3";
                break;
            case "見出し4(h4要素)":
                type = "h4";
                break;
            case "見出し5(h5要素)":
                type = "h5";
                break;
            case "見出し6(h6要素)":
                type = "h6";
                break;
        }

        //  エレメントを作成
        let element = document.createElement(type);

        //  空白じゃないのならID設定
        if(id != "") element.id = id;

        //  同上
        if(forecolor != "#000000") element.style.color = forecolor;

        //  同上
        if(backcolor != "#ffffff") element.style.backgroundColor = backcolor;

        // テキスト設定
        element.innerHTML = text;

        //  テキストをいじれるようにする
        element.contentEditable = true;

        //  テキスト変更を横のメニューに反映
        element.onkeyup = function(){
            document.getElementById('editingElemText').value = element.innerHTML;
        };

        //  クリック時の処理
        element.onclick = function(){
            //  テキストを反映
            document.getElementById('editingElemText').value = element.innerHTML;

            //  IDを反映
            document.getElementById('editingElemId').value = element.id;

            //  rgbcolor.jsを使う
            //  文字色が指定されている場合は反映
            if(element.style.color != "")
            {
                let fcolor = new RGBColor(element.style.color);
                document.getElementById('editingElemFColor').value = fcolor.toHex();
            }else
            {
                document.getElementById('editingElemFColor').value = getDatas("forecolor");
            }
            
            //  背景色が指定されている場合は反映
            if(element.style.backgroundColor != "")
            {
                let bcolor = new RGBColor(element.style.backgroundColor);
                document.getElementById('editingElemBColor').value = bcolor.toHex();
            }else
            {
                document.getElementById('editingElemBColor').value = getDatas("backcolor");
            }

            //  ボタンを有効にしておく
            document.getElementById('editingDoneButton').disabled = false;
            document.getElementById('editingDelButton').disabled = false;

            //  選択中の要素設定
            nowSelectedElement = element;
        };

        //  本体にテキストを入れる
        document.getElementById('cmsbody').appendChild(element);   
    }else
    {
        //  文字がない時のエラー
        alert("文字がないです");
    }
}

//  HTML出力用
function exoprtHTML()
{
    //  何回も参照するのがめんどくさいので取得
    let docChild = document.getElementById('cmsbody').children;

    //  要素の数を取得
    let docLen = docChild.length;

    //  テキスト部分定義
    let text = '<!DOCTYPE html>\n<head>\n<title>Test</title>\n<meta charset="utf-8">\n</head>\n<body>';

    //  くりかえしで要素を作成
    for(i = 0;i < docLen;i++)
    {
        //  テキスト編集用の部分を取り除く
        docChild[i].removeAttribute("contenteditable");
        text += "\n";
        text += "<" + docChild[i].nodeName;

        //  ID追加
        if(docChild[i].id != "")
        {
            text += ' id="';
            text += docChild[i].id;
            text += '"';
        }

        //  style追加
        if(docChild[i].style.color != "" || docChild[i].style.backgroundColor != "")
        {
            text += ' style="';
            if(docChild[i].style.color != "")
            {
                //  文字色追加
                text += "color: ";
                text += docChild[i].style.color;
                text += ";";
            }
            if(docChild[i].style.backgroundColor != "")
            {
                //   背景色追加
                text += "background-color: ";
                text += docChild[i].style.backgroundColor;
                text += ";";
            }
            text += '"';
        }

        text += ">";
        text += docChild[i].innerHTML;
        text += "</" + docChild[i].nodeName + ">";
    }

    //  最後の仕上げ
    text += "\n</body>\n</html>";

    //  ファイル名定義
    const filename = "index.html";

    //  ダウンロードを開始
    if(navigator.msSaveBlob)
    {
        navigator.msSaveBlob(new Blob([text],{type: "text/plain"}),filename);
    }else
    {
        //  ダウンロード要素を作成
        let a = document.createElement('a');

        //  URLを作成
        a.href = URL.createObjectURL(new Blob([text],{type: "text/plain"}));

        //  ダウンロードするファイル名を指定
        a.download = filename;

        //  FireFox用
        document.body.appendChild(a);

        a.click();

        //  FireFox用
        document.body.removeChild(a);
    }

    //  生成用でconetnteditableを変更したのでそれを治す
    for(i = 0;i < docLen;i++)
    {
        //  テキスト編集用の部分を取り除く
        docChild[i].contentEditable = "true";
    }
}

//  要素を削除する用
function deleteSelectedElement()
{
    //  確認
    if(confirm("本当に要素を削除してよろしいですか?"))
    {
        nowSelectedElement.remove();
        nowSelectedElement = null;
        document.getElementById('editingDoneButton').disabled = true;
        document.getElementById('editingDelButton').disabled = true;
        document.getElementById('editingElemText').value = "";
        document.getElementById('editingElemId').value = "";
        document.getElementById('editingElemFColor').value = "#000000";
        document.getElementById('editingElemBColor').value = "#ffffff";
    }
}

//  変更を確定
function changeEditData()
{
    //  textだけは判定に使うから取得
    let text = document.getElementById('editingElemText').value;

    if(text != "")
    {
        //  変更したデータを取得
        let id = document.getElementById('editingElemId').value;
        let backColor = new RGBColor(document.getElementById('editingElemBColor').value).toRGB();
        let foreColor = new RGBColor(document.getElementById('editingElemFColor').value).toRGB();

        //  要素の方に設定を反映
        nowSelectedElement.innerHTML = text;
        nowSelectedElement.id = id;
        nowSelectedElement.style.backgroundColor = backColor;
        nowSelectedElement.style.color = foreColor;
    }else
    {
        alert("文字が入力されてないです");
    }
}

//  テキストの並びを変更する用
function changeTextAlign()
{
    let align = document.getElementById('cmsTextAlign').value;
    document.getElementById('cmsbody').style.textAlign = align;
}

//  メニューを見やするくする用
function moveMenu()
{
    //  反転
    isCSSMenuOpen = !isCSSMenuOpen;

    //  CSSメニューが開かれている場合
    if(isCSSMenuOpen)
    {
        document.getElementById('tagmenu').style.top = "300px";
    }else
    {
        document.getElementById('tagmenu').style.top = "40px";
    }
}

//  datasを参照しやすく
function getDatas(text)
{
    switch(text)
    {
        case "backcolor":
            return datas[0][0][0];
        case "forecolor":
            return datas[0][0][1];
    }
    return "None";
}

//  テキスト変更時の処理
function changeData()
{
    //  テキストを反映
    nowSelectedElement.innerHTML = document.getElementById('editingElemText').value;
}

//  ID変更時の処理
function changeID()
{
    //  IDを反映
    nowSelectedElement.id = document.getElementById('editingElemId').value;
}