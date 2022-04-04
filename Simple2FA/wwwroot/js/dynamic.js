//Dynamic set
function joinDyn(outer, arrDyns) {
    for (var i = 0; i < arrDyns.length; i++) {
        var main = (i == 0) ? outer : arrDyns[i - 1];
        main.appendChild(arrDyns[i]);
    }
}

//DYNAMIC TEXT ELEMENT
function dynT(txt) {
    var xx = document.createTextNode(txt);
    return xx;
}

//SECONDARY DYNAMIC ELEMENTS
function dyn2(type, attStr) {
    try {
        var xx = document.createElement(type);

        if (attStr != null) {
            var arr = attStr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                if (att[0] == "innerHTML") {
                    xx.innerHTML = att[1].replace(/\\/g, "|");
                } else if (type == "img" && att[0] == "src") {
                    xx.setAttribute("src", "../images/" + att[1]);
                } else {
                    att[1] = att[1].replace(/~/g, "=");
                    xx.setAttribute(att[0], att[1]);
                }
            }
        }
    } catch (e) {
        //console.log("dyn error: type=" + type + ", attStr=" + attStr + " : e=" + e);
    }

    return xx;
}
//DYNAMIC ELEMENTS
function dyn(type, attStr, appnd) {
    if (type.indexOf("|") > 0) {
        appnd = attStr;
        attStr = type.substring(type.indexOf("|") + 1, type.length);
        type = type.split("|")[0];
        console.log("dynstr = " + type + ", " + attStr + ", " + ((appnd == null) ? "null" : appnd));
    }

    try {
        var xx = document.createElement(type);
        if (type == "input" && attStr.indexOf("autocomplete") == -1) {
            xx.setAttribute("autocomplete", "off");
        }
        var icon = "", btn = "", iAttr = "", iHTML = "", iid = "", iClass = "", xClass = "", iSize = "", iiSize = "", iBorder = "", iClick = "", id = "", iStyle = "";

        if (attStr != null) {
            var arr = attStr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                if (att.length == 1) {
                    att = ("innerHTML=" + arr[i]).split("=");
                }
                att[1] = att[1].replace(/\/\//g, "|");

                if (att[0] == "innerHTML") {
                    iHTML = att[1].replace(/\\/g, "|").replace(/&nbsp;/g, " ");
                    iHTML = (iHTML == "_") ? "&nbsp;" : iHTML;
                } else if (att[0] == "ihtml") {
                    iHTML = att[1].replace(/\\/g, "|").replace(/&nbsp;/g, " ");
                } else if (att[0] == "icon") {
                    icon = att[1];
                } else if (att[0] == "btn") {
                    btn = att[1];
                    icon = att[1];
                } else if (att[0] == "class") {
                    xClass = att[1];
                } else if (att[0] == "isize") {
                    iSize = att[1];
                } else if (att[0] == "iisize") {
                    iSize = att[1]; iiSize = att[1];
                } else if (att[0] == "iborder") {
                    iBorder = att[1];
                } else if (att[0] == "iclick") {
                    iClick = att[1];
                } else if (att[0] == "iid") {
                    iid = att[1];
                } else if (att[0] == "iclass") {
                    iClass = att[1];
                } else if (att[0] == "iAttr") {
                    iAttr = att[1];
                } else if (type == "img" && att[0] == "src") {
                    xx.setAttribute("src", "../images/" + att[1]);
                } else if (att[0] == "id") {
                    att[1] = att[1].replace(/~/g, "=").replace(/`/g, "'");
                    id = att[1];
                    xx.setAttribute(att[0], att[1]);
                } else {
                    att[1] = att[1].replace(/~/g, "=").replace(/`/g, "'");
                    xx.setAttribute(att[0], att[1]);
                }

                //one off
                if (att[0] == "istyle") {
                    iStyle = att[1];
                }
            }
        }
    } catch (e) {
        //console.log("dyn error: type=" + type + ", attStr=" + attStr + " : e=" + e);
    }

    if (xClass != "" && icon == "") { xx.setAttribute("class", xClass); }

    if (type == "textarea" && iHTML != "") {
        xx.innerHTML = iHTML;
    } else if (icon == "" && iHTML != "") {
        var xhtml = document.createElement("L");
        xhtml.innerHTML = iHTML;
        xx.appendChild(xhtml);
    } else if (icon == "") {
        xx.appendChild(dynT(iHTML));
    } else if (btn != "") {
        console.log("btn activated");
        iSize = (iiSize == "") ? ((iSize == "") ? "20" : "30") : iiSize;

        xx.appendChild(dyn2("img",
            ((iid != "") ? "id=" + iid + "|" : "") +
            ((iClick != "") ? "onclick=" + iClick + "|" : "") +
            ((iClass != "") ? "class=" + iClass + "|" : "class=iBtn|") +
            "style=cursor:pointer;width:" + iSize + "px; height:" + iSize + "px; " +
            ((iBorder != "") ? iBorder + ";" : "") +
            ((iStyle != "") ? iStyle + ";" : "") +
            "padding-right:0px|src=" + btn));
        //xx.appendChild(dyn2(((type == "a") ? "a" : "label"), ((xClass != "") ? "class=" + xClass + "|" : "") +
        //    ((id != "") ? "id=" + id + "_HTML|" : "") +
        //    "style=padding-left:5px;padding-right:5px;" + ((iStyle != "") ? iStyle : "") + "|innerHTML=" + iHTML));
    } else {
        //console.log(icon);
        var img = true;
        if (icon.indexOf(".") == -1) { img = false; }
        //console.log(iClick);

        if (img) {
            iSize = (iiSize == "") ? ((iSize == "") ? "20" : "30") : iiSize;

            xx.appendChild(dyn2("img",
                ((iid != "") ? "id=" + iid + "|" : "") +
                ((iClick != "") ? "onclick=" + iClick + "|" : "") +
                ((iClass != "") ? "class=" + iClass + "|" : "") +
                "style=width:" + iSize + "px; height:" + iSize + "px; " +
                ((iBorder != "") ? iBorder + ";" : "") +
                ((iStyle != "") ? iStyle + ";" : "") +
                "padding-right:0px|src=" + icon));
            xx.appendChild(dyn2(((type == "a") ? "a" : "label"), ((xClass != "") ? "class=" + xClass + "|" : "") +
                ((id != "") ? "id=" + id + "_HTML|" : "") +
                "style=padding-left:5px;padding-right:5px;" + ((iStyle != "") ? iStyle : "") + "|innerHTML=" + iHTML));
        }
        else {
            xx.appendChild(dyn2(icon,
                ((xClass != "") ? "class=" + xClass + "|" : "") +
                ((iClick != "") ? "onclick=" + iClick + "|" : "") +
                ((id != "") ? "id=" + id + "_HTML|" : "") +
                "innerHTML=" + iHTML));
        }
    }

    if (appnd != null) { xx.appendChild(appnd); }

    return xx;
}

