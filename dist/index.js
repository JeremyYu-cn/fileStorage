'use strict';

var path = require('path');
var fs = require('fs');
var readline = require('readline');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const config = {
    baseUrl: path__default['default'].resolve(process.cwd(), 'file_data'),
};

function getFileIsExists(path) {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            else
                resolve(true);
        });
    });
}
function checkIsFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.stat(fileName, (err, stats) => {
            if (err)
                reject(err);
            else {
                resolve(stats.isFile());
            }
        });
    });
}
function mkdirAsync(dirPath) {
    return new Promise(async (resolve) => {
        if (await getFileIsExists(dirPath)) {
            throw new Error(`${dirPath} is exists`);
        }
        fs.mkdir(dirPath, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}
function createFile(basePath, fileName, data = '') {
    return new Promise(async (resolve) => {
        if (!(await getFileIsExists(basePath))) {
            await mkdirAsync(basePath);
        }
        const filePath = path__default['default'].resolve(basePath, fileName);
        fs.writeFile(filePath, data, { encoding: 'utf-8' }, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}

const DEFAULT_PAGE_TOTAL = 50000;
const HEAD_EXTRA = '.head';

async function createCollection({ fileName, filePath, extra, }) {
    const collectionPath = path__default['default'].resolve(filePath, fileName);
    const collectionFileName = `${Date.now()}`;
    return await createCollectionHeadFile({
        fileName: collectionFileName,
        filePath: collectionPath,
        extra,
    });
}
async function createCollectionHeadFile({ fileName, filePath, extra, }) {
    const headName = `${fileName}.${extra}`;
    const headData = {
        total: 0,
        head: headName,
        last: headName,
        indexPath: '',
    };
    const headResult = await createFile(filePath, `.head`, JSON.stringify(headData));
    const dataResult = await createCollectionDataFile({
        fileName,
        filePath,
        extra,
    });
    return headResult && dataResult;
}
async function createCollectionDataFile({ fileName, filePath, extra, prev = '', next = '', total = 0, }) {
    const writeDate = {
        prev,
        next,
        total,
        limit: DEFAULT_PAGE_TOTAL,
    };
    return await createFile(filePath, `${fileName}.${extra}`, JSON.stringify(writeDate));
}

async function getHeadData(filePath, extra = HEAD_EXTRA) {
    return JSON.parse(await fs.promises.readFile(path.resolve(filePath, extra), { encoding: 'utf8' }));
}
async function updateCollectionHead(filePath, data) {
    await fs.promises.writeFile(filePath, JSON.stringify(data));
}
function getPageHeader(fileName) {
    return new Promise((resolve) => {
        const stream = fs.createReadStream(fileName);
        const rl = readline.createInterface({
            input: stream,
        });
        rl.on('line', (chunk) => {
            resolve(JSON.parse(chunk));
            rl.close();
        });
    });
}
async function updatePageHead(fileName, data) {
    const chunk = await fs.promises.readFile(fileName, 'utf8');
    const chunkArr = chunk.split('\n');
    chunkArr[0] = JSON.stringify(data);
    return await fs.promises.writeFile(fileName, chunkArr.join('\n'));
}

async function readFileByLine({ fileName, onLine, onEnd, }) {
    if (!getFileIsExists(fileName)) {
        throw new Error('file is not exists');
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(fileName),
    });
    rl.on('line', (chunk) => {
        onLine(chunk, rl);
    });
    rl.on('close', () => {
        onEnd();
    });
}

function getSuccessStatus(data, time, msg = 'success', length = 0) {
    return {
        code: 200,
        msg,
        data,
        time: `${time} ms`,
        length: length || data.length,
    };
}
function getErrorStatus(msg, time, code = 500) {
    return {
        code,
        msg,
        time: `${time} ms`,
    };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var dayjs_min = {exports: {}};

(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
}(dayjs_min));

var dayjs = dayjs_min.exports;

function readlineFile(data) {
    return new Promise(async (resolve, reject) => {
        const { fileName } = data;
        if (!(await checkIsFile(fileName))) {
            reject(getErrorStatus(`${fileName} is not exists`));
        }
        else {
            const startTime = Date.now();
            const result = data.order === 'desc'
                ? await descReadPage(data)
                : await readPage(data);
            resolve(getSuccessStatus(result, dayjs().diff(startTime, 'ms')));
        }
    });
}
function readPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
    return new Promise((resolve) => {
        const arr = prevData;
        const ignoreNum = Array.isArray(limit) ? limit[0] : null;
        const limitNum = Array.isArray(limit) ? limit[1] : limit;
        let pageHead = {
            prev: '',
            next: '',
            total: 0,
            limit: 0,
        };
        readFileByLine({
            fileName,
            onLine: (msg, rl) => {
                if (ignoreCount === 0) {
                    pageHead = JSON.parse(msg);
                    ignoreCount++;
                    return;
                }
                if (msg === '')
                    return;
                const json = JSON.parse(msg);
                const data = JSON.parse(json.data);
                if (json.isDelete)
                    return;
                if ((!handleCondition || handleCondition(data)) &&
                    arr.length < limitNum) {
                    if (ignoreNum && ignoreNum > ignoreCount) {
                        ignoreCount++;
                    }
                    else {
                        arr.push(data);
                    }
                }
                if (arr.length >= limitNum) {
                    rl.close();
                }
            },
            onEnd: async () => {
                if (arr.length < limit && pageHead.next) {
                    const nextPath = path__default['default'].resolve(fileName, '..', pageHead.next);
                    const result = await readPage({
                        fileName: nextPath,
                        handleCondition,
                        limit,
                        order,
                    }, arr);
                    resolve(result);
                }
                else {
                    resolve(arr);
                }
            },
        });
    });
}
async function readPageWithCount({ fileName, handleCondition }, count = 0) {
    return new Promise((resolve) => {
        let ignoreCount = 0;
        const rl = readline.createInterface({
            input: fs.createReadStream(fileName),
        });
        let pageHead = {
            prev: '',
            next: '',
            total: 0,
            limit: 0,
        };
        rl.on('line', (msg) => {
            if (ignoreCount === 0) {
                ignoreCount++;
                pageHead = JSON.parse(msg);
                return;
            }
            if (msg === '')
                return;
            const json = JSON.parse(msg);
            const data = JSON.parse(json.data);
            if (json.isDelete)
                return;
            if (!handleCondition || handleCondition(data)) {
                count++;
            }
        });
        rl.on('close', async () => {
            if (pageHead.next) {
                const nextPath = path__default['default'].resolve(fileName, '..', pageHead.next);
                const result = await readPageWithCount({
                    fileName: nextPath,
                    handleCondition,
                }, count);
                resolve(result);
            }
            else {
                resolve(count);
            }
        });
    });
}
async function descReadPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
    const chunk = await fs.promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr[0]);
    chunkArr = chunkArr.reverse();
    const ignoreNum = Array.isArray(limit) ? limit[0] : null;
    const limitNum = Array.isArray(limit) ? limit[1] : limit;
    for (let i = 0, max = chunkArr.length - 1; i < max; i++) {
        const data = JSON.parse(chunkArr[i]).data;
        const json = JSON.parse(data);
        if (handleCondition && handleCondition(json)) {
            if (ignoreNum && ignoreNum > ignoreCount) {
                ignoreCount++;
            }
            else {
                prevData.push(json);
            }
        }
        if (prevData.length >= limitNum) {
            break;
        }
    }
    if (pageHead.prev && prevData.length < limitNum) {
        return await descReadPage({
            fileName: path__default['default'].resolve(fileName, '..', pageHead.prev),
            handleCondition,
            limit,
            order,
        }, prevData, ignoreCount);
    }
    else {
        return prevData;
    }
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

async function insertData({ fileName, data, headData, extra = 'fsdat', }) {
    const startTime = Date.now();
    const insertData = {
        id: v4(),
        data,
        create: Date.now(),
        next: '',
    };
    const pageHead = await getPageHeader(fileName);
    let nextPath = fileName;
    let updateCollectionData = Object.assign(headData, {
        total: ++headData.total,
    });
    const headPath = path__default['default'].resolve(fileName, '..', HEAD_EXTRA);
    if (pageHead.total === pageHead.limit) {
        const newFileName = Date.now();
        nextPath = path__default['default'].resolve(fileName, '..', `${newFileName}.${extra}`);
        await createCollectionDataFile({
            filePath: path__default['default'].resolve(fileName, '..'),
            fileName: `${newFileName}`,
            extra,
            prev: headData.last,
            total: 1,
        });
        updateCollectionData = Object.assign(updateCollectionData, {
            last: `${newFileName}.${extra}`,
        });
    }
    try {
        await fs.promises.appendFile(nextPath, `\n${JSON.stringify(insertData)}`, 'utf8');
        await updateCollectionHead(headPath, updateCollectionData);
        if (nextPath !== fileName) {
            const writePageHead = Object.assign(pageHead, {
                next: `${path__default['default'].basename(nextPath)}`,
            });
            await updatePageHead(fileName, writePageHead);
        }
        else {
            await updatePageHead(nextPath, Object.assign(pageHead, { total: ++pageHead.total }));
        }
        return getSuccessStatus([], dayjs().diff(startTime, 'ms'));
    }
    catch (err) {
        return getErrorStatus(err.message, dayjs().diff(startTime, 'ms'));
    }
}

async function handleUpdate(data) {
    const startTime = Date.now();
    const { head } = await getHeadData(data.fileName);
    const pagePath = path__default['default'].resolve(data.fileName, head);
    const result = await updateFile(Object.assign(data, {
        fileName: pagePath,
    }));
    return getSuccessStatus([], dayjs().diff(startTime, 'ms'), `${result} records changed.`);
}
async function updateFile({ fileName, updateValue, handleCondition, pageCount = 0, }) {
    const chunk = await fs.promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
        if (handleCondition && handleCondition(JSON.parse(json.data))) {
            json.data = JSON.stringify(updateValue);
            pageCount++;
        }
        val = JSON.stringify(json);
        return val;
    });
    chunkArr.unshift(JSON.stringify(pageHead));
    await fs.promises.writeFile(fileName, chunkArr.join('\n'));
    if (pageHead.next) {
        return updateFile({
            fileName: path__default['default'].resolve(fileName, '..', pageHead.next),
            updateValue,
            handleCondition,
            pageCount,
        });
    }
    else {
        return pageCount;
    }
}

async function handleDeleteRecord(data) {
    const startTime = Date.now();
    const num = await deleteRecord(data);
    return getSuccessStatus([], dayjs().diff(startTime, 'ms'), `${num} data was deleted`);
}
async function deleteRecord({ fileName, handleCondition, pageCount = 0, }) {
    const chunk = await fs.promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
        if (handleCondition && handleCondition(JSON.parse(json.data))) {
            json.isDelete = true;
            pageCount++;
        }
        val = JSON.stringify(json);
        return val;
    });
    chunkArr.unshift(JSON.stringify(pageHead));
    await fs.promises.writeFile(fileName, chunkArr.join('\n'));
    if (pageHead.next) {
        return deleteRecord({
            fileName: path__default['default'].resolve(fileName, '..', pageHead.next),
            handleCondition,
            pageCount,
        });
    }
    else {
        return pageCount;
    }
}
async function deleteCollection(fileName) {
    try {
        await fs.promises.rm(fileName, {
            recursive: true,
        });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

class Select {
    headData;
    filePath;
    totalLimit;
    constructor(filePath) {
        this.filePath = filePath;
        this.totalLimit = 10000000;
        this.headData = null;
    }
    async init() {
        await this.getHead();
        return this;
    }
    async getHead() {
        if (!this.headData) {
            this.headData = await getHeadData(this.filePath);
        }
        return this.headData;
    }
    createCondition(condition) {
        return this.controlFun(condition);
    }
    async count(...args) {
        const { head } = this.headData;
        const { where = {} } = args[0] || {};
        const readFilePath = path__default['default'].resolve(this.filePath, head);
        return await readPageWithCount({
            fileName: readFilePath,
            handleCondition: (data) => this.handleSelectCondition(data, where),
        });
    }
    select() {
        const { head, last } = this.headData;
        const { where = {}, limit, order = 'asc', } = arguments[0] || {};
        const readFilePath = path__default['default'].resolve(this.filePath, order === 'asc' ? head : last);
        return new Promise((resolve) => {
            readlineFile({
                fileName: readFilePath,
                handleCondition: (data) => this.handleSelectCondition(data, where),
                limit,
                order,
            }).then((msg) => {
                resolve(msg);
            });
        });
    }
    controlFun(condition, extraFunction) {
        return Object.assign({
            select: this.select.bind(this, condition),
            update: (data) => this.update(data, condition),
            count: this.count.bind(this, condition),
            delete: () => this.delete(condition),
        }, extraFunction);
    }
    async update({ data }, condition) {
        const result = await this.handleUpdate(condition, data);
        return result;
    }
    async insert(data) {
        const { last } = this.headData;
        return await insertData({
            fileName: path__default['default'].resolve(this.filePath, last),
            data: `${JSON.stringify(data)}`,
            headData: this.headData,
        });
    }
    async delete(condition) {
        const { head } = this.headData;
        const result = await handleDeleteRecord({
            fileName: path__default['default'].resolve(this.filePath, head),
            handleCondition: (data) => this.handleSelectCondition(data, condition.where),
        });
        return result;
    }
    handleSelectCondition(data, condition) {
        const keys = Object.keys(condition);
        return keys.every((val) => {
            const value = condition[val];
            switch (Object.prototype.toString.call(val)) {
                case '[object String]':
                case '[object Number]':
                case '[object Boolean]':
                    return value === data[val];
                default:
                    return true;
            }
        });
    }
    async handleUpdate(condition, updateValue) {
        const result = await handleUpdate({
            fileName: this.filePath,
            handleCondition: (data) => this.handleSelectCondition(data, condition),
            updateValue,
            limit: this.totalLimit,
        });
        return result;
    }
}

class Collection {
    config;
    baseUrl;
    extra;
    constructor(fileConfig) {
        this.config = config;
        this.baseUrl = '';
        this.extra = 'fsdat';
        if (fileConfig) {
            this.config = Object.assign(config, fileConfig);
        }
        this.init();
    }
    init() {
        const { baseUrl } = this.config;
        this.baseUrl = baseUrl;
    }
    async createConnection(name) {
        const filePath = path__default['default'].resolve(this.baseUrl, name);
        if (await getFileIsExists(filePath)) {
            throw new Error('collection is exists');
        }
        return await createCollection({
            filePath: this.baseUrl,
            fileName: name,
            extra: this.extra,
        }).then((msg) => {
            return msg;
        });
    }
    async getConnection(name) {
        const filePath = path__default['default'].resolve(this.baseUrl, name);
        if (!(await getFileIsExists(filePath))) {
            throw new Error('collection is not exists');
        }
        const select = new Select(filePath);
        return await select.init();
    }
    async deleteConnection(name) {
        const filePath = path__default['default'].resolve(this.baseUrl, name);
        return await deleteCollection(filePath);
    }
    async getCollectionIsExists(name) {
        const filePath = path__default['default'].resolve(this.baseUrl, `${name}`);
        return await getFileIsExists(filePath);
    }
}

module.exports = Collection;
