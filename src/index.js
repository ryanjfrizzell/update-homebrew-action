"use strict";
/*
 * Copyright (C) 2018-2020 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var github_1 = require("@actions/github");
var path_1 = require("path");
var execa_1 = require("execa");
var handlebars_1 = require("handlebars");
var fs_extra_1 = require("fs-extra");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var workspace, packageName, templatePath, authToken, tapRepo, srcRepo, tmpDir, octokit, brewRepoDir, formulaDir, fullTemplatePath, templateString, template, latestRelease, version, releaseId, assets, tarballUrl, sha256, formula, formulaPath, existingFormula, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 18, , 19]);
                    workspace = GITHUB_WORKSPACE || "";
                    packageName = core.getInput("packageName");
                    templatePath = core.getInput("templatePath");
                    authToken = core.getInput("authToken");
                    tapRepo = core.getInput("tapRepo") // format: org/repo
                    ;
                    srcRepo = core.getInput("srcRepo") || github_1.context.repo.owner + "/" + github_1.context.repo.repo;
                    tmpDir = path_1.resolve(__dirname, "tmp");
                    octokit = github_1.getOctokit(authToken);
                    console.log("Pulling the homebrew repo");
                    return [4 /*yield*/, fs_extra_1.ensureDir(tmpDir)];
                case 1:
                    _b.sent();
                    brewRepoDir = path_1.resolve(tmpDir, tapRepo.split("/")[1]);
                    return [4 /*yield*/, fs_extra_1.pathExists(brewRepoDir)];
                case 2:
                    if (!_b.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs_extra_1.remove(brewRepoDir)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [4 /*yield*/, execa_1["default"]("git", ["clone", "git@github.com:" + tapRepo + ".git"], { cwd: tmpDir })
                    // read the existing formula
                ];
                case 5:
                    _b.sent();
                    // read the existing formula
                    console.log("Reading currently published formula");
                    formulaDir = path_1.resolve(brewRepoDir, "Formula");
                    return [4 /*yield*/, fs_extra_1.ensureDir(formulaDir)
                        // compile the formula handlebars template
                    ];
                case 6:
                    _b.sent();
                    fullTemplatePath = path_1.resolve(workspace, templatePath);
                    return [4 /*yield*/, fs_extra_1.readFile(fullTemplatePath)];
                case 7:
                    templateString = (_b.sent()).toString();
                    template = handlebars_1["default"].compile(templateString);
                    // get the metadata from GitHub
                    console.log("Preparing formula");
                    return [4 /*yield*/, octokit.request("GET /repos/" + srcRepo + "/releases/latest")];
                case 8:
                    latestRelease = _b.sent();
                    version = latestRelease.data.tag_name;
                    releaseId = latestRelease.data.id;
                    return [4 /*yield*/, octokit.request("GET /repos/" + srcRepo + "/releases/" + releaseId + "/assets")];
                case 9:
                    assets = _b.sent();
                    tarballUrl = lodash_1.find(assets.data, function (a) { return a.name.includes("macos"); }).browser_download_url;
                    return [4 /*yield*/, utils_1.getUrlChecksum(tarballUrl, "sha256")];
                case 10:
                    sha256 = _b.sent();
                    formula = template({
                        version: version,
                        tarballUrl: tarballUrl,
                        sha256: sha256
                    });
                    formulaPath = path_1.resolve(formulaDir, packageName + ".rb");
                    return [4 /*yield*/, fs_extra_1.pathExists(formulaPath)];
                case 11:
                    if (!(_b.sent())) return [3 /*break*/, 13];
                    return [4 /*yield*/, fs_extra_1.readFile(formulaPath)];
                case 12:
                    _a = (_b.sent()).toString();
                    return [3 /*break*/, 14];
                case 13:
                    _a = "";
                    _b.label = 14;
                case 14:
                    existingFormula = _a;
                    if (!(formula === existingFormula)) return [3 /*break*/, 15];
                    console.log("No changes to formula");
                    return [3 /*break*/, 17];
                case 15:
                    console.log("Writing new formula to " + formulaPath);
                    return [4 /*yield*/, fs_extra_1.writeFile(formulaPath, formula)
                        // This is commented until https://github.com/Homebrew/brew/pull/8589 is merged.
                        // // check if the formula is OK
                        // console.log("Auditing formula")
                        // await execa("brew", ["audit", formulaPath])
                    ];
                case 16:
                    _b.sent();
                    // This is commented until https://github.com/Homebrew/brew/pull/8589 is merged.
                    // // check if the formula is OK
                    // console.log("Auditing formula")
                    // await execa("brew", ["audit", formulaPath])
                    console.log("commit and push to git");
                    require('simple-git')().add(formulaPath).commit("update to ${version}").push(['--tags']);
                    _b.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    error_1 = _b.sent();
                    core.setFailed(error_1.message);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
run();
