class commonClass {
    //静态属性
    //count = 2;
    //构造方法
    constructor() {

        this.divisors = {
            weeks: 1000 * 60 * 60 * 24 * 7,
            days: 1000 * 60 * 60 * 24,
            hours: 1000 * 60 * 60,
            minutes: 1000 * 60,
            seconds: 1000
        };

    }

    ajaxPromise(param) {
        return new Promise((resovle, reject) => {
            $.ajax({
                "type": param.type || "post",
                "async": param.async || true,
                "url": param.url,
                "data": param.data || "",
                "dataType": param.dataType || "json",
                "crossDomain": param.crossDomain || true,
                "headers": param.headers || {},
                "cache": param.cache || false,
                "xhrFields": param.xhrFields || "",
                "beforeSend": param.beforeSend || "",
                "contentType": param.contentType || "application/x-www-form-urlencoded; charset=UTF-8",
                "success": res => {
                    resovle(res);
                },
                "error": err => {
                    // console.log('ajax error');
                    // console.log(err);
                    reject(err);
                }
            })
        })
    }






    checkProgress(startDatetime, endDatetime, actualPercentage) {
        let retObj = {};
        if (startDatetime === undefined) {
            //  console.log('startDatetime is null:'+startDatetime);
            return retObj
        };


        let today = new Date().getTime();

        let passDay = this.datetimeDifference(today, startDatetime).day;
        let duration = this.datetimeDifference(endDatetime, startDatetime).day;
        let delayDays = 0;
        retObj.delayDays = delayDays;
        retObj.forecastedPercentage = (passDay <= 0 )? 0 : ( (duration > 0) ? Math.ceil( Math.min(passDay,duration) / duration * 100) : 0);
        retObj.duration = duration;
        retObj.passDay = passDay;
        retObj.actualPercentage = actualPercentage;
        if (actualPercentage >= 100) {
            retObj.status = 'complete';
        } else if ((delayDays = this.datetimeDifference(new Date().getTime(), endDatetime).day) > 0) {
            retObj.status = 'delay';
            retObj.delayDays = delayDays;
        } else {
            if (retObj.forecastedPercentage > actualPercentage) {
                retObj.status = 'risk';
            } else {
                retObj.status = 'good';
            }
        }
        return retObj;
    }