//CREATE MAIN SECTIONS
function section(container, elems) {
    var main = document.getElementById(container);

    for (var i = 0; i < elems.length; i++) {
        if (elems[i] != "") {
            var arr = elems[i].split("|");
            //type = 1st elem
            var type = arr[0];
            //remove 1st elem from array
            arr.shift();
            //create string from arr
            var elem = arr.join("|");
            ////console.log("29: " + elem);

            var link = dyn(type, elem,);
            main.appendChild(link);
        }
    }
}
function arrsection(container, elems) {
    var main = document.getElementById(container);
    var link;
    for (var i = 0; i < elems.length; i++) {
        var els = elems[i].split("^");
        var type = [], elem = [];

        for (var x = 0; x < els.length; x++) {
            var arr = els[x].split("|");
            type.push(arr[0]);
            arr.shift();
            elem.push(arr.join("|"));

            link = dyn(type[x], elem[x]);
            main.appendChild(link);
            main = link;
        }
    }
}
function xsection(container, elems) {
    var main = container;

    for (var i = 0; i < elems.length; i++) {
        var arr = elems[i].split("|");
        //type = 1st elem
        var type = arr[0];
        //remove 1st elem from array
        arr.shift();
        //create string from arr
        var elem = arr.join("|");
        ////console.log("29: " + elem);

        var link = dyn(type, elem);
        main.appendChild(link);

        return main;
    }
}

//CREATE SECTION TABLES
function sectionTable(container, table, tx, txAttr, txAppend, tbAttr) {
    //container for table
    var main = null;
    if (container != "") { main = document.getElementById(container); }

    //get or create table
    var tb = null;
    if (document.getElementById(table) != null) {
        //get
        tb = document.getElementById(table);
    }
    else {
        //create
        tb = dyn("table", "id=" + table);
        if (tbAttr != null) {
            var arr = tbAttr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                att[1] = att[1].replace(/~/g, "=");
                tb.setAttribute(att[0], att[1]);
            }
        }
    }

    //name TR segment
    if (tx == "tr") {
        txAttr = (txAttr == null) ? "" : txAttr;
        txAttr = "name=" + table + "_TR" + ((txAttr != "") ? "|" : "") + txAttr;
    }

    //build segment
    var sect = dyn(tx);
    if (txAttr != null) {
        txAttr = txAttr.replace(/~/g, "<");

        var arr = txAttr.split("|");
        for (var i = 0; i < arr.length; i++) {
            var att = arr[i].split("=");
            if (att.length == 1) {
                att = ("innerHTML=" + att[0]).split("=");
            }

            if (att[0] == "innerHTML") {
                att[1] = (att[1] == "_") ? "&nbsp;" : att[1];
                sect.innerHTML = att[1];
            } else {
                try {
                    att[1] = att[1].replace(/~/g, "=");
                    sect.setAttribute(att[0], att[1]);
                } catch (ex) { }
            }
            if (txAppend != null) {
                sect.appendChild(txAppend);
            }
        }
    }

    //insert TR or TD
    if (tx == "tr") {
        tb.appendChild(sect);
    } else if (tx == "td") {
        var arrTR = document.getElementsByName(table + "_TR");
        var tr = arrTR[arrTR.length - 1];
        tr.appendChild(sect);
    }

    if (main != null) { main.appendChild(tb); }
}
