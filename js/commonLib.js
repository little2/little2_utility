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
                "cache": param.cache || false,
                "xhrFields": param.xhrFields || "",
                "beforeSend": param.beforeSend || "",
                "success": res => {
                    resovle(res);
                },
                "error": err => {
                    reject(err);
                }
            })
        })
    }


    checkProgress(startDatetime, endDatetime, actualPercentage) {

        if (startDatetime === undefined) {
            console.log('startDatetime is null');
            return false
        };

        let retObj = {};
        let today = new Date().getTime();

        let passDay = this.datetimeDifference(today, startDatetime).day;
        let duration = this.datetimeDifference(endDatetime, startDatetime).day;
        let delayDays = 0;
        retObj.forcastedPercentage = (duration > 0) ? Math.ceil(passDay / duration * 100) : 0;
        retObj.duration = duration;
        retObj.passDay = passDay;
        retObj.actualPercentage = actualPercentage;
        if (actualPercentage >= 100) {
            retObj.status = 'complete';
        } else if ((delayDays= this.datetimeDifference(new Date().getTime(), endDatetime).day) > 0) {
            retObj.status = 'delay';
            retObj.delayDays = delayDays;
        } else {
            if (retObj.forcastedPercentage > actualPercentage) {
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
        try{
            let dtObj = this.datetimeTransferToDate(dateTimeValue);

            let MMM = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
            var retObj = {};
            retObj.MMM = MMM[dtObj.getMonth()];
            retObj.MMMDD = retObj.MMM + "-" + dtObj.getDate() + this.getOrdinalNum(dtObj.getDate());
            retObj.YMD = dtObj.getFullYear() + '/' + (dtObj.getMonth() + 1) + '/' + dtObj.getDate();
            retObj.MD = (dtObj.getMonth() + 1) + '/' + dtObj.getDate();
            retObj.HIS = dtObj.getHours() + ':' + dtObj.getMinutes() + ':' + dtObj.getSeconds();
            retObj.YMDHIS = retObj.YMD + ' ' + retObj.HIS;
            retObj.timestamp = dtObj.getTime();
            retObj.source = dateTimeValue;
            retObj.pretty = this.prettyDatetime(dateTimeValue);
            retObj.dataObj = dtObj;
            return retObj;
        }
        catch(e){
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
            console.log(inputValue + ' unknown type:' + typeof (inputValue) + ' value:' + inputValue)
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

    getYearWeek(dateTimeValue,return_type) {      
        let thisDate = this.datetimeTransferToDate(dateTimeValue);
        let thisYearDate = new Date(thisDate.getFullYear(), 0, 1);        
        //let day1 = thisDate.getDay() || 7;
        let dayOf1day = thisYearDate.getDay() || 7;
        let stuffDay;  //to fill stuff day make the 1st day of year 7 days.

        switch(return_type)
        {
            case 2:     //Start from Monday
                stuffDay = dayOf1day-1;
            break;

            default:    //start from Sunday
                stuffDay = dayOf1day;
            break;
        }

        let YTD = this.datetimeDifference(thisDate, thisYearDate).day;      
        let weekNum = Math.floor( (YTD + stuffDay)/7) + 1
      
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
        if(inputValue==null||inputValue=='')
        {                
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

        let accountRow = account.split('.');
        for (let i = 0; i < accountRow.length; i++) {
            let str = accountRow[i];
            let newStr;
            try{
                newStr = str[0].toUpperCase();
                accountRow[i] = (accountRow[i]).replace(str[0], str[0].toUpperCase())
            }
            catch(e)
            {             
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
        return (this.prettyUserName(value,sourceFormat))[DestFormat];
    }




    setLocalStorage(content, title) {
        if(!title) title = this.localStorageTitle;
        try {
            window.localStorage.setItem(title, JSON.stringify(content))

        } catch (e) {
            this.clearLocalStorage();
            console.log(e);
            window.localStorage.setItem(title, JSON.stringify(content))
        } finally {

        }
    }
    
    clearLocalStorage() {
        let storage = window.localStorage;
        for (var i = 0; i < storage.length; i++) {
            window.localStorage.removeItem(storage.key(i))
        }
    }

}