    checkImgExists(imgurl) {
        var ImgObj = new Image(); //判断图片是否存在  
        ImgObj.src = imgurl;

        console.log(ImgObj.fileSize);

        //没有图片，则返回-1  
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            console.log('true:' + imgurl);

            return true;
        } else {
            console.log('false:' + imgurl);
            return false;
        }
    }




    // Adjust datetime by day , day = number
    datatimeAdujst(dateTimeValue, day, returnType) {
        let dtObj = this.dateDatetimeFormat(dateTimeValue);
        let newDataTimeStamp = parseInt(dtObj.timestamp) + day * 24 * 60 * 60 * 1000;
        if (returnType) {
            return this.dateDatetimeFormat(newDataTimeStamp)[returnType];
        } else {
            return this.dateDatetimeFormat(newDataTimeStamp).dataObj;
        }
    }

    //d1 > d2, postive
    datetimeDifference(dateStr1, dateStr2) {
        let date1 = this.datetimeTransferToDate(dateStr1);
        let date2 = this.datetimeTransferToDate(dateStr2);
        let difference = Math.floor(date1 - date2);
        let retObj = this.dateDurationFormat(difference);
        retObj.difference = difference;
        return retObj;
    }

    dateDatetimeFormat(dateTimeValue) {
       
        // if(!dateTimeValue || dateTimeValue==undefined) {
        //     console.log('dateTimeValue is '+dateTimeValue);
        //     return false;
        // }
 
        try {
            let dtObj = this.datetimeTransferToDate(dateTimeValue);
            let MMM = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let WD = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            let SWD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            var retObj = {};
            retObj.MMM = MMM[dtObj.getMonth()];
            retObj.MMMDD = retObj.MMM + "-" + dtObj.getDate() + this.getOrdinalNum(dtObj.getDate());
            retObj.YMD = dtObj.getFullYear() + '/' + (dtObj.getMonth() + 1) + '/' + dtObj.getDate();
            retObj.MD = (dtObj.getMonth() + 1) + '/' + dtObj.getDate();
            retObj.MDSW = (dtObj.getMonth() + 1) + '/' + dtObj.getDate()+' ('+SWD[dtObj.getDay()]+')';
            retObj.WD = WD[dtObj.getDay()];
            retObj.HIS = dtObj.getHours() + ':' + dtObj.getMinutes() + ':' + dtObj.getSeconds();
            retObj.YMDHIS = retObj.YMD + ' ' + retObj.HIS;
            retObj.timestamp = dtObj.getTime();
            retObj.YYYYMMDD = dtObj.getFullYear() + this.zeroFill((dtObj.getMonth() + 1),2,"left") + this.zeroFill(dtObj.getDate(),2,"left");
            retObj.source = dateTimeValue;
            retObj.pretty = this.prettyDatetime(dateTimeValue);
            retObj.dataObj = dtObj;
            return retObj;
        } catch (e) {
            console.log(e);
            console.log(dateTimeValue);
        }


    }


    getOrdinalNum(n) {
        return (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }

    dateDurationFormat(value) {
        // var divisors = {
        //     weeks: 1000 * 60 * 60 * 24 * 7,
        //     days: 1000 * 60 * 60 * 24,
        //     hours: 1000 * 60 * 60,
        //     minutes: 1000 * 60,
        //     seconds: 1000
        // };

        function _roundIt(v) {
            return parseFloat(v.toFixed(1));
        }

        var retObj = {};
        retObj.day = _roundIt(value / this.divisors.days);
        retObj.workday = _roundIt(value / this.divisors.days);
        retObj.week = _roundIt(value / this.divisors.weeks);
        return retObj;
    }

    datetimeTransferToDate(inputValue) {

        // if(inputValue=="")
        // {
        //     console.log('inputValue is null : datetimeTransferToDate:inputValue:'+inputValue + ', unknown type:' + typeof (inputValue) + ' ,value:' + inputValue)
        // }

        if (typeof (inputValue) == 'string') {
                let _str = inputValue.replace(/-/g, '/'); // "2010/08/01";      
                return new Date(_str);
           
        }
        if (typeof (inputValue) == 'number') {
            return new Date(inputValue);
        }
        if (typeof (inputValue) == 'object') {
            //date = new Date(inputValue);
            return inputValue;
        } else {
            console.log('datetimeTransferToDate:inputValue:'+inputValue + ', unknown type:' + typeof (inputValue) + ' ,value:' + inputValue)
           
        }
    }

    findIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    getYearWeek(dateTimeValue, return_type) {
        if(dateTimeValue=="Invalid Date"||dateTimeValue==null) return null;
       
        let thisDateOriginal = this.datetimeTransferToDate(dateTimeValue);
        let thisDate = new Date(thisDateOriginal.getFullYear(), thisDateOriginal.getMonth(), thisDateOriginal.getDate(),23,59,59);

        let thisYearDate = new Date(thisDateOriginal.getFullYear(), 0, 1);
        //let day1 = thisDate.getDay() || 7;
        let dayOf1day = thisYearDate.getDay() || 7;
        let stuffDay; //to fill stuff day make the 1st day of year 7 days.

        switch (return_type) {
            case 2: //Start from Monday
                stuffDay = dayOf1day;
                break;

            default: //start from Sunday
                stuffDay = dayOf1day-1;
                break;
        }

        let YTD = this.datetimeDifference(thisDate, thisYearDate).day;
        let weekNum = thisDate.getFullYear()*100 + (Math.floor((YTD + stuffDay) / 7) + 1);

        return weekNum;


    }



    getObjByQueryString(url) {
        var theRequest = new Object();
        if (url == null) url = location.search;
        var pos = 0;
        var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result == null) {
            return theRequest;
        }

        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].substring(1);
            pos = result[i].indexOf("=");
            var objKey = result[i].substring(0, pos);
            var parastr = result[i].substring(pos + 1);
            theRequest[objKey] = parastr;
        }
        return theRequest;
    }

    getURLDocumentName(url) {
        if (url == null) url = location.href;
        var loc = url.substring(url.lastIndexOf('/') + 1, url.length).replace('#', '');
        if (loc.lastIndexOf('?') >= 0) loc = loc.substring(0, loc.lastIndexOf('?'));
        return loc;
    }

    parseURL(url) {
        let theRequest = this.getObjByQueryString(url);
        theRequest['URLDocumentName'] = this.getURLDocumentName(url);
        return theRequest;
    }


    loadJS(url, callback) {
        var script = document.createElement('script'),
            fn = callback || function () {};
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**
     * 动态加载CSS
     * @param {string} url 样式地址
     */
    loadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }




    prettyUserName(inputValue, sourceType) {
        inputValue = inputValue && inputValue.trim();
       
        
        if (inputValue == null || inputValue == '' || inputValue == undefined) {
            return {};
        }
        

        let retObj = {};
        let account = (inputValue).toLowerCase().trim();
        let email = account;

        switch (sourceType) {
            case "email":
                email = (inputValue).toLowerCase();
                var ownerRow = (email).split('@');
                account = ownerRow[0];
                break;

            default:
                break;
        }

        if(account.indexOf('@')>0)
        {
            var ownerRow = (account).split('@');
            account = ownerRow[0];
        }


        let accountRow = account.split('.');
        for (let i = 0; i < accountRow.length; i++) {
            let str = accountRow[i];
            let newStr;
            try {
                newStr = str[0].toUpperCase();
                accountRow[i] = (accountRow[i]).replace(str[0], str[0].toUpperCase())
            } catch (e) {
                console.log(e);
            }



        }

        retObj['username'] = account; //全小寫, dylan.cho        
        retObj['account'] = account; //全小寫, dylan.cho
        retObj['englishName'] = accountRow[0]; //首字母大寫, 只有名 , Dylan
        retObj['englishFullName'] = accountRow.join(' '); //首字母大寫  Dylan Cho
        retObj['email'] = email; //全小寫, dylan.cho@tpv-tech.com
        retObj['fullName'] = account; //	首字母大寫 , Dylan Cho 卓政達
        retObj['chineseName'] = account; //卓政達

        retObj=this.prettyUserNameAddition(retObj);

        return retObj;

    }

    prettyUserNameAddition(retObj)
    {
        return retObj;
    }
    

    prettyDatetime(time) {

        var date;
        var diff;
        var abs_diff;
        var day_diff;
        var abs_day_diff;
        var tense;

        date = this.datetimeTransferToDate(time)
        diff = (((new Date()).getTime() - date.getTime()) / 1000);

        abs_diff = Math.abs(diff);
        abs_day_diff = Math.floor(abs_diff / 86400);

        if (isNaN(abs_day_diff)) {
            return;
        }

        tense = diff < 0 ? 'from now' : 'ago';

        if (abs_diff < 60) {
            if (diff >= 0)
                return 'just now';
            else
                return 'in a moment';
        } else if (abs_diff < 120) {
            return '1 minute ' + tense;
        } else if (abs_diff < 3600) {
            return Math.floor(abs_diff / 60) + ' minutes ' + tense;
        } else if (abs_diff < 7200) {
            return '1 hour ' + tense;
        } else if (abs_diff < 86400) {
            return Math.floor(abs_diff / 3600) + ' hours ' + tense;
        } else if (abs_day_diff === 1) {
            if (diff >= 0)
                return 'Yesterday';
            else
                return 'Tomorrow';
        } else if (abs_day_diff < 7) {
            return abs_day_diff + ' days ' + tense;
        } else if (abs_day_diff === 7) {
            return '1 week ' + tense;
        } else if (abs_day_diff < 31) {
            return Math.ceil(abs_day_diff / 7) + ' weeks ' + tense;
        } else {
            return '> 5 weeks ' + tense;
        }
    }


    showUserProfile(value, sourceFormat, DestFormat) {
        return (this.prettyUserName(value, sourceFormat))[DestFormat];
    }


    setStorage(content,type,title) {
        if (!title) title = this.localStorageTitle;

        if (!type) type = 'session';

        let storage;
        if(type == 'session')
        {
            console.log(type);
            storage= sessionStorage;
        }
        else
        {
            console.log('lo',type);
            storage= window.localStorage;
        }
        
        try {
            storage.setItem(title, JSON.stringify(content))

        } catch (e) {
            for (var i = 0; i < storage.length; i++) {
                console.log(storage.key(i))
            }
            console.log(e);
            storage.setItem(title, JSON.stringify(content))
        } 
    }

    getStorage(type,title) {
        title = title || this.localStorageTitle;
        type = type || 'session';

        let storage;
        if(type == 'session')
        {
            storage= sessionStorage;
        }
        else
        {
            storage= window.localStorage;
        }

        return JSON.parse(storage.getItem(title));

    }





    setLocalStorage(content, title) {
        if (!title) title = this.localStorageTitle;

        try {
            window.localStorage.setItem(title, JSON.stringify(content))

        } catch (e) {
            let storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                console.log(storage.key(i))
            }
            console.log(e);
            window.localStorage.setItem(title, JSON.stringify(content))
        } 
    }

    clearLocalStorage() {
        let storage = window.localStorage;
        for (var i = 0; i < storage.length; i++) {
            window.localStorage.removeItem(storage.key(i))
        }
    }

    getCacheSize(t){
        t = t == undefined ? "l" : t;
        var obj = "";
        if(t==='l'){
            if(!window.localStorage) {
                console.log('浏览器不支持localStorage');
            }else{
                obj = window.localStorage;
            }
        }else{
            if(!window.sessionStorage) {
                console.log('浏览器不支持sessionStorage');
            }else{
                obj = window.sessionStorage;
            }
        }
        if(obj!==""){
            var size = 0;
            for(let item in obj) {
                if(obj.hasOwnProperty(item)) {
                    size += obj.getItem(item).length;
                }
            }
            console.log('当前已用存储：' + (size / 1024).toFixed(2) + 'KB');
        }
    }




    // zerofill(numb, 5, 'left/right');
    zeroFill(numb, legth, direction) {
        let result = numb.toString();
        for (let i = result.length; i < legth; i++) {
            if (direction == 'left')
                result = '0' + result;
            else
                result = result + '0';
        }
        return result;
    }

    substring(str, maxLength) {
        if(!str) return '';
        //let strLen = str.replace(/[^\x00-\xff]/g, "xx").length;
        let subLen = 0;
        let substr = str;
        for (var i = 0; i < str.length; i++) {
          subLen += str.charAt(i).match(/[^\x00-\xff]/ig) ? 2 : 1;
          if (maxLength <= subLen) {
            substr = str.slice(0, i + 1) + ((i == str.length) ? "" : "...");
            break;
          }
        }
        return substr;
      }

    //去除前後(左右)空白
    trim(str) {
        if(str)
        {
            return str.replace(/(^[\s]*)|([\s]*$)/g, "");
        }
        
    }

    //去左空白
    lTrim(str) {
        if(str)
        {
            return str.replace(/(^[\s]*)/g, "");
        }
    }

    //去除右空白
    rTrim(str) {
        if(str)
        {
            return str.replace(/([\s]*$)/g, "");
        }
    }

    setCookie(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*this.divisors.days));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    
    getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
    
    checkCookie(){
        var user=getCookie("username");
        if (user!=""){
            alert("欢迎 " + user + " 再次访问");
        }
        else {
            user = prompt("请输入你的名字:","");
              if (user!="" && user!=null){
                setCookie("username",user,30);
            }
        }
    }


}