"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
// this file is served as a boilerplate template for writing more complex transformations
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const transformAST = (context) => { };
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';
