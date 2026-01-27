"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheme = exports.initSetting = exports.initHotKey = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const defaultSetting_1 = __importDefault({ default: {
  common: {
    langId: 'en-us'
  }
}});
const initHotKey = async () => {
    const hotkeyPath = path_1.default.join(global.lxDataPath, 'hotkey.json');
    if ((0, fs_1.existsSync)(hotkeyPath)) {
        try {
            const data = JSON.parse((0, fs_1.readFileSync)(hotkeyPath, 'utf8'));
            return data;
        }
        catch (error) {
            console.error('Failed to read hotkey config:', error);
        }
    }
    return {
        local: {
            enable: false,
            keys: {},
        },
        global: {
            enable: false,
            keys: {},
        },
    };
};
exports.initHotKey = initHotKey;
const initSetting = async () => {
    const settingPath = path_1.default.join(global.lxDataPath, 'setting.json');
    let setting = { ...defaultSetting_1.default };
    if ((0, fs_1.existsSync)(settingPath)) {
        try {
            const data = JSON.parse((0, fs_1.readFileSync)(settingPath, 'utf8'));
            setting = { ...setting, ...data };
        }
        catch (error) {
            console.error('Failed to read setting:', error);
        }
    }
    // 保存设置
    (0, fs_1.writeFileSync)(settingPath, JSON.stringify(setting, null, 2), 'utf8');
    return { setting };
};
exports.initSetting = initSetting;
const getTheme = () => {
    return {
        id: 'default',
        name: '默认主题',
        isDark: false,
        colors: {
            primary: '#409EFF',
            secondary: '#6C757D',
            success: '#67C23A',
            warning: '#E6A23C',
            danger: '#F56C6C',
            info: '#909399',
            light: '#F5F7FA',
            dark: '#303133',
        },
    };
};
exports.getTheme = getTheme;
