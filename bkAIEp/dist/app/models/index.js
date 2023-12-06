"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prediction = exports.Notification = exports.Exam = exports.Event = exports.Patient = exports.User = exports.Permission = exports.Role = void 0;
// @import_models
const patientModel_1 = require("../models/patientModel");
Object.defineProperty(exports, "Patient", { enumerable: true, get: function () { return patientModel_1.PatientModel; } });
const eventModel_1 = require("../models/eventModel");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return eventModel_1.EventModel; } });
const examModel_1 = require("../models/examModel");
Object.defineProperty(exports, "Exam", { enumerable: true, get: function () { return examModel_1.ExamModel; } });
const notificationModel_1 = require("../models/notificationModel");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notificationModel_1.NotificationModel; } });
const predictionModel_1 = require("../models/predictionModel");
Object.defineProperty(exports, "Prediction", { enumerable: true, get: function () { return predictionModel_1.PredictionModel; } });
const userModel_1 = require("../models/userModel");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return userModel_1.UserModel; } });
const permissionModel_1 = require("../models/permissionModel");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return permissionModel_1.PermissionModel; } });
const roleModel_1 = require("../models/roleModel");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return roleModel_1.RoleModel; } });
//# sourceMappingURL=index.js.map