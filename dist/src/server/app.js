"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quitApp = exports.initAppSetting = exports.setUserDataPath = exports.initGlobalData = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = require("fs");
const utils_1 = require("./utils");
const defaultSetting_1 = __importDefault({ default: {
  common: {
    langId: 'en-us'
  }
}});
const worker_1 = __importDefault(require("./worker"));
const migrate_1 = require("./utils/migrate");
const initGlobalData = () => {
    // 环境参数
    global.envParams = {
        cmdParams: {},
        deeplink: '',
    };
    // 全局数据
    global.lx = {
        inited: false,
        isSkipTrayQuit: false,
        appSetting: defaultSetting_1.default,
        worker: (0, worker_1.default)(),
        hotKey: {
            enable: true,
            config: {
                local: {
                    enable: false,
                    keys: {},
                },
                global: {
                    enable: false,
                    keys: {},
                },
            },
            state: new Map(),
        },
        theme: {
            shouldUseDarkColors: false,
            theme: {
                id: '',
                name: '',
                isDark: false,
                colors: {},
            },
        },
        player_status: {
            status: 'stoped',
            name: '',
            singer: '',
            albumName: '',
            picUrl: '',
            progress: 0,
            duration: 0,
            playbackRate: 1,
            lyricLineText: '',
            lyricLineAllText: '',
            lyric: '',
            tlyric: '',
            rlyric: '',
            lxlyric: '',
            collect: false,
            volume: 0,
            mute: false,
        },
    };
    // 静态路径
    global.staticPath = node_path_1.default.join(__dirname, '../renderer');
    // 数据路径
    (0, exports.setUserDataPath)();
};
exports.initGlobalData = initGlobalData;
const setUserDataPath = () => {
    // 在容器环境中，使用 /app/data 作为数据目录
    const dataPath = process.env.DATA_PATH || node_path_1.default.join(process.cwd(), 'data');
    if (!(0, fs_1.existsSync)(dataPath))
        (0, fs_1.mkdirSync)(dataPath, { recursive: true });
    global.lxOldDataPath = dataPath;
    global.lxDataPath = node_path_1.default.join(dataPath, 'LxDatas');
    if (!(0, fs_1.existsSync)(global.lxDataPath))
        (0, fs_1.mkdirSync)(global.lxDataPath);
};
exports.setUserDataPath = setUserDataPath;
let isInitialized = false;
const initAppSetting = async () => {
    if (!global.lx.inited) {
        const config = await (0, utils_1.initHotKey)();
        global.lx.hotKey.config.local = config.local;
        global.lx.hotKey.config.global = config.global;
        global.lx.inited = true;
    }
    if (!isInitialized) {
        let dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath);
        if (dbFileExists === null) {
            console.warn('Database verify failed, rebuilding database...');
            dbFileExists = await global.lx.worker.dbService.init(global.lxDataPath);
        }
        global.lx.appSetting = (await (0, utils_1.initSetting)()).setting;
        if (!dbFileExists)
            await (0, migrate_1.migrateDBData)().catch(err => { console.error(err); });
    }
    isInitialized ||= true;
};
exports.initAppSetting = initAppSetting;
const quitApp = () => {
    global.lx.isSkipTrayQuit = true;
    process.exit(0);
};
exports.quitApp = quitApp;